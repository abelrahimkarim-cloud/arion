<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'city' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $items = collect($data['items'])->map(function ($item) {
            return [
                'variant_id' => (int) $item['variant_id'],
                'quantity' => (int) $item['quantity'],
            ];
        });

        $variantIds = $items->pluck('variant_id')->unique()->all();
        $variants = ProductVariant::with('product')->whereIn('id', $variantIds)->get()->keyBy('id');

        $aggregatedQuantities = $items->groupBy('variant_id')->map(fn($group) => $group->sum('quantity'));

        foreach ($aggregatedQuantities as $variantId => $quantity) {
            $variant = $variants->get($variantId);
            if (!$variant || $variant->stock < $quantity) {
                return response()->json(['message' => 'One or more items are out of stock.'], 422);
            }
        }

        $customer = Customer::firstOrCreate([
            'phone' => $data['phone'],
        ], [
            'name' => $data['name'],
            'city' => $data['city'],
            'address' => $data['address'],
        ]);

        $order = DB::transaction(function () use ($data, $items, $variants, $customer, $aggregatedQuantities) {
            $totalQuantity = $items->sum('quantity');
            $totalPrice = $items->reduce(function ($sum, $item) use ($variants) {
                $variant = $variants->get($item['variant_id']);
                return $sum + ($variant->price * $item['quantity']);
            }, 0);

            $firstVariantId = $items->first()['variant_id'];

            $order = Order::create([
                'customer_id' => $customer->id,
                'variant_id' => $firstVariantId,
                'status' => 'New',
                'quantity' => $totalQuantity,
                'total_price' => $totalPrice,
                'notes' => $data['notes'] ?? null,
                'city' => $data['city'],
                'address' => $data['address'],
                'whatsapp_sent' => false,
            ]);

            foreach ($items as $item) {
                $variant = $variants->get($item['variant_id']);
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $variant->product_id,
                    'variant_id' => $variant->id,
                    'quantity' => $item['quantity'],
                    'price' => $variant->price,
                ]);
            }

            foreach ($aggregatedQuantities as $variantId => $quantity) {
                ProductVariant::where('id', $variantId)->decrement('stock', $quantity);
            }

            return $order;
        });

        $setting = Setting::first();
        if ($setting && $setting->whatsapp_number) {
            $this->sendWhatsappNotification($setting->whatsapp_number, $order);
            $order->update(['whatsapp_sent' => true]);
        }

        if (config('mail.mailers.smtp.host')) {
            try {
                Mail::raw("New COD order received (#{$order->id}) from {$customer->name}.", function ($message) use ($setting) {
                    if ($setting && $setting->whatsapp_number) {
                        $message->to($setting->whatsapp_number . '@example.com');
                    }
                    $message->subject('New Order Received');
                });
            } catch (\Throwable $exception) {
                Log::error('Order email send failed', [
                    'order_id' => $order->id,
                    'exception' => $exception->getMessage(),
                ]);
            }
        }

        return response()->json(['message' => 'Order received successfully.', 'order_id' => $order->id], 201);
    }

    public function adminIndex(Request $request)
    {
        $query = Order::with(['customer', 'variant.product'])->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $query->whereHas('customer', fn($q) => $q->where('name', 'like', '%' . $request->search . '%'))
                ->orWhere('address', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->paginate(20)->withQueryString());
    }

    public function show(Order $order)
    {
        $order->load(['customer', 'items.variant.product']);

        return response()->json($order);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => 'required|in:New,Confirmed,Processing,Shipped,Delivered,Cancelled',
        ]);

        $order->update($data);
        return response()->json($order);
    }

    private function sendWhatsappNotification(string $phone, Order $order)
    {
        $items = $order->items->map(function ($item) {
            return "{$item->quantity}x {$item->variant->product->name} ({$item->variant->color}/{$item->variant->size})";
        })->join(', ');

        $message = urlencode("New order #{$order->id}: {$items} for {$order->customer->name}. Deliver to {$order->address}, {$order->city}.");
        $url = env('WHATSAPP_API_URL');

        if ($url) {
            @file_get_contents("{$url}?phone={$phone}&text={$message}");
        }
    }
}
