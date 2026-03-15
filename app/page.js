'use client'
import { useState } from 'react'
import Link from 'next/link'

const TOOLS = [
  { icon: '🎬', name: 'YouTube Script', desc: 'Viral YouTube scripts in Urdu' },
  { icon: '🎵', name: 'TikTok Caption', desc: 'Scroll-stopping captions' },
  { icon: '📸', name: 'Instagram Caption', desc: 'Engaging IG content' },
  { icon: '📘', name: 'Facebook Post', desc: 'Viral Facebook posts' },
  { icon: '📝', name: 'Blog Writer', desc: 'SEO Urdu blog articles' },
  { icon: '🕌', name: 'Islamic Content', desc: 'Respectful reminders' },
  { icon: '📢', name: 'Ad Copy', desc: 'Meta & Google ad copy' },
  { icon: '🔄', name: 'Urdu ↔ Roman', desc: 'Script converter' },
]

const PLANS = [
  { name: 'Free', price: 0, features: ['5 generations/day', '3 AI tools', 'Basic tones', 'Watermark on export'] },
  { name: 'Creator', price: 7, popular: true, features: ['Unlimited generations', 'All 12+ AI tools', 'All tones & languages', 'No watermark', 'Content history', 'Priority speed'] },
  { name: 'Agency', price: 19, features: ['Everything in Creator', '5 team members', 'Multiple brands', 'API access', 'Analytics dashboard', 'Priority support'] },
]

