# RetroFrame - Photo Printing E-Commerce Platform

## Overview
RetroFrame is a retro-style photo printing service that allows users to upload photos, customize them with borders, effects, and captions, and order physical prints delivered to their doorstep.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: Base44 Platform (entities, integrations, backend functions)
- **Payment**: PayU India
- **Analytics**: Google Ads (AW-17759957136), Meta Pixel (740421112411535)

---

## Architecture

### Entities (Database)

| Entity | Purpose | Access |
|--------|---------|--------|
| `Cart` | Shopping cart sessions | Public (filtered by cart_id) |
| `Photo` | Uploaded photos with settings | Public (filtered by cart_id) |
| `Order` | Customer orders | Public read (filtered by session), Admin write |
| `Payment` | PayU transaction records | Public read (filtered by session), Admin write |
| `Template` | Print layout templates | Admin only |
| `OrderCounter` | Sequential order number generator | Admin only |

### Key Fields
- `cart_id`: Unique identifier stored in localStorage, links cart → photos
- `session_id`: Browser session tracking
- `order_id`: Links photos to completed orders

---

## Pages

### Public Pages
| Page | Route | Description |
|------|-------|-------------|
| `Home` | `/Home` | Landing page with hero, features, reviews |
| `Studio` | `/Studio` | Photo upload and customization |
| `PhotoEditor` | `/PhotoEditor` | Individual photo editing (crop, zoom, effects) |
| `Cart` | `/Cart` | View cart and proceed to checkout |
| `Checkout` | `/Checkout` | Customer details and payment |
| `Confirmation` | `/Confirmation` | Order success page |
| `OrderTracking` | `/OrderTracking` | Track order by number + phone |
| `ContactUs` | `/ContactUs` | Contact form |
| `Terms` | `/Terms` | Terms & Conditions |
| `Privacy` | `/Privacy` | Privacy Policy |
| `Refund` | `/Refund` | Refund & Cancellation Policy |

### Admin Pages (Protected)
| Page | Route | Description |
|------|-------|-------------|
| `Admin` | `/Admin` | Order management dashboard |
| `OrderDetails` | `/OrderDetails` | Individual order view/edit |
| `PrintA4` | `/PrintA4` | Generate print-ready PDFs |
| `PrintFile` | `/PrintFile` | Alternative print file generator |
| `TemplateManager` | `/TemplateManager` | Manage print templates |

### SEO Pages
| Page | Route | Description |
|------|-------|-------------|
| `Robots` | `/Robots` | robots.txt content |
| `Sitemap` | `/Sitemap` | XML sitemap |

---

## Components

### Studio Components (`components/studio/`)
- `StudioHeader` - Header with cart button
- `PhotoCard` - Photo thumbnail with status indicators
- `PhotoFrame` - Framed photo display with effects
- `PhotoUploader` - File upload handling
- `EditingPanel` - Photo editing controls
- `EditToolbar` - Toolbar for bulk actions

### Admin Components (`components/admin/`)
- `AdminAuthGuard` - Protects admin routes (checks user.role === 'admin')
- `PhotoPreviewFrame` - Consistent photo preview matching studio

### Home Components (`components/home/`)
- `HeroPhotoStack` - Animated photo stack on landing
- `CustomerReviews` - Customer testimonials
- `UserPhotosGallery` - Sample photo gallery
- `FAQSection` - Frequently asked questions

### Core Components
- `PhotoContext` - Global state for photos/cart (React Context)
- `SEOHead` - Dynamic meta tags for SEO
- `payuHelper` - PayU payment utilities

---

## Backend Functions

| Function | Purpose |
|----------|---------|
| `payuGenerateHash` | Generate PayU payment hash |
| `payuVerifyHash` | Verify PayU callback hash |
| `robotsTxt` | Serve robots.txt |
| `sitemapXml` | Serve sitemap.xml |

### Secrets Required
- `PAYU_KEY` - PayU merchant key
- `PAYU_SALT` - PayU merchant salt

---

## User Flow

```
1. Home Page → Click "Create Prints"
2. Studio → Upload photos (background upload to cloud)
3. Studio → Customize: border color, effect, caption
4. PhotoEditor → Fine-tune: crop, zoom, position
5. Cart → Review photos (min 18 required)
6. Checkout → Enter details & address
7. PayU → Complete payment
8. Confirmation → Order placed
9. OrderTracking → Track with order# + phone
```

---

## Pricing

| Tier | Price |
|------|-------|
| First 18 prints | ₹270 (discounted from ₹399) |
| Additional prints | ₹15 each |
| Shipping | FREE |

**Minimum order**: 18 prints

---

## Security Model

**Important**: Base44 does NOT support custom `access_rules` in entity schemas. Security is implemented through:

### How Data is Protected

1. **Cart/Photo isolation**: 
   - Each visitor gets a unique `cart_id` stored in localStorage
   - All queries filter by `cart_id` - visitors only see their own data
   - Cannot guess or access other carts without the exact ID

2. **Order tracking**: 
   - Requires BOTH order number AND phone number to view
   - Phone number acts as a verification code
   - Cannot access orders without knowing both values

3. **Admin access**: 
   - Protected by `AdminAuthGuard` component
   - Checks `user.role === 'admin'` via Base44 auth
   - Non-admins see "Access Denied" page

4. **Payment security**: 
   - Hash generated server-side with secret PAYU_SALT
   - Response hash verified to prevent tampering
   - All sensitive operations in backend functions

---

## Analytics & Tracking

### Google Ads
- Tag ID: `AW-17759957136`
- Loaded in Layout.js

### Meta Pixel
- Pixel ID: `740421112411535`
- Tracks: PageView
- Loaded in Layout.js

---

## Print Specifications

| Size | Dimensions |
|------|------------|
| Classic (vintage) | 3.4" × 4" |
| Mini | 2.4" × 2.8" (coming soon) |
| Wide | 3.4" × 4.3" (coming soon) |

### PDF Generation
- Format: A4 Landscape
- Grid: 3 columns × 2 rows
- DPI: 300
- Includes crop marks for cutting

---

## Environment Setup

1. Set secrets in Base44 dashboard:
   - `PAYU_KEY`
   - `PAYU_SALT`

2. Configure PayU callback URLs:
   - Success: `{app_url}/PaymentCallback?status=success`
   - Failure: `{app_url}/PaymentCallback?status=failure`

---

## Admin Access

1. User must be invited via Base44 dashboard
2. User role must be set to `admin`
3. Admin can access: `/Admin`, `/OrderDetails`, `/PrintA4`, `/PrintFile`, `/TemplateManager