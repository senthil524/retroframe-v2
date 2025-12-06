# RetroFrame v2

A React + Vite app for creating and ordering retro photo frames with PayU payment integration.

## What's New in v2

- **Migrated to Supabase** - Full cloud backend with PostgreSQL, Auth, Storage, and Edge Functions
- **PayU Checkout Plus** - Secure payment integration with hash generation/verification via Edge Functions
- **Improved Error Handling** - Graceful handling of payment cancellations and failures

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **UI**: Radix UI + Tailwind CSS + Framer Motion
- **Payments**: PayU India (Checkout Plus / Bolt)

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- PayU merchant account

### Installation

1. Clone and install:
```bash
git clone https://github.com/your-username/retroframe-v2.git
cd retroframe-v2
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. Run development server:
```bash
npm run dev
```

## Environment Variables

### For Local Development (.env)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### For Supabase Edge Functions (set in Supabase Dashboard)
```
PAYU_MERCHANT_KEY=your-payu-key
PAYU_MERCHANT_SALT=your-payu-salt
```

## Deployment to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## Project Structure

```
├── src/
│   ├── api/           # API client configuration
│   ├── components/    # React components
│   ├── lib/           # Supabase SDK & utilities
│   ├── pages/         # Page components
│   └── utils/         # Helper functions
├── supabase/
│   └── functions/     # Edge Functions (PayU hash)
└── public/            # Static assets
```

## License

MIT
