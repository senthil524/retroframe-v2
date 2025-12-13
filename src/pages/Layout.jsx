
import React from 'react';
import { PhotoProvider } from '@/components/PhotoContext.jsx';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SEOHead, { SEO_CONFIG } from '@/components/SEOHead.jsx';

export default function Layout({ children, currentPageName }) {
  const showFooter = !['Studio', 'PhotoEditor', 'Cart', 'Checkout'].includes(currentPageName);

  // Pages that handle their own SEO (don't use SEOHead to avoid conflicts)
  const pagesWithOwnSEO = ['Blog', 'BlogPost', 'Home', 'Studio', 'ContactUs', 'Terms', 'Privacy', 'Refund', 'OrderTracking'];
  const useDefaultSEO = !pagesWithOwnSEO.includes(currentPageName);

  // Get SEO config for current page
  const seoConfig = SEO_CONFIG[currentPageName] || SEO_CONFIG.Home;

  // Scroll to top when page changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPageName]);

  React.useEffect(() => {
    // Add viewport meta tag for PayU
    let viewport = document.querySelector("meta[name='viewport']");
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1';

    // Defer loading of third-party scripts until page is idle
    const loadAnalytics = () => {
      // Add Google Analytics tag
      if (!document.querySelector('script[src*="googletagmanager.com/gtag"]')) {
        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17759957136';
        document.head.appendChild(gtagScript);

        const gtagConfig = document.createElement('script');
        gtagConfig.textContent = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17759957136');
        `;
        document.head.appendChild(gtagConfig);
      }

      // Add Meta Pixel
      if (!window.fbq) {
        const fbPixelScript = document.createElement('script');
        fbPixelScript.textContent = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '740421112411535');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(fbPixelScript);
      }
    };

    // Delay loading analytics until after initial render (3 seconds)
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadAnalytics, { timeout: 3000 });
    } else {
      setTimeout(loadAnalytics, 3000);
    }

    }, []);

  return (
    <PhotoProvider>
      {useDefaultSEO && <SEOHead {...seoConfig} />}
      <style>
        {`
          :root {
            --color-coral: #E67E6A;
            --color-coral-dark: #D86B57;
            --color-dark: #1F1D1B;
            --color-warm-bg: #FDFCFB;
            --color-warm-light: #FAF7F5;
            --color-text-secondary: #5A5654;
            --color-border: #EAE7E4;
            --font-serif: 'Playfair Display', 'Libre Baskerville', Georgia, serif;
            --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }

          body {
            font-family: var(--font-sans);
            background: var(--color-warm-bg);
          }

          h1, h2, h3 {
            font-family: var(--font-serif);
          }
        `}
      </style>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        
        {showFooter && (
          <footer className="bg-[#1F1D1B] text-white py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
                {/* Brand */}
                <div>
                  <Link to="/" className="flex items-center gap-1 mb-4 hover:opacity-80 transition-opacity">
                    <img src="/icon-white.webp" alt="RetroFrame" className="w-9 h-9" width="36" height="36" loading="lazy" />
                    <span className="text-2xl text-white" style={{ fontFamily: 'var(--font-serif)' }}>RetroFrame</span>
                  </Link>
                  <p className="text-gray-400 text-sm">
                    Transform your digital memories into beautiful retro-style prints.
                  </p>
                </div>

                {/* Product */}
                <div>
                  <h3 className="font-semibold mb-4 text-white">Product</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to={createPageUrl('Studio')} className="text-gray-400 hover:text-white transition-colors">
                        Create Prints
                      </Link>
                    </li>
                    <li>
                      <Link to={createPageUrl('OrderTracking')} className="text-gray-400 hover:text-white transition-colors">
                        Track Order
                      </Link>
                    </li>
                    <li>
                      <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                        Blog
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Occasions */}
                <div>
                  <h3 className="font-semibold mb-4 text-white">Gift Ideas</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to="/occasions/anniversary-photo-gifts" className="text-gray-400 hover:text-white transition-colors">
                        Anniversary Gifts
                      </Link>
                    </li>
                    <li>
                      <Link to="/occasions/birthday-photo-gifts" className="text-gray-400 hover:text-white transition-colors">
                        Birthday Gifts
                      </Link>
                    </li>
                    <li>
                      <Link to="/occasions/valentines-day-photo-gifts" className="text-gray-400 hover:text-white transition-colors">
                        Valentine's Day Gifts
                      </Link>
                    </li>
                    <li>
                      <Link to="/occasions" className="text-gray-400 hover:text-white transition-colors">
                        All Occasions
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="font-semibold mb-4 text-white">Support</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to={createPageUrl('ContactUs')} className="text-gray-400 hover:text-white transition-colors">
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link to={createPageUrl('Refund')} className="text-gray-400 hover:text-white transition-colors">
                        Refund & Cancellation
                      </Link>
                    </li>
                    <li>
                      <a href="mailto:support@retroframe.com" className="text-gray-400 hover:text-white transition-colors">
                        support@retroframe.com
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h3 className="font-semibold mb-4 text-white">Legal</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to={createPageUrl('Privacy')} className="text-gray-400 hover:text-white transition-colors">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link to={createPageUrl('Terms')} className="text-gray-400 hover:text-white transition-colors">
                        Terms & Conditions
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} Retroframe. All rights reserved.
                </p>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>Made with ❤️ in India</span>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </PhotoProvider>
  );
}
