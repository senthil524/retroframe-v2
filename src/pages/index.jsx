import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Layout from "./Layout.jsx";

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
const Robots = React.lazy(() => import('./Robots'));
const Sitemap = React.lazy(() => import('./Sitemap'));
const AdminLogin = React.lazy(() => import('./AdminLogin'));
const Blog = React.lazy(() => import('./Blog'));
const BlogPost = React.lazy(() => import('./BlogPost'));

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
  Robots,
  Sitemap,
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
    <Layout currentPageName={currentPage}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Studio" element={<Studio />} />
          <Route path="/PhotoEditor" element={<PhotoEditor />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/Confirmation" element={<Confirmation />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/OrderTracking" element={<OrderTracking />} />
          <Route path="/PrintFile" element={<PrintFile />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/Terms" element={<Terms />} />
          <Route path="/Privacy" element={<Privacy />} />
          <Route path="/Refund" element={<Refund />} />
          <Route path="/PaymentCallback" element={<PaymentCallback />} />
          <Route path="/PrintA4" element={<PrintA4 />} />
          <Route path="/TemplateManager" element={<TemplateManager />} />
          <Route path="/OrderDetails" element={<OrderDetails />} />
          <Route path="/Robots" element={<Robots />} />
          <Route path="/Sitemap" element={<Sitemap />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/Blog" element={<Blog />} />
          <Route path="/Blog/:slug" element={<BlogPost />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default function Pages() {
  return (
    <Router>
      <PagesContent />
    </Router>
  );
}
