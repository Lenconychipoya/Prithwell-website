# Prithwell Motor Spares — Website

Full-stack Next.js website with Supabase backend and Paynow payments.

## Folder Structure

```
prithwell/
├── app/
│   ├── page.js                        ← Home page
│   ├── layout.js                      ← Root layout (Navbar + Footer)
│   ├── globals.css                    ← Global styles
│   ├── catalogue/
│   │   ├── page.js                    ← Browse/search catalogue
│   │   └── [sku]/page.js             ← Product detail page
│   ├── cart/page.js                   ← Shopping cart
│   ├── checkout/page.js               ← Checkout (EcoCash/Card/COD)
│   ├── order/complete/page.js         ← Post-payment confirmation
│   ├── track/page.js                  ← Order tracking
│   └── api/
│       ├── orders/route.js            ← Create order
│       ├── orders/track/route.js      ← Track order
│       ├── payments/initiate/route.js ← Start Paynow payment
│       └── payments/webhook/route.js  ← Paynow payment callback
├── components/
│   ├── Navbar.js
│   ├── Footer.js
│   ├── ProductCard.js
│   ├── AddToCartButton.js
│   └── VehicleSearch.js
├── lib/
│   ├── supabase.js                    ← Database client + all queries
│   └── paynow.js                      ← Paynow payment integration
├── public/
│   └── manifest.json                  ← PWA manifest
├── .env.example                       ← Copy to .env.local
├── next.config.js
├── tailwind.config.js
└── package.json
```

## How to Run (Step by Step)

### Prerequisites
- Node.js 18+ (download from nodejs.org)
- Your new Supabase project URL and keys
- Git (optional)

### Step 1 — Set up environment variables

Copy the example file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase > Settings > API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase > Settings > API
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase > Settings > API (keep secret)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — your WhatsApp number e.g. 2637XXXXXXXXX

You can leave Paynow keys blank for now — payment will error but everything else works.

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Run development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser. The website is running!

### Step 4 — Deploy to internet (free via Vercel)

Install Vercel CLI:
```bash
npm install -g vercel
```

Deploy:
```bash
vercel
```

Follow the prompts. Then go to your Vercel dashboard > your project > Settings > Environment Variables and add all the same values from your `.env.local`.

Your site will be live at something like `prithwell-xyz.vercel.app`.

### Step 5 — Connect your domain prithwellmotorspares.co.zw

In Vercel dashboard > your project > Settings > Domains:
- Add `prithwellmotorspares.co.zw`
- Vercel gives you DNS records to add to your domain registrar
- Update your DNS and the domain goes live in minutes

## After deployment — update Paynow URLs

Once your domain is live, update these in Vercel environment variables:
```
PAYNOW_RETURN_URL=https://prithwellmotorspares.co.zw/order/complete
PAYNOW_RESULT_URL=https://prithwellmotorspares.co.zw/api/payments/webhook
```

Then add these exact URLs in your Paynow merchant portal under Integration settings.

## Managing your products online

To show/hide products on the website, go to your Supabase dashboard:
- Table Editor > products
- Set `is_active = true` to show, `false` to hide
- Set `online_price` if you want a different price online vs POS
- Add `description` text to improve the product listing
- Add image URLs to the `images` JSON array

## Need help?

If anything doesn't work, check:
1. Your `.env.local` has the correct Supabase URL and keys
2. You ran `npm install` before `npm run dev`
3. Your Supabase project has RLS policies allowing public reads (the SQL you ran sets these up)
"# Prithwell-website" 
