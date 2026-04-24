# Prithwell Motor Spares Website

## Project
Next.js 14 App Router website for an auto parts shop in Harare, Zimbabwe.

## Brand
- Colours: Yellow #f5c500, Navy #0a1628, Black #000, White #fff
- Logo: Arial Black, italic skewX(-10deg), yellow on navy
- Style: Racing / automotive, similar to Autodoc and Oncerun Motors

## Database
- Supabase (new website project, separate from POS)
- 408 products, 14 makes, 168 models, 17 categories
- Key tables: products, online_orders, online_customers, online_order_items
- Key view: online_catalogue (used for all product queries)
- Stock auto-deducts via DB trigger when order status set to paid

## Payments
- Paynow (Zimbabwe) for EcoCash, OneMoney and card
- Integration in lib/paynow.js
- Webhook at /api/payments/webhook

## What still needs building
- Product images upload flow
- Admin orders dashboard
- About page
- Hero banner with real photo