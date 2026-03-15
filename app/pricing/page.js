'use client'
import Link from 'next/link'

const PLANS = [
  { name: 'Free', price: 0, features: ['5 generations/day', '3 AI tools', 'Basic tones', 'Watermark on export'] },
  { name: 'Creator', price: 7, popular: true, features: ['Unlimited generations', 'All 12+ AI tools', 'All tones & languages', 'No watermark', 'Content history', 'Priority speed'] },
  { name: 'Agency', price: 19, features: ['Everything in Creator', '5 team members', 'Multiple brands', 'API access', 'Analytics dashboard', 'Priority support'] },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="hero-grid" />
      <nav className="relative z-10 max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-lg"
            style={{ background: 'linear-gradient(135deg, #6F5FF6, #06B6D4)' }}>N</div>
          <span className="font-bold text-xl">NextBol<span style={{ color: '#6F5FF6' }}>.ai</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition">Log in</Link>
          <Link href="/signup" className="px-5 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ background: '#6F5FF6' }}>Get Started</Link>
        </div>
      </nav>

      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold mb-3">Simple, Transparent Pricing</h1>
          <p className="text-gray-400 text-lg">Start free. Upgrade when you need more power.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.name}
              className="relative p-8 rounded-2xl transition hover:-translate-y-1"
              style={{
                background: 'var(--bg-card)',
                border: plan.popular ? '1px solid #6F5FF6' : '1px solid var(--border)',
                boxShadow: plan.popular ? '0 0 40px rgba(111,95,246,0.15)' : 'none',
              }}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-semibold px-4 py-1 rounded-full"
                    style={{ background: 'rgba(111,95,246,0.15)', color: '#8B7DF8' }}>Most Popular</span>
                </div>
              )}
              <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-extrabold">${plan.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-400">
                    <span className="text-green-500 flex-shrink-0">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className={`block text-center py-3 rounded-xl text-sm font-medium transition ${
                  plan.popular ? 'text-white' : 'text-gray-300'}`}
                style={{
                  background: plan.popular ? '#6F5FF6' : 'rgba(255,255,255,0.05)',
                  border: plan.popular ? 'none' : '1px solid var(--border)',
                }}>
                {plan.price === 0 ? 'Start Free' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center mt-10 text-sm text-gray-600">
          All plans include Urdu + Roman Urdu support. Cancel anytime. No hidden fees.
        </p>
      </section>
    </div>
  )
}
