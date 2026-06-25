export async function loadImageAsBlob(imageUrl: string): Promise<string> {
  try {
    // If it's a storage URL, convert it to use the API endpoint instead
    let fetchUrl = imageUrl;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

    // Check if it's a storage URL
    if (imageUrl.includes('/storage/')) {
      const storagePath = imageUrl.split('/storage/')[1];
      // Use the new API endpoint for serving images
      fetchUrl = `${backendUrl}/api/images/serve?path=${encodeURIComponent(storagePath)}`;
    }

    const headers: Record<string, string> = {
      Accept: 'image/*',
    };

    // Add ngrok headers if it's an ngrok URL
    if (fetchUrl.includes('ngrok')) {
      headers['ngrok-skip-browser-warning'] = 'true';
    }

    const response = await fetch(fetchUrl, { headers });
    if (!response.ok) {
      throw new Error(`Failed to load image: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error loading image:', error);
    // Return a fallback data URL on error
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%239ca3af"%3EImage Not Found%3C/text%3E%3C/svg%3E';
  }
}
