/**
 * Image optimization utilities
 * Converts large images to optimized sizes for better performance
 */

/**
 * Optimize image URL using a CDN proxy or resize parameters
 * This reduces file size while maintaining visual quality
 */
export function optimizeImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  } = {}
): string {
  if (!url || url.startsWith('data:') || url.includes('picsum.photos')) {
    // Don't optimize placeholder images or data URLs
    return url;
  }

  const { width, height, quality = 85, format } = options;

  // Option 1: Use Cloudinary free tier (if you want to set it up)
  // const cloudinaryUrl = `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/fetch/w_${width || 'auto'},h_${height || 'auto'},q_${quality},f_${format || 'auto'}/${encodeURIComponent(url)}`;
  // return cloudinaryUrl;

  // Option 2: Use Imgix (if you have an account)
  // const imgixUrl = `https://YOUR_IMGIX_DOMAIN.imgix.net/${encodeURIComponent(url)}?w=${width || 'auto'}&h=${height || 'auto'}&q=${quality}&fm=${format || 'auto'}`;
  // return imgixUrl;

  // Option 3: Use a free image optimization service
  // Example: ImageKit, Cloudflare Images, or similar

  // Option 4: For Ticketmaster images, check if they support size parameters
  // Some CDNs support URL parameters for resizing
  if (url.includes('ticketmaster') || url.includes('ticketmaster.com')) {
    // Ticketmaster images might support size parameters
    // Try adding size parameters if the URL structure allows
    const urlObj = new URL(url);
    if (width) urlObj.searchParams.set('w', width.toString());
    if (height) urlObj.searchParams.set('h', height.toString());
    if (quality) urlObj.searchParams.set('q', quality.toString());
    return urlObj.toString();
  }

  // For now, return original URL
  // You can implement one of the above services later
  return url;
}

/**
 * Get optimized image URL for different use cases
 */
export function getOptimizedImageUrl(
  url: string,
  useCase: 'thumbnail' | 'card' | 'detail' | 'hero' = 'card'
): string {
  const configs = {
    thumbnail: { width: 200, height: 200, quality: 80 },
    card: { width: 800, height: 1000, quality: 85 },
    detail: { width: 1200, height: 800, quality: 90 },
    hero: { width: 1600, height: 900, quality: 90 },
  };

  return optimizeImageUrl(url, configs[useCase]);
}

/**
 * Check if image needs optimization based on file size estimate
 * This is a heuristic - actual file size would require fetching the image
 */
export function shouldOptimizeImage(url: string): boolean {
  // Skip optimization for placeholder images
  if (url.includes('picsum.photos') || url.startsWith('data:')) {
    return false;
  }

  // Optimize Ticketmaster and other external images
  return true;
}
