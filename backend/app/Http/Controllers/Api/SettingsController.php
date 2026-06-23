<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function show()
    {
        return response()->json(Setting::first());
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'store_name' => 'required|string|max:255',
            'logo_url' => 'nullable|string',
            'whatsapp_number' => 'nullable|string|max:50',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'facebook_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
        ]);

        $settings = Setting::first();
        if ($settings) {
            $settings->update($data);
        } else {
            $settings = Setting::create($data);
        }

        return response()->json($settings);
    }
}
