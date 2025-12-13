import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Layout from "./Layout.jsx";
import ScrollToTop from '@/components/ScrollToTop';

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-warm">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-brand-coral border-t-transparent rounded-full animate-spin" />
      <p className="text-brand-secondary text-sm">Loading...</p>
    </div>
  </div>
);

// Lazy load all pages for code splitting
const Home = React.lazy(() => import('./Home'));
const Studio = React.lazy(() => import('./Studio'));

// Preload Home and Studio in background for faster navigation
if (typeof window !== 'undefined') {
  // Use requestIdleCallback to preload when browser is idle
  const preloadPages = () => {
    import('./Home');
    import('./Studio');
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(preloadPages, { timeout: 2000 });
  } else {
    setTimeout(preloadPages, 1000);
  }
}
const PhotoEditor = React.lazy(() => import('./PhotoEditor'));
const Cart = React.lazy(() => import('./Cart'));
const Checkout = React.lazy(() => import('./Checkout'));
const Confirmation = React.lazy(() => import('./Confirmation'));
const Admin = React.lazy(() => import('./Admin'));
const OrderTracking = React.lazy(() => import('./OrderTracking'));
const PrintFile = React.lazy(() => import('./PrintFile'));
const ContactUs = React.lazy(() => import('./ContactUs'));
const Terms = React.lazy(() => import('./Terms'));
const Privacy = React.lazy(() => import('./Privacy'));
const Refund = React.lazy(() => import('./Refund'));
const PaymentCallback = React.lazy(() => import('./PaymentCallback'));
const PrintA4 = React.lazy(() => import('./PrintA4'));
const TemplateManager = React.lazy(() => import('./TemplateManager'));
const OrderDetails = React.lazy(() => import('./OrderDetails'));
const AdminLogin = React.lazy(() => import('./AdminLogin'));
const Blog = React.lazy(() => import('./Blog'));
const BlogPost = React.lazy(() => import('./BlogPost'));
const LandingPage = React.lazy(() => import('./LandingPage'));
const NotFound = React.lazy(() => import('./NotFound'));

const PAGES = {
  Home,
  Studio,
  PhotoEditor,
  Cart,
  Checkout,
  Confirmation,
  Admin,
  OrderTracking,
  PrintFile,
  ContactUs,
  Terms,
  Privacy,
  Refund,
  PaymentCallback,
  PrintA4,
  TemplateManager,
  OrderDetails,
  AdminLogin,
  Blog,
  BlogPost,
};

function _getCurrentPage(url) {
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  let urlLastPart = url.split('/').pop();
  if (urlLastPart.includes('?')) {
    urlLastPart = urlLastPart.split('?')[0];
  }

  const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
  return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <>
      <ScrollToTop />
      <Layout currentPageName={currentPage}>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Main routes (lowercase) */}
          <Route path="/" element={<Home />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/photo-editor" element={<PhotoEditor />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/print-file" element={<PrintFile />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/payment-callback" element={<PaymentCallback />} />
          <Route path="/print-a4" element={<PrintA4 />} />
          <Route path="/template-manager" element={<TemplateManager />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* SEO Landing Pages */}
          <Route path="/occasions/:slug" element={<LandingPage />} />
          <Route path="/locations/:slug" element={<LandingPage />} />
          <Route path="/use-cases/:slug" element={<LandingPage />} />
          <Route path="/home-decor/:slug" element={<LandingPage />} />

          {/* Legacy URL redirects (old uppercase to new lowercase) */}
          <Route path="/Home" element={<Navigate to="/" replace />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/Studio" element={<Navigate to="/studio" replace />} />
          <Route path="/PhotoEditor" element={<Navigate to="/photo-editor" replace />} />
          <Route path="/Cart" element={<Navigate to="/cart" replace />} />
          <Route path="/Checkout" element={<Navigate to="/checkout" replace />} />
          <Route path="/Confirmation" element={<Navigate to="/confirmation" replace />} />
          <Route path="/Admin" element={<Navigate to="/admin" replace />} />
          <Route path="/OrderTracking" element={<Navigate to="/order-tracking" replace />} />
          <Route path="/PrintFile" element={<Navigate to="/print-file" replace />} />
          <Route path="/ContactUs" element={<Navigate to="/contact" replace />} />
          <Route path="/Terms" element={<Navigate to="/terms" replace />} />
          <Route path="/Privacy" element={<Navigate to="/privacy" replace />} />
          <Route path="/Refund" element={<Navigate to="/refund" replace />} />
          <Route path="/PaymentCallback" element={<Navigate to="/payment-callback" replace />} />
          <Route path="/PrintA4" element={<Navigate to="/print-a4" replace />} />
          <Route path="/TemplateManager" element={<Navigate to="/template-manager" replace />} />
          <Route path="/OrderDetails" element={<Navigate to="/order-details" replace />} />
          <Route path="/AdminLogin" element={<Navigate to="/admin-login" replace />} />
          <Route path="/Blog" element={<Navigate to="/blog" replace />} />

          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
}

export default function Pages() {
  return (
    <Router>
      <PagesContent />
    </Router>
  );
}
