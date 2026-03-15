'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) { setError('Please fill all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')

    try {
      const { supabase } = await import('@/lib/supabase')
      if (supabase) {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } }
        })
        if (authError) throw authError
        router.push('/dashboard')
        return
      }
    } catch (err) {
      console.log('Auth error or demo mode:', err.message)
    }

    // Demo mode
    setTimeout(() => { router.push('/dashboard') }, 500)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="hero-grid" />
      <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)', animation: 'float 10s ease-in-out infinite' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center font-extrabold text-xl"
            style={{ background: 'linear-gradient(135deg, #6F5FF6, #06B6D4)' }}>N</div>
          <h1 className="text-2xl font-extrabold">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Start creating Urdu content with AI</p>
        </div>

        <div className="p-7 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
              <input className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                placeholder="Ahmed Khan" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
              <input type="password" className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-medium text-white transition disabled:opacity-50"
              style={{ background: '#6F5FF6' }}>
              {loading ? '⟳ Creating...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium" style={{ color: '#6F5FF6' }}>Sign in</Link>
        </p>
        <p className="text-center mt-2">
          <Link href="/" className="text-xs text-gray-600">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
