# NextBol AI — Urdu & Roman Urdu Content Generator

The #1 AI content platform for Pakistani creators. Generate YouTube scripts, social media posts, blogs, ads, and Islamic content in Urdu and Roman Urdu.

## Tech Stack
- **Frontend**: Next.js 14 + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API (GPT-4o-mini)
- **Payments**: Stripe
- **Hosting**: Vercel

## Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/YOUR_USERNAME/nextbol-ai.git
cd nextbol-ai
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
```
Then fill in your API keys (see Setup Guide below).

### 3. Run Locally
```bash
npm run dev
```
Open http://localhost:3000

## Setup Guide

### Step 1: Supabase
1. Go to supabase.com → Create project
2. Copy URL and Anon Key from Settings → API
3. Run supabase-schema.sql in SQL Editor
4. Paste keys in .env.local

### Step 2: OpenAI
1. Go to platform.openai.com → API Keys
2. Create new key → Copy it
3. Add $5 credit in Billing
4. Paste key in .env.local

### Step 3: Stripe
1. Go to dashboard.stripe.com
2. Create 2 products: Creator ($7/mo), Agency ($19/mo)
3. Copy API keys and Price IDs
4. Paste in .env.local

### Step 4: Deploy to Vercel
1. Push code to GitHub
2. Go to vercel.com → Import project
3. Add all environment variables
4. Deploy!

## Pages
- `/` — Landing page (SEO optimized)
- `/login` — User login
- `/signup` — User registration
- `/dashboard` — AI Generator + Tools + History
- `/admin` — Admin dashboard (users, API control, settings)
- `/pricing` — Pricing page

## API Routes
- `POST /api/generate` — AI content generation
- `POST /api/webhook` — Stripe webhook handler

## License
MIT
