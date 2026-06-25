<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function uploadProductImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        try {
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            $path = $file->storeAs('products', $filename, 'public');
            
            $relativeUrl = Storage::disk('public')->url($path);
            $fullUrl = request()->getSchemeAndHttpHost() . $relativeUrl;

            return response()->json([
                'success' => true,
                'path' => $path,
                'url' => $fullUrl,
                'filename' => $filename,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteProductImage(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        try {
            if (Storage::disk('public')->exists($request->path)) {
                Storage::disk('public')->delete($request->path);
            }

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function serve(Request $request)
    {
        $path = $request->query('path');
        
        if (!$path) {
            return response()->json(['error' => 'Path parameter required'], 400);
        }

        // Decode path if base64 encoded
        $decodedPath = base64_decode($path, true);
        if ($decodedPath !== false) {
            $path = $decodedPath;
        }

        // Security: prevent directory traversal
        if (strpos($path, '..') !== false || strpos($path, './') === 0) {
            return response()->json(['error' => 'Invalid path'], 403);
        }

        if (!Storage::disk('public')->exists($path)) {
            return response()->json(['error' => 'Image not found'], 404);
        }

        try {
            $content = Storage::disk('public')->get($path);
            $mimeType = Storage::disk('public')->mimeType($path);
            
            return response($content)
                ->header('Content-Type', $mimeType)
                ->header('Cache-Control', 'public, max-age=86400');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve image'], 500);
        }
    }
}
