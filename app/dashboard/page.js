'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const TOOLS = [
  { id: 'youtube', name: 'YouTube Script', icon: '🎬', desc: 'Viral scripts in Urdu' },
  { id: 'tiktok', name: 'TikTok Caption', icon: '🎵', desc: 'Scroll-stopping captions' },
  { id: 'instagram', name: 'Instagram Caption', icon: '📸', desc: 'Engaging IG posts' },
  { id: 'facebook', name: 'Facebook Post', icon: '📘', desc: 'Viral FB content' },
  { id: 'blog', name: 'Blog Writer', icon: '📝', desc: 'SEO blog articles' },
  { id: 'islamic', name: 'Islamic Content', icon: '🕌', desc: 'Respectful reminders' },
  { id: 'ad-copy', name: 'Ad Copy', icon: '📢', desc: 'Meta & Google ads' },
  { id: 'converter', name: 'Urdu ↔ Roman', icon: '🔄', desc: 'Script converter' },
  { id: 'hashtag', name: 'Hashtag Gen', icon: '#️⃣', desc: 'Viral hashtags' },
  { id: 'story', name: 'Story Generator', icon: '📖', desc: 'Urdu stories' },
  { id: 'motivational', name: 'Motivational', icon: '💪', desc: 'Inspiring quotes' },
  { id: 'seo', name: 'SEO Writer', icon: '🔍', desc: 'Meta descriptions' },
]

const TONES = [
  { id: 'professional', label: 'Professional', emoji: '💼' },
  { id: 'emotional', label: 'Emotional', emoji: '❤️' },
  { id: 'funny', label: 'Funny', emoji: '😄' },
  { id: 'motivational', label: 'Motivational', emoji: '🔥' },
  { id: 'islamic', label: 'Islamic', emoji: '🕌' },
  { id: 'educational', label: 'Educational', emoji: '📚' },
]

const LANGUAGES = [
  { id: 'urdu', label: 'اردو (Urdu)' },
  { id: 'roman-urdu', label: 'Roman Urdu' },
  { id: 'both', label: 'Urdu + Roman' },
]

