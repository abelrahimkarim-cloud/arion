<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalOrders = Order::count();
        $ordersToday = Order::whereDate('created_at', now()->toDateString())->count();
        $totalRevenue = Order::sum('total_price');
        $salesOverview = Order::selectRaw('DATE(created_at) as date, SUM(total_price) as revenue')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(14)
            ->get();
        $latestOrders = Order::with('customer', 'variant.product')->latest()->limit(5)->get();

        return response()->json([
            'totalOrders' => $totalOrders,
            'ordersToday' => $ordersToday,
            'totalRevenue' => $totalRevenue,
            'salesOverview' => $salesOverview,
            'latestOrders' => $latestOrders,
        ]);
    }
}
