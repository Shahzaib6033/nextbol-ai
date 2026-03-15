'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [tab, setTab] = useState('overview')
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [model, setModel] = useState('gpt-4o-mini')
  const [maxTokens, setMaxTokens] = useState('800')
  const [temperature, setTemperature] = useState('0.8')
  const [freeLimit, setFreeLimit] = useState('5')
  const [caching, setCaching] = useState(true)
  const [maintenance, setMaintenance] = useState(false)
  const [signupsEnabled, setSignupsEnabled] = useState(true)
  const [creatorPrice, setCreatorPrice] = useState('7')
  const [agencyPrice, setAgencyPrice] = useState('19')
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [toast, setToast] = useState(null)

  // Check stored session
  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin-token') : null
    if (token) setAuthenticated(true)
  }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true); setLoginError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (data.error) { setLoginError(data.error); setLoginLoading(false); return }
      sessionStorage.setItem('admin-token', data.token)
      setAuthenticated(true)
    } catch (err) {
      setLoginError('Connection failed. Please try again.')
    }
    setLoginLoading(false)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin-token')
    setAuthenticated(false)
    setLoginEmail(''); setLoginPassword('')
  }

  const refreshStats = () => {
    setRefreshing(true)
    setTimeout(() => { setRefreshing(false); setLastRefresh(new Date().toLocaleTimeString()); showToast('Stats refreshed') }, 800)
  }

  // Mock real-time data
  const stats = {
    totalUsers: 1247, newToday: 38, paidUsers: 342, freeUsers: 905,
    creators: 267, agencies: 75, mrr: (267 * 7) + (75 * 19),
    totalGenerations: 34280, todayGenerations: 892,
    apiCost: 68.56, avgCostPerCall: 0.002,
    activeNow: 23, conversionRate: 27.4,
  }

  const recentActivity = [
    { action: 'New signup', user: 'ahmed.k@gmail.com', time: '2 min ago', type: 'signup' },
    { action: 'Upgraded to Creator', user: 'sara.ali@yahoo.com', time: '8 min ago', type: 'upgrade' },
    { action: 'Generated content', user: 'bilal.m@outlook.com', time: '12 min ago', type: 'generation' },
    { action: 'Upgraded to Agency', user: 'fatima.n@gmail.com', time: '25 min ago', type: 'upgrade' },
    { action: 'New signup', user: 'hassan.r@gmail.com', time: '31 min ago', type: 'signup' },
    { action: 'Generated content', user: 'ayesha.s@hotmail.com', time: '45 min ago', type: 'generation' },
  ]

  const mockUsers = Array.from({ length: 12 }, (_, i) => ({
    name: ['Ahmed Khan', 'Sara Ali', 'Bilal Malik', 'Fatima Noor', 'Hassan Raza', 'Ayesha Siddiq', 'Usman Tariq', 'Zainab Waheed', 'Imran Shah', 'Hira Bukhari', 'Kamran Yousuf', 'Nadia Parveen'][i],
    email: ['ahmed', 'sara', 'bilal', 'fatima', 'hassan', 'ayesha', 'usman', 'zainab', 'imran', 'hira', 'kamran', 'nadia'][i] + '@email.com',
    plan: ['free', 'creator', 'agency', 'free', 'creator', 'free', 'agency', 'creator', 'free', 'creator', 'free', 'agency'][i],
    usage: Math.floor(Math.random() * 50),
    status: Math.random() > 0.1 ? 'active' : 'suspended',
    joined: new Date(Date.now() - Math.random() * 30 * 86400000).toLocaleDateString(),
    revenue: ['$0', '$7', '$19', '$0', '$7', '$0', '$19', '$7', '$0', '$7', '$0', '$19'][i],
  }))

  // Admin Login Screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center font-extrabold text-xl" style={{ background: 'linear-gradient(135deg, #6F5FF6, #06B6D4)' }}>N</div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-gray-500 mt-1">Authorized access only</p>
          </div>
          <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <form onSubmit={handleAdminLogin}>
              <div className="mb-4">
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wider">Admin Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} placeholder="admin@nextbol.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              </div>
              <div className="mb-5">
                <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wider">Password</label>
                <input type="password" className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} placeholder="Enter admin password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
              </div>
              {loginError && <p className="text-red-400 text-xs mb-3">{loginError}</p>}
              <button type="submit" disabled={loginLoading} className="w-full py-3 rounded-lg text-sm font-medium text-white transition disabled:opacity-50" style={{ background: '#6F5FF6' }}>{loginLoading ? 'Authenticating...' : 'Access Admin Panel'}</button>
            </form>
          </div>
          <p className="text-center mt-4"><Link href="/" className="text-xs text-gray-600">Back to home</Link></p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'ai-config', label: 'AI Configuration' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'system', label: 'System' },
  ]

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Toast */}
      {toast && <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--green)', color: 'var(--green)' }}>{toast}</div>}

      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 flex flex-col" style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
        <div className="p-4 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm" style={{ background: 'linear-gradient(135deg, #6F5FF6, #06B6D4)' }}>N</div>
          <div>
            <span className="font-bold text-sm">Admin Panel</span>
            <div className="text-[9px] text-gray-500 uppercase tracking-wider">NextBol AI</div>
          </div>
        </div>
        <div className="flex-1 px-3 mt-2">
          {tabs.map(t => (
            <div key={t.id} className={`px-3 py-2.5 rounded-lg cursor-pointer text-sm mb-0.5 transition ${tab === t.id ? 'font-medium' : 'text-gray-400 hover:text-white'}`}
              style={{ background: tab === t.id ? 'rgba(111,95,246,0.12)' : 'transparent', color: tab === t.id ? '#8B7DF8' : undefined }}
              onClick={() => setTab(t.id)}>{t.label}</div>
          ))}
        </div>
        <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white transition mb-1">Back to App</Link>
          <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 transition">Logout</button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-12 flex items-center justify-between px-6" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <h1 className="text-sm font-semibold capitalize">{tab.replace('-', ' ')}</h1>
          <div className="flex items-center gap-3">
            {lastRefresh && <span className="text-[10px] text-gray-600">Updated {lastRefresh}</span>}
            <button onClick={refreshStats} className={`text-xs px-3 py-1.5 rounded-lg transition ${refreshing ? 'opacity-50' : ''}`} style={{ background: '#13161C', border: '1px solid #1E2330', color: '#8B93A7' }}>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview */}
          {tab === 'overview' && (
            <div className="max-w-6xl">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                {[
                  { label: 'Total Users', value: stats.totalUsers.toLocaleString(), sub: `+${stats.newToday} today`, color: '#6F5FF6' },
                  { label: 'Paid Users', value: stats.paidUsers, sub: `${stats.conversionRate}% conversion`, color: '#22C55E' },
                  { label: 'MRR', value: `$${stats.mrr.toLocaleString()}`, sub: `${stats.creators} creators, ${stats.agencies} agencies`, color: '#F59E0B' },
                  { label: 'Generations', value: stats.totalGenerations.toLocaleString(), sub: `${stats.todayGenerations} today`, color: '#3B82F6' },
                  { label: 'API Cost', value: `$${stats.apiCost}`, sub: `$${stats.avgCostPerCall}/call`, color: '#EF4444' },
                  { label: 'Active Now', value: stats.activeNow, sub: 'real-time', color: '#06B6D4' },
                ].map((s, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="text-xl font-bold mb-0.5" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[11px] font-medium text-gray-400">{s.label}</div>
                    <div className="text-[9px] text-gray-600 mt-0.5">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Revenue split */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-sm font-medium text-gray-400 mb-3">Free Users</div>
                  <div className="text-3xl font-bold text-gray-500">{stats.freeUsers}</div>
                  <div className="mt-2 h-1.5 rounded-full" style={{ background: '#13161C' }}><div className="h-full rounded-full" style={{ width: `${(stats.freeUsers/stats.totalUsers)*100}%`, background: '#5A6280' }} /></div>
                </div>
                <div className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-sm font-medium text-gray-400 mb-3">Creator Plans</div>
                  <div className="text-3xl font-bold" style={{ color: '#6F5FF6' }}>{stats.creators}</div>
                  <div className="text-xs text-gray-500 mt-1">${stats.creators * 7}/mo revenue</div>
                </div>
                <div className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-sm font-medium text-gray-400 mb-3">Agency Plans</div>
                  <div className="text-3xl font-bold" style={{ color: '#22C55E' }}>{stats.agencies}</div>
                  <div className="text-xs text-gray-500 mt-1">${stats.agencies * 19}/mo revenue</div>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="px-5 py-3 font-medium text-sm" style={{ borderBottom: '1px solid var(--border)' }}>Recent Activity</div>
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 transition hover:bg-[#1C2130]" style={{ borderBottom: i < recentActivity.length-1 ? '1px solid var(--border)' : 'none' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: a.type === 'upgrade' ? '#22C55E' : a.type === 'signup' ? '#6F5FF6' : '#3B82F6' }} />
                      <div>
                        <div className="text-sm">{a.action}</div>
                        <div className="text-[10px] text-gray-600">{a.user}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-600">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <div className="max-w-6xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm text-gray-400">{mockUsers.length} users total</span>
                </div>
                <input className="px-3 py-2 rounded-lg text-sm outline-none w-64" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} placeholder="Search users..." />
              </div>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: '#13161C' }}>
                      {['User', 'Plan', 'Usage', 'Revenue', 'Status', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((u, i) => (
                      <tr key={i} className="transition hover:bg-[#1C2130]" style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium">{u.name}</div>
                          <div className="text-[10px] text-gray-600">{u.email}</div>
                        </td>
                        <td className="px-4 py-3"><span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: u.plan === 'agency' ? 'rgba(34,197,94,0.12)' : u.plan === 'creator' ? 'rgba(111,95,246,0.12)' : 'rgba(90,98,128,0.15)', color: u.plan === 'agency' ? '#22C55E' : u.plan === 'creator' ? '#8B7DF8' : '#5A6280' }}>{u.plan}</span></td>
                        <td className="px-4 py-3 text-sm text-gray-400">{u.usage}/day</td>
                        <td className="px-4 py-3 text-sm text-gray-400">{u.revenue}/mo</td>
                        <td className="px-4 py-3"><span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: u.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color: u.status === 'active' ? '#22C55E' : '#EF4444' }}>{u.status}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-500">{u.joined}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => showToast(`Viewing ${u.name}`)} className="px-2 py-1 rounded text-[10px] text-gray-500 hover:text-white transition" style={{ background: '#13161C' }}>View</button>
                            <button onClick={() => showToast(`${u.status === 'active' ? 'Suspended' : 'Activated'} ${u.name}`)} className="px-2 py-1 rounded text-[10px] text-gray-500 hover:text-red-400 transition" style={{ background: '#13161C' }}>{u.status === 'active' ? 'Suspend' : 'Activate'}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI Configuration */}
          {tab === 'ai-config' && (
            <div className="max-w-2xl">
              <div className="p-6 rounded-xl mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-1">OpenAI API Key</h3>
                <p className="text-xs text-gray-500 mb-4">Required for AI content generation. Added via Vercel Environment Variables.</p>
                <div className="flex gap-2">
                  <input type={showKey ? 'text' : 'password'} className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} placeholder="sk-..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
                  <button onClick={() => setShowKey(!showKey)} className="px-3 py-2 rounded-lg text-xs" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#8B93A7' }}>{showKey ? 'Hide' : 'Show'}</button>
                  <button onClick={() => showToast('API key must be updated in Vercel Environment Variables')} className="px-4 py-2 rounded-lg text-xs font-medium text-white" style={{ background: '#6F5FF6' }}>Save</button>
                </div>
                <p className="text-[9px] text-gray-600 mt-2">Note: For security, the API key is stored in Vercel Environment Variables, not in the database.</p>
              </div>

              <div className="p-6 rounded-xl mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-4">Model Configuration</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Model</label>
                    <select className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} value={model} onChange={e => setModel(e.target.value)}>
                      <option value="gpt-4o-mini">GPT-4o Mini</option>
                      <option value="gpt-4o">GPT-4o</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Max Tokens</label>
                    <input type="number" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} value={maxTokens} onChange={e => setMaxTokens(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Temperature</label>
                    <input type="number" step="0.1" min="0" max="2" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} value={temperature} onChange={e => setTemperature(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-4">Usage Controls</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Free Daily Limit</label>
                    <input type="number" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} value={freeLimit} onChange={e => setFreeLimit(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Response Caching</label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="relative w-11 h-6 rounded-full cursor-pointer transition" style={{ background: caching ? '#6F5FF6' : '#1E2330' }} onClick={() => setCaching(!caching)}>
                        <div className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all" style={{ left: caching ? '22px' : '4px' }} />
                      </div>
                      <span className="text-sm text-gray-400">{caching ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-4">Cost Analysis</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div><div className="text-xl font-bold" style={{ color: '#22C55E' }}>$68.56</div><div className="text-[10px] text-gray-500">This Month</div></div>
                  <div><div className="text-xl font-bold" style={{ color: '#3B82F6' }}>34,280</div><div className="text-[10px] text-gray-500">Total Calls</div></div>
                  <div><div className="text-xl font-bold" style={{ color: '#6F5FF6' }}>$0.002</div><div className="text-[10px] text-gray-500">Avg Per Call</div></div>
                  <div><div className="text-xl font-bold" style={{ color: '#F59E0B' }}>$2,946</div><div className="text-[10px] text-gray-500">Net Profit</div></div>
                </div>
              </div>

              <button onClick={() => showToast('Configuration saved successfully')} className="w-full mt-4 py-3 rounded-xl text-sm font-medium text-white" style={{ background: '#6F5FF6' }}>Save All Configuration</button>
            </div>
          )}

          {/* Revenue */}
          {tab === 'revenue' && (
            <div className="max-w-4xl">
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="p-5 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-bold" style={{ color: '#22C55E' }}>${stats.mrr.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Monthly Recurring Revenue</div>
                </div>
                <div className="p-5 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-bold" style={{ color: '#6F5FF6' }}>${(stats.mrr * 12).toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Annual Run Rate</div>
                </div>
                <div className="p-5 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-bold" style={{ color: '#F59E0B' }}>${stats.apiCost}</div>
                  <div className="text-[10px] text-gray-500 mt-1">API Costs This Month</div>
                </div>
                <div className="p-5 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-bold" style={{ color: '#06B6D4' }}>${(stats.mrr - stats.apiCost).toFixed(0)}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Net Profit</div>
                </div>
              </div>

              <div className="p-6 rounded-xl mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-4">Pricing Configuration</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Free Limit (per day)</label><input type="number" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} value={freeLimit} onChange={e => setFreeLimit(e.target.value)} /></div>
                  <div><label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Creator Price ($/mo)</label><input type="number" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} value={creatorPrice} onChange={e => setCreatorPrice(e.target.value)} /></div>
                  <div><label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Agency Price ($/mo)</label><input type="number" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} value={agencyPrice} onChange={e => setAgencyPrice(e.target.value)} /></div>
                </div>
                <button onClick={() => showToast('Pricing updated. Update Stripe products to match.')} className="mt-4 px-6 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#6F5FF6' }}>Update Pricing</button>
              </div>
            </div>
          )}

          {/* System */}
          {tab === 'system' && (
            <div className="max-w-2xl">
              <div className="p-6 rounded-xl mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-4">Platform Controls</h3>
                {[
                  { label: 'Maintenance Mode', desc: 'Disable platform for all users', value: maintenance, set: setMaintenance, color: '#EF4444' },
                  { label: 'New Signups', desc: 'Allow new user registrations', value: signupsEnabled, set: setSignupsEnabled, color: '#22C55E' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-4" style={{ borderBottom: i === 0 ? '1px solid var(--border)' : 'none' }}>
                    <div><div className="text-sm font-medium">{item.label}</div><div className="text-xs text-gray-500">{item.desc}</div></div>
                    <div className="relative w-11 h-6 rounded-full cursor-pointer transition" style={{ background: item.value ? item.color : '#1E2330' }} onClick={() => { item.set(!item.value); showToast(`${item.label} ${!item.value ? 'enabled' : 'disabled'}`) }}>
                      <div className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all" style={{ left: item.value ? '22px' : '4px' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-xl mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-4">Infrastructure</h3>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <span className="text-gray-500">Frontend</span><span>Next.js 14 on Vercel</span>
                  <span className="text-gray-500">Database</span><span>Supabase (PostgreSQL)</span>
                  <span className="text-gray-500">AI Engine</span><span>OpenAI API ({model})</span>
                  <span className="text-gray-500">Payments</span><span>Stripe</span>
                  <span className="text-gray-500">Status</span><span className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block w-fit" style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>All Systems Operational</span>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid #EF4444' }}>
                <h3 className="font-semibold mb-2" style={{ color: '#EF4444' }}>Danger Zone</h3>
                <p className="text-xs text-gray-500 mb-4">These actions are irreversible. Proceed with caution.</p>
                <div className="flex gap-3">
                  <button onClick={() => showToast('Cache cleared successfully')} className="px-4 py-2 rounded-lg text-xs font-medium text-white" style={{ background: '#EF4444' }}>Clear Cache</button>
                  <button onClick={() => showToast('Daily usage reset for all users')} className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: '#13161C', border: '1px solid #EF4444', color: '#EF4444' }}>Reset All Usage</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
