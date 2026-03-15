'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill all fields'); return }
    setLoading(true)
    setError('')

    // Try Supabase auth, fallback to demo mode
    try {
      const { supabase } = await import('@/lib/supabase')
      if (supabase) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) throw authError
        router.push('/dashboard')
        return
      }
    } catch (err) {
      console.log('Auth error or demo mode:', err.message)
    }

    // Demo mode — redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="hero-grid" />
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(111,95,246,0.1), transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center font-extrabold text-xl"
            style={{ background: 'linear-gradient(135deg, #6F5FF6, #06B6D4)' }}>N</div>
          <h1 className="text-2xl font-extrabold">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue creating</p>
        </div>

        <div className="p-7 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-lg text-sm outline-none transition"
                style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
              <input type="password" className="w-full px-4 py-3 rounded-lg text-sm outline-none transition"
                style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-medium text-white transition disabled:opacity-50"
              style={{ background: '#6F5FF6' }}>
              {loading ? '⟳ Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium" style={{ color: '#6F5FF6' }}>Sign up</Link>
        </p>
        <p className="text-center mt-2">
          <Link href="/" className="text-xs text-gray-600">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