export default function DashboardPage() {
  const [selectedTool, setSelectedTool] = useState('facebook')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('motivational')
  const [language, setLanguage] = useState('roman-urdu')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [dailyUsage, setDailyUsage] = useState(0)
  const [activeTab, setActiveTab] = useState('generate')
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const generate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setOutput('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tool: selectedTool, tone, language }),
      })
      const data = await res.json()
      const text = data.content || data.error || 'Generated!'

      // Typing effect
      let i = 0
      const interval = setInterval(() => {
        setOutput(text.slice(0, i))
        i += 3
        if (i > text.length) {
          setOutput(text)
          clearInterval(interval)
          setLoading(false)
          setDailyUsage(prev => prev + 1)
          setHistory(prev => [{
            tool: TOOLS.find(t => t.id === selectedTool)?.name || selectedTool,
            topic, tone, language, output: text,
            date: new Date().toISOString(),
          }, ...prev])
        }
      }, 12)
    } catch (err) {
      setOutput('Error: ' + err.message)
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 flex flex-col transition-all duration-300`}
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>

        <div className="p-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6F5FF6, #06B6D4)' }}>N</div>
          <span className="font-bold text-lg">NextBol<span style={{ color: '#6F5FF6' }}>.ai</span></span>
        </div>

        {/* Plan badge */}
        <div className="px-4 pb-4">
          <div className="p-3 rounded-lg" style={{ background: 'rgba(111,95,246,0.1)' }}>
            <div className="text-[11px] text-gray-500">Current Plan</div>
            <div className="text-sm font-semibold" style={{ color: '#8B7DF8' }}>Free</div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-3">
          <div className="text-[10px] font-semibold text-gray-600 px-2 mb-2 uppercase tracking-wider">Main</div>
          {[
            { id: 'generate', icon: '✨', label: 'AI Generator' },
            { id: 'tools', icon: '🧰', label: 'AI Tools' },
            { id: 'history', icon: '📜', label: 'History' },
          ].map(item => (
            <div key={item.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm mb-0.5 transition ${
                activeTab === item.id ? 'font-medium' : 'text-gray-400 hover:text-white'
              }`}
              style={{
                background: activeTab === item.id ? 'rgba(111,95,246,0.12)' : 'transparent',
                color: activeTab === item.id ? '#8B7DF8' : undefined,
              }}
              onClick={() => setActiveTab(item.id)}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}

          <div className="text-[10px] font-semibold text-gray-600 px-2 mb-2 mt-5 uppercase tracking-wider">Account</div>
          <Link href="/pricing"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white transition">
            <span>💎</span><span>Upgrade</span>
          </Link>
          <Link href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white transition">
            <span>🚪</span><span>Logout</span>
          </Link>
        </div>

        <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
              style={{ background: 'rgba(111,95,246,0.15)', color: '#8B7DF8' }}>U</div>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">User</div>
              <div className="text-[10px] text-gray-600 truncate">Demo Mode</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-16 flex items-center px-6 gap-4 flex-shrink-0"
          style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition">☰</button>
          <div className="flex-1" />
          <span className="text-xs text-gray-600 px-3 py-1 rounded-full" style={{ background: '#13161C' }}>
            {dailyUsage}/5 used today
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Generator Tab */}
          {activeTab === 'generate' && (
            <div className="max-w-5xl">
              <h1 className="text-2xl font-bold mb-1">AI Content Generator</h1>
              <p className="text-sm text-gray-500 mb-6">Create viral Urdu & Roman Urdu content in seconds</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <div className="p-5 rounded-xl mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">AI Tool</label>
                    <select className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none"
                      style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                      value={selectedTool} onChange={e => setSelectedTool(e.target.value)}>
                      {TOOLS.map(t => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
                    </select>
                  </div>

                  <div className="p-5 rounded-xl mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Topic / Input</label>
                    <textarea className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-y min-h-[100px]"
                      style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                      placeholder="Apna topic likhein... (e.g., Mehnat aur kamyabi)"
                      value={topic} onChange={e => setTopic(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Tone</label>
                      <select className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none"
                        style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                        value={tone} onChange={e => setTone(e.target.value)}>
                        {TONES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}
                      </select>
                    </div>
                    <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Language</label>
                      <select className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none"
                        style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                        value={language} onChange={e => setLanguage(e.target.value)}>
                        {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <button onClick={generate} disabled={loading || !topic.trim()}
                    className="w-full py-3.5 rounded-xl text-sm font-medium text-white transition disabled:opacity-50 hover:-translate-y-0.5"
                    style={{ background: '#6F5FF6', boxShadow: '0 4px 20px rgba(111,95,246,0.3)' }}>
                    {loading ? '⟳ Generating...' : '✨ Generate Content'}
                  </button>
                </div>

                {/* Output */}
                <div>
                  <div className={`rounded-xl p-5 min-h-[350px] ${loading ? 'typing-cursor' : ''}`}
                    style={{ background: '#13161C', border: '1px solid #1E2330', whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '14px' }}>
                    {output ? output : (
                      <div className="flex flex-col items-center justify-center h-[300px] text-gray-600">
                        <span className="text-4xl mb-4">✨</span>
                        <p>Your AI content will appear here</p>
                        <p className="text-xs mt-1">Select a tool, enter topic, and generate</p>
                      </div>
                    )}
                  </div>

                  {output && !loading && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={copyToClipboard}
                        className="px-4 py-2 rounded-lg text-xs font-medium transition"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: '#8B93A7' }}>
                        {copied ? '✓ Copied!' : '📋 Copy'}
                      </button>
                      <button onClick={generate}
                        className="px-4 py-2 rounded-lg text-xs font-medium transition"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: '#8B93A7' }}>
                        🔄 Regenerate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <div className="max-w-5xl">
              <h1 className="text-2xl font-bold mb-1">AI Tools</h1>
              <p className="text-sm text-gray-500 mb-6">12+ specialized tools for every content need</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TOOLS.map(tool => (
                  <div key={tool.id}
                    className="p-5 rounded-xl cursor-pointer transition hover:-translate-y-1"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                    onClick={() => { setSelectedTool(tool.id); setActiveTab('generate') }}>
                    <div className="text-3xl mb-3">{tool.icon}</div>
                    <h3 className="font-semibold mb-1">{tool.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{tool.desc}</p>
                    <span className="text-xs font-medium" style={{ color: '#6F5FF6' }}>Open Tool →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="max-w-4xl">
              <h1 className="text-2xl font-bold mb-1">Content History</h1>
              <p className="text-sm text-gray-500 mb-6">{history.length} total generations</p>
              {history.length === 0 ? (
                <div className="text-center py-20 text-gray-600">
                  <span className="text-4xl block mb-4">📜</span>
                  <p>No content generated yet</p>
                  <p className="text-xs mt-1">Start creating to see your history here</p>
                </div>
              ) : (
                history.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl mb-3"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(111,95,246,0.12)', color: '#8B7DF8' }}>{item.tool}</span>
                      <span className="text-xs text-gray-600">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Topic: {item.topic}</p>
                    <div className="p-3 rounded-lg text-sm leading-relaxed max-h-32 overflow-hidden"
                      style={{ background: '#13161C', color: '#8B93A7', whiteSpace: 'pre-wrap' }}>
                      {item.output}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