export default function LandingPage() {
  const [demoTopic, setDemoTopic] = useState('')
  const [demoOutput, setDemoOutput] = useState('')
  const [demoLoading, setDemoLoading] = useState(false)

  const runDemo = async () => {
    if (!demoTopic.trim()) return
    setDemoLoading(true)
    setDemoOutput('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: demoTopic,
          tool: 'facebook',
          tone: 'motivational',
          language: 'roman-urdu',
        }),
      })
      const data = await res.json()

      // Typing effect
      const text = data.content || data.error || 'Content generated!'
      let i = 0
      const interval = setInterval(() => {
        setDemoOutput(text.slice(0, i))
        i += 3
        if (i > text.length) {
          setDemoOutput(text)
          clearInterval(interval)
          setDemoLoading(false)
        }
      }, 15)
    } catch (err) {
      setDemoOutput('Demo mode — connect OpenAI API key for real AI content')
      setDemoLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="hero-grid" />

      {/* Floating orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(111,95,246,0.12), transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)', animation: 'float 10s ease-in-out infinite reverse' }} />

      {/* Nav */}
      <nav className="relative z-10 max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-lg"
            style={{ background: 'linear-gradient(135deg, #6F5FF6, #06B6D4)' }}>N</div>
          <span className="font-bold text-xl">NextBol<span style={{ color: '#6F5FF6' }}>.ai</span></span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm text-gray-400 hover:text-white transition hidden md:block">Features</a>
          <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition hidden md:block">Pricing</a>
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition">Log in</Link>
          <Link href="/signup"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition hover:-translate-y-0.5"
            style={{ background: '#6F5FF6', boxShadow: '0 2px 12px rgba(111,95,246,0.3)' }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center max-w-3xl mx-auto px-6 pt-20 pb-16">
        <div className="animate-fade mb-5">
          <span className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(111,95,246,0.15)', color: '#8B7DF8' }}>
            ✨ #1 Urdu AI Content Platform
          </span>
        </div>
        <h1 className="animate-fade text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-5"
          style={{ animationDelay: '0.1s' }}>
          Create Viral Urdu Content{' '}
          <span className="gradient-text">with AI</span>
        </h1>
        <p className="animate-fade text-lg text-gray-400 max-w-xl mx-auto mb-9 leading-relaxed"
          style={{ animationDelay: '0.2s' }}>
          Generate YouTube scripts, social media posts, blogs & ads in Urdu and Roman Urdu — in seconds. Built for Pakistani creators.
        </p>
        <div className="animate-fade flex gap-3 justify-center flex-wrap" style={{ animationDelay: '0.3s' }}>
          <Link href="/signup"
            className="px-7 py-3.5 rounded-lg text-base font-medium text-white transition hover:-translate-y-0.5"
            style={{ background: '#6F5FF6', boxShadow: '0 4px 20px rgba(111,95,246,0.3)' }}>
            ✨ Start Creating Free
          </Link>
          <a href="#demo"
            className="px-7 py-3.5 rounded-lg text-base font-medium transition border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: '#1E2330' }}>
            ▶ Watch Demo
          </a>
        </div>
        <div className="animate-fade mt-6 flex items-center justify-center gap-5 text-xs text-gray-500"
          style={{ animationDelay: '0.4s' }}>
          <span>✓ No credit card required</span>
          <span>✓ 5 free generations/day</span>
          <span>✓ Urdu + Roman Urdu</span>
        </div>
      </section>

      {/* Live Demo */}
      <section id="demo" className="relative z-10 max-w-3xl mx-auto px-6 pb-20">
        <div className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid #6F5FF6', boxShadow: '0 0 60px rgba(111,95,246,0.15)', background: 'var(--bg-card)' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ background: '#13161C', borderBottom: '1px solid #1E2330' }}>
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-3 text-xs text-gray-500">NextBol AI Generator — Try it now!</span>
          </div>
          <div className="p-6">
            <div className="flex gap-3 mb-4">
              <input
                className="flex-1 px-4 py-3 rounded-lg text-sm outline-none transition"
                style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                placeholder="Topic likhein... (e.g., Mehnat aur kamyabi)"
                value={demoTopic}
                onChange={(e) => setDemoTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runDemo()}
              />
              <button
                className="px-6 py-3 rounded-lg text-sm font-medium text-white transition disabled:opacity-50"
                style={{ background: '#6F5FF6' }}
                onClick={runDemo}
                disabled={demoLoading}
              >
                {demoLoading ? '⟳' : '✨ Generate'}
              </button>
            </div>
            <div className={`rounded-lg p-5 min-h-[160px] text-sm leading-relaxed ${demoLoading ? 'typing-cursor' : ''}`}
              style={{ background: '#13161C', border: '1px solid #1E2330', color: '#8B93A7', whiteSpace: 'pre-wrap' }}>
              {demoOutput || (
                <div className="text-center pt-12 text-gray-600">
                  ⬆️ Topic likhein aur Generate dabayein
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold mb-3">Everything You Need to Create</h2>
          <p className="text-gray-400">Powerful AI tools designed for Urdu & Roman Urdu creators</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool, i) => (
            <div key={i} className="p-5 rounded-xl transition hover:-translate-y-1 cursor-pointer"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h3 className="font-semibold mb-1">{tool.name}</h3>
              <p className="text-xs text-gray-500">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold mb-3">Simple, Transparent Pricing</h2>
          <p className="text-gray-400">Start free. Upgrade when you&apos;re ready.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.name}
              className={`relative p-8 rounded-2xl transition hover:-translate-y-1 ${plan.popular ? '' : ''}`}
              style={{
                background: 'var(--bg-card)',
                border: plan.popular ? '1px solid #6F5FF6' : '1px solid var(--border)',
                boxShadow: plan.popular ? '0 0 40px rgba(111,95,246,0.15)' : 'none',
              }}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-semibold px-4 py-1 rounded-full"
                    style={{ background: 'rgba(111,95,246,0.15)', color: '#8B7DF8' }}>⭐ Most Popular</span>
                </div>
              )}
              <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
              <div className="mb-5">
                <span className="text-4xl font-extrabold">${plan.price}</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              <ul className="mb-6 space-y-2.5">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-green-500 text-xs">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className={`block text-center py-2.5 rounded-lg text-sm font-medium transition ${
                  plan.popular ? 'text-white' : 'text-gray-300'
                }`}
                style={{
                  background: plan.popular ? '#6F5FF6' : 'rgba(255,255,255,0.05)',
                  border: plan.popular ? 'none' : '1px solid var(--border)',
                }}>
                {plan.price === 0 ? 'Start Free' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center py-20 px-6">
        <h2 className="text-4xl font-extrabold mb-4">
          Ready to Create <span className="gradient-text">Amazing Content?</span>
        </h2>
        <p className="text-gray-400 mb-8">Join thousands of Urdu content creators using NextBol AI</p>
        <Link href="/signup"
          className="inline-block px-8 py-4 rounded-xl text-base font-medium text-white transition hover:-translate-y-0.5"
          style={{ background: '#6F5FF6', boxShadow: '0 4px 20px rgba(111,95,246,0.3)' }}>
          ✨ Start for Free — No Credit Card
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-xs text-gray-600" style={{ borderTop: '1px solid var(--border)' }}>
        © 2026 NextBol AI — The #1 Urdu Content Platform
      </footer>
    </div>
  )
}
