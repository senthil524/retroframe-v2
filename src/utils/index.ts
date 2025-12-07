// URL mapping for all pages (lowercase with hyphens)
const PAGE_URLS: Record<string, string> = {
  'Home': '/',
  'Studio': '/studio',
  'PhotoEditor': '/photo-editor',
  'Cart': '/cart',
  'Checkout': '/checkout',
  'Confirmation': '/confirmation',
  'Admin': '/admin',
  'OrderTracking': '/order-tracking',
  'PrintFile': '/print-file',
  'ContactUs': '/contact',
  'Contact': '/contact',
  'Terms': '/terms',
  'Privacy': '/privacy',
  'Refund': '/refund',
  'PaymentCallback': '/payment-callback',
  'PrintA4': '/print-a4',
  'TemplateManager': '/template-manager',
  'OrderDetails': '/order-details',
  'Robots': '/robots.txt',
  'Sitemap': '/sitemap.xml',
  'AdminLogin': '/admin-login',
  'Blog': '/blog',
  'BlogPost': '/blog',
};

export function createPageUrl(pageName: string): string {
  // Check if we have a mapped URL
  if (PAGE_URLS[pageName]) {
    return PAGE_URLS[pageName];
  }
  // Fallback: convert to lowercase with hyphens
  return '/' + pageName
    .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase to kebab-case
    .toLowerCase()
    .replace(/ /g, '-');
}
