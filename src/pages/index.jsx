import Layout from "./Layout.jsx";

import Home from "./Home";

import Studio from "./Studio";

import PhotoEditor from "./PhotoEditor";

import Cart from "./Cart";

import Checkout from "./Checkout";

import Confirmation from "./Confirmation";

import Admin from "./Admin";

import OrderTracking from "./OrderTracking";

import PrintFile from "./PrintFile";

import ContactUs from "./ContactUs";

import Terms from "./Terms";

import Privacy from "./Privacy";

import Refund from "./Refund";

import PaymentCallback from "./PaymentCallback";

import PrintA4 from "./PrintA4";

import TemplateManager from "./TemplateManager";

import OrderDetails from "./OrderDetails";

import Robots from "./Robots";

import Sitemap from "./Sitemap";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Studio: Studio,
    
    PhotoEditor: PhotoEditor,
    
    Cart: Cart,
    
    Checkout: Checkout,
    
    Confirmation: Confirmation,
    
    Admin: Admin,
    
    OrderTracking: OrderTracking,
    
    PrintFile: PrintFile,
    
    ContactUs: ContactUs,
    
    Terms: Terms,
    
    Privacy: Privacy,
    
    Refund: Refund,
    
    PaymentCallback: PaymentCallback,
    
    PrintA4: PrintA4,
    
    TemplateManager: TemplateManager,
    
    OrderDetails: OrderDetails,
    
    Robots: Robots,
    
    Sitemap: Sitemap,
    
}

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
                
            </Routes>
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