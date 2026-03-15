'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [tab, setTab] = useState('overview')
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [model, setModel] = useState('gpt-4o-mini')
  const [maxTokens, setMaxTokens] = useState('800')
  const [freeLimit, setFreeLimit] = useState('5')
  const [caching, setCaching] = useState(true)
  const [maintenance, setMaintenance] = useState(false)

  // Mock data
  const stats = {
    totalUsers: 1000, paidUsers: 320, mrr: 3140,
    generations: 28400, apiCost: 58,
  }
  const mockUsers = Array.from({ length: 8 }, (_, i) => ({
    name: ['Ahmed Khan', 'Sara Ali', 'Bilal Malik', 'Fatima Noor', 'Hassan Raza', 'Ayesha S.', 'Usman T.', 'Zainab W.'][i],
    email: ['ahmed', 'sara', 'bilal', 'fatima', 'hassan', 'ayesha', 'usman', 'zainab'][i] + '@email.com',
    plan: ['free', 'creator', 'agency', 'free', 'creator', 'free', 'agency', 'creator'][i],
    usage: Math.floor(Math.random() * 50),
    status: Math.random() > 0.15 ? 'active' : 'suspended',
  }))

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'users', label: '👥 Users' },
    { id: 'api', label: '🔑 API Control' },
    { id: 'settings', label: '⚙️ System' },
  ]

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 flex flex-col"
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
        <div className="p-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm"
            style={{ background: 'linear-gradient(135deg, #6F5FF6, #06B6D4)' }}>N</div>
          <span className="font-bold">Admin</span>
        </div>
        <div className="flex-1 px-3">
          {tabs.map(t => (
            <div key={t.id}
              className={`px-3 py-2.5 rounded-lg cursor-pointer text-sm mb-0.5 transition ${
                tab === t.id ? 'font-medium' : 'text-gray-400 hover:text-white'
              }`}
              style={{
                background: tab === t.id ? 'rgba(111,95,246,0.12)' : 'transparent',
                color: tab === t.id ? '#8B7DF8' : undefined,
              }}
              onClick={() => setTab(t.id)}>
              {t.label}
            </div>
          ))}
          <div className="mt-6">
            <Link href="/dashboard" className="block px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white transition">
              ← Back to App
            </Link>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Overview */}
        {tab === 'overview' && (
          <div className="max-w-5xl">
            <h1 className="text-2xl font-bold mb-6">📊 Admin Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Users', value: stats.totalUsers.toLocaleString(), color: '#6F5FF6', bg: 'rgba(111,95,246,0.1)' },
                { label: 'Paid Users', value: stats.paidUsers, color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
                { label: 'MRR', value: '$' + stats.mrr.toLocaleString(), color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
                { label: 'Generations', value: '28.4K', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
                { label: 'API Cost (MTD)', value: '$' + stats.apiCost, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
              ].map((s, i) => (
                <div key={i} className="p-5 rounded-xl transition hover:-translate-y-0.5"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-4">Revenue Breakdown</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg" style={{ background: '#13161C' }}>
                  <div className="text-xl font-bold text-gray-300">680</div>
                  <div className="text-xs text-gray-500">Free Users</div>
                </div>
                <div className="p-4 rounded-lg" style={{ background: '#13161C' }}>
                  <div className="text-xl font-bold" style={{ color: '#6F5FF6' }}>245 × $7</div>
                  <div className="text-xs text-gray-500">Creator = $1,715</div>
                </div>
                <div className="p-4 rounded-lg" style={{ background: '#13161C' }}>
                  <div className="text-xl font-bold" style={{ color: '#22C55E' }}>75 × $19</div>
                  <div className="text-xs text-gray-500">Agency = $1,425</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {tab === 'users' && (
          <div className="max-w-5xl">
            <h1 className="text-2xl font-bold mb-6">👥 User Management</h1>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#13161C' }}>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">User</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Plan</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Usage</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((u, i) => (
                    <tr key={i} className="transition hover:bg-[#1C2130]" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                            style={{ background: 'rgba(111,95,246,0.12)', color: '#8B7DF8' }}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{u.name}</div>
                            <div className="text-[11px] text-gray-600">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: u.plan === 'agency' ? 'rgba(34,197,94,0.12)' : u.plan === 'creator' ? 'rgba(111,95,246,0.12)' : 'rgba(59,130,246,0.12)',
                            color: u.plan === 'agency' ? '#22C55E' : u.plan === 'creator' ? '#8B7DF8' : '#3B82F6',
                          }}>{u.plan}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{u.usage}/day</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          u.status === 'active' ? '' : ''
                        }`} style={{
                          background: u.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                          color: u.status === 'active' ? '#22C55E' : '#EF4444',
                        }}>{u.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="px-2 py-1 rounded text-xs text-gray-400 hover:text-white transition"
                            style={{ background: 'rgba(255,255,255,0.03)' }}>👁</button>
                          <button className="px-2 py-1 rounded text-xs text-gray-400 hover:text-white transition"
                            style={{ background: 'rgba(255,255,255,0.03)' }}>✏️</button>
                          <button className="px-2 py-1 rounded text-xs text-red-400 hover:text-red-300 transition"
                            style={{ background: 'rgba(255,255,255,0.03)' }}>🔒</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* API Control */}
        {tab === 'api' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">🔑 API Control</h1>

            <div className="p-6 rounded-xl mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-1">OpenAI API Key</h3>
              <p className="text-xs text-gray-500 mb-4">Enter your key to enable real AI generation</p>
              <div className="flex gap-2">
                <input type={showKey ? 'text' : 'password'}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                  placeholder="sk-xxxxxxxxxxxxxxxx"
                  value={apiKey} onChange={e => setApiKey(e.target.value)} />
                <button onClick={() => setShowKey(!showKey)}
                  className="px-3 py-2 rounded-lg text-xs"
                  style={{ background: '#13161C', border: '1px solid #1E2330', color: '#8B93A7' }}>
                  {showKey ? '🙈' : '👁'}
                </button>
                <button className="px-4 py-2 rounded-lg text-xs font-medium text-white"
                  style={{ background: '#6F5FF6' }}>Save</button>
              </div>
              <p className="text-[10px] text-gray-600 mt-2">⚠️ Never share your API key publicly</p>
            </div>

            <div className="p-6 rounded-xl mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-4">Model Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">AI Model</label>
                  <select className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none"
                    style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                    value={model} onChange={e => setModel(e.target.value)}>
                    <option value="gpt-4o-mini">GPT-4o Mini (Cheapest)</option>
                    <option value="gpt-4o">GPT-4o (Best Quality)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max Tokens</label>
                  <input type="number" className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                    value={maxTokens} onChange={e => setMaxTokens(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-4">Usage Limits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Free Plan Daily Limit</label>
                  <input type="number" className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                    value={freeLimit} onChange={e => setFreeLimit(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Response Caching</label>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`relative w-11 h-6 rounded-full cursor-pointer transition ${caching ? '' : ''}`}
                      style={{ background: caching ? '#6F5FF6' : '#1E2330' }}
                      onClick={() => setCaching(!caching)}>
                      <div className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
                        style={{ left: caching ? '22px' : '4px' }} />
                    </div>
                    <span className="text-sm text-gray-400">{caching ? 'On' : 'Off'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-4">Estimated Monthly Cost</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold" style={{ color: '#22C55E' }}>$58</div>
                  <div className="text-xs text-gray-500">This Month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: '#3B82F6' }}>28,400</div>
                  <div className="text-xs text-gray-500">API Calls</div>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: '#6F5FF6' }}>$0.002</div>
                  <div className="text-xs text-gray-500">Avg/Call</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Settings */}
        {tab === 'settings' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">⚙️ System Settings</h1>

            <div className="p-6 rounded-xl mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-4">Platform Controls</h3>
              <div className="flex justify-between items-center py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div className="text-sm font-medium">Maintenance Mode</div>
                  <div className="text-xs text-gray-500">Disable platform for all users</div>
                </div>
                <div className={`relative w-11 h-6 rounded-full cursor-pointer transition`}
                  style={{ background: maintenance ? '#EF4444' : '#1E2330' }}
                  onClick={() => setMaintenance(!maintenance)}>
                  <div className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
                    style={{ left: maintenance ? '22px' : '4px' }} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-4">System Info</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <span className="text-gray-500">Database</span><span>Supabase (PostgreSQL)</span>
                <span className="text-gray-500">AI Engine</span><span>OpenAI API</span>
                <span className="text-gray-500">Payments</span><span>Stripe</span>
                <span className="text-gray-500">Hosting</span><span>Vercel (Next.js)</span>
                <span className="text-gray-500">Status</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block w-fit"
                  style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>Operational</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
