<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\Setting;
use Illuminate\Http\Request;
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
            'variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:1000',
        ]);

        $variant = ProductVariant::with('product')->findOrFail($data['variant_id']);
        if ($variant->stock < $data['quantity']) {
            return response()->json(['message' => 'Selected variant is out of stock'], 422);
        }

        $customer = Customer::firstOrCreate([
            'phone' => $data['phone'],
        ], [
            'name' => $data['name'],
            'city' => $data['city'],
            'address' => $data['address'],
        ]);

        $order = Order::create([
            'customer_id' => $customer->id,
            'variant_id' => $variant->id,
            'status' => 'New',
            'quantity' => $data['quantity'],
            'total_price' => $variant->price * $data['quantity'],
            'notes' => $data['notes'] ?? null,
            'city' => $data['city'],
            'address' => $data['address'],
            'whatsapp_sent' => false,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $variant->product_id,
            'variant_id' => $variant->id,
            'quantity' => $data['quantity'],
            'price' => $variant->price,
        ]);

        $variant->decrement('stock', $data['quantity']);

        $setting = Setting::first();
        if ($setting && $setting->whatsapp_number) {
            $this->sendWhatsappNotification($setting->whatsapp_number, $order);
            $order->update(['whatsapp_sent' => true]);
        }

        if (config('mail.mailers.smtp.host')) {
            Mail::raw("New COD order received (#{$order->id}) from {$customer->name}.", function ($message) use ($setting) {
                $message->to($setting->whatsapp_number . '@example.com');
                $message->subject('New Order Received');
            });
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
        $message = urlencode("New order #{$order->id}: {$order->quantity} x {$order->variant->product->name} ({$order->variant->size}/{$order->variant->color}) for {$order->customer->name}. Deliver to {$order->address}, {$order->city}.");
        $url = env('WHATSAPP_API_URL');

        if ($url) {
            @file_get_contents("{$url}?phone={$phone}&text={$message}");
        }
    }
}
