/**
 * Cloudflare Worker: R2 Video Proxy
 * 
 * This worker proxies video requests to R2 bucket without rate limits.
 * Bypasses the pub-*.r2.dev rate limiting for production use.
 * 
 * Setup:
 * 1. wrangler login
 * 2. wrangler r2 bucket binding create MY_BUCKET --bucket video-marketplace-videos
 * 3. wrangler deploy
 * 4. Update R2_PUBLIC_URL in production env
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    // Get object key from path (remove leading slash)
    const objectKey = url.pathname.slice(1);
    
    console.log(`Fetching: ${objectKey}`);
    
    try {
      // Fetch from R2
      const object = await env.MY_BUCKET.get(objectKey);
      
      if (!object) {
        return new Response('Video not found', { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        });
      }
      
      // Determine content type
      const contentType = objectKey.endsWith('.mp4') ? 'video/mp4' :
                         objectKey.endsWith('.jpg') || objectKey.endsWith('.jpeg') ? 'image/jpeg' :
                         objectKey.endsWith('.png') ? 'image/png' :
                         'application/octet-stream';
      
      // Build response headers
      const headers = new Headers();
      headers.set('Content-Type', contentType);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type, ETag');
      headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year
      
      // Add range request support for video streaming
      const range = request.headers.get('Range');
      if (range) {
        // Handle range requests for video seeking
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : object.size - 1;
        const chunkSize = (end - start) + 1;
        
        headers.set('Content-Range', `bytes ${start}-${end}/${object.size}`);
        headers.set('Content-Length', chunkSize.toString());
        headers.set('Accept-Ranges', 'bytes');
        
        return new Response(object.body, {
          status: 206, // Partial Content
          headers: headers
        });
      }
      
      // Normal request
      headers.set('Content-Length', object.size.toString());
      headers.set('Accept-Ranges', 'bytes');
      
      return new Response(object.body, {
        status: 200,
        headers: headers
      });
      
    } catch (error) {
      console.error('Error fetching from R2:', error);
      
      return new Response('Error loading video: ' + error.message, { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain',
        }
      });
    }
  }
};
