# Changelog

## Latest Updates

### 2025-11-29
- **Added**: Meta Pixel tracking (ID: 740421112411535) for Facebook/Instagram ads

### Previous Updates

#### Security & Authentication
- **Added**: `AdminAuthGuard` component for admin page protection
- **Implemented**: Role-based access control using Base44's user roles
- **Protected pages**: Admin, OrderDetails, PrintA4, PrintFile, TemplateManager
- **Replaced**: Simple password protection with proper authentication

#### Order Viewing & Editing
- **Added**: View orders in Studio via URL param (`/Studio?order=ORDER_NUMBER`)
- **Added**: Edit photo positions directly from order view
- **Added**: "View & Edit Photos" button in OrderDetails page
- **Implemented**: Auto-save photo changes to database in order view mode

#### PDF Generation
- **Fixed**: PDF generation now matches Studio preview positioning
- **Added**: `PhotoPreviewFrame` component for consistent previews
- **Updated**: PrintA4 page uses same "cover" fit logic as Studio

#### Cart Management
- **Added**: View existing carts via URL param (`/Studio?cart_id=CART_ID`)
- **Improved**: Photo upload progress indicators
- **Added**: Background upload with status tracking

#### SEO
- **Added**: `SEOHead` component for dynamic meta tags
- **Added**: Robots.txt page
- **Added**: Sitemap.xml page
- **Configured**: Page-specific SEO settings

#### Analytics
- **Added**: Google Ads tracking (AW-17759957136)
- **Added**: Meta Pixel tracking (740421112411535)

#### Entity Security (Documentation)
- **Documented**: Access rules in entity schemas
- **Note**: Base44 doesn't enforce custom access_rules; security is through client-side filtering and backend functions

---

## Entity Schema Updates

### Cart
- Added `session_id` for ownership tracking
- Documented access rules (session-based)

### Photo  
- Added `session_id` for ownership tracking
- Added `order_id` to link photos to orders
- Documented access rules (session-based)

### Order
- Added `session_id` for ownership tracking
- Access: Public read (filtered), Admin write

### Payment
- Added `session_id` for ownership tracking
- Access: Public read (filtered), Admin write

### Template
- Access: Admin only (all operations)

### OrderCounter
- Access: Admin only (all operations)