# NextBol AI v2 — Urdu Content Platform

## What's New in v2
- ChatGPT-style chat interface with saved conversations
- 15+ AI tools organized by category (Content, Social, Marketing, Special)
- Secure admin panel with email/password authentication
- Professional output — no emojis in AI responses
- Signup prompt after 5 free daily generations
- Real-time admin dashboard with full platform controls
- AI configuration panel (model, tokens, temperature)
- Revenue tracking and user management

## Tech Stack
- Next.js 14 + Tailwind CSS
- Supabase (PostgreSQL + Auth)
- OpenAI API (GPT-4o-mini)
- Stripe (Payments)
- Vercel (Hosting)

## Setup
1. Copy .env.example to .env.local
2. Fill in your API keys
3. npm install
4. npm run dev

## Admin Access
Set these in Vercel Environment Variables:
- ADMIN_EMAIL=admin@nextbol.com
- ADMIN_PASSWORD=YourSecurePassword
- ADMIN_SECRET=random-32-char-string

Access admin at: /admin

## Pages
- / — Landing page
- /dashboard — AI chat interface
- /login — User login
- /signup — User registration
- /pricing — Plans and pricing
- /admin — Secure admin panel
