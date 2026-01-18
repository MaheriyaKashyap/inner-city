export { cn } from './cn';
export * from './cn';

/**
 * Create a page URL from a page name
 * Converts "Home" to "/home", "EventDetail" to "/event-detail", etc.
 */
export function createPageUrl(pageName: string): string {
  // Convert PascalCase to kebab-case
  const kebabCase = pageName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
  
  // Handle special cases
  const routeMap: Record<string, string> = {
    'home': '/',
    'index': '/',
  };
  
  return routeMap[kebabCase] || `/${kebabCase}`;
}
