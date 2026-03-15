'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { buildLearningContext, recordGeneration, recordFeedback, getLearningStats, clearLearningData } from '@/lib/learning'

const TOOLS = [
  { id: 'youtube-script', name: 'YouTube Script', cat: 'Content' },
  { id: 'blog-article', name: 'Blog Writer', cat: 'Content' },
  { id: 'story-writer', name: 'Story Generator', cat: 'Content' },
  { id: 'email-writer', name: 'Email Writer', cat: 'Content' },
  { id: 'tiktok-caption', name: 'TikTok Caption', cat: 'Social' },
  { id: 'instagram-caption', name: 'Instagram Caption', cat: 'Social' },
  { id: 'facebook-post', name: 'Facebook Post', cat: 'Social' },
  { id: 'tweet-thread', name: 'Twitter Thread', cat: 'Social' },
  { id: 'ad-copy', name: 'Ad Copy', cat: 'Marketing' },
  { id: 'product-description', name: 'Product Description', cat: 'Marketing' },
  { id: 'seo-meta', name: 'SEO Writer', cat: 'Marketing' },
  { id: 'hashtag-generator', name: 'Hashtag Generator', cat: 'Marketing' },
  { id: 'islamic-content', name: 'Islamic Content', cat: 'Special' },
  { id: 'motivational-quotes', name: 'Motivational Quotes', cat: 'Special' },
  { id: 'urdu-roman-converter', name: 'Script Converter', cat: 'Special' },
]

const TONES = ['professional', 'emotional', 'funny', 'motivational', 'islamic', 'educational', 'casual', 'formal']
const LANGUAGES = [
  { id: 'urdu', label: 'Urdu' },
  { id: 'roman-urdu', label: 'Roman Urdu' },
  { id: 'both', label: 'Urdu + Roman' },
  { id: 'english', label: 'English' },
]

export default function DashboardPage() {
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedTool, setSelectedTool] = useState('facebook-post')
  const [selectedTone, setSelectedTone] = useState('professional')
  const [selectedLang, setSelectedLang] = useState('roman-urdu')
  const [totalUsage, setTotalUsage] = useState(0)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [copied, setCopied] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showLearning, setShowLearning] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState(null)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [learningStats, setLearningStats] = useState(null)
  const chatEndRef = useRef(null)

  // Load chats from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nextbol-chats') || '[]')
      const usage = parseInt(localStorage.getItem('nextbol-usage') || '0')
      const lastReset = localStorage.getItem('nextbol-reset')
      const today = new Date().toDateString()
      if (lastReset !== today) {
        localStorage.setItem('nextbol-usage', '0')
        localStorage.setItem('nextbol-reset', today)
        setTotalUsage(0)
      } else {
        setTotalUsage(usage)
      }
      setChats(saved)
      if (saved.length > 0) {
        setActiveChat(saved[0].id)
        setMessages(saved[0].messages || [])
      }
    } catch(e) {}
  }, [])

  // Save chats to localStorage
  const saveChats = (updated) => {
    setChats(updated)
    try { localStorage.setItem('nextbol-chats', JSON.stringify(updated)) } catch(e) {}
  }

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const createNewChat = () => {
    const chat = { id: Date.now().toString(), title: 'New conversation', messages: [], tool: selectedTool, created: new Date().toISOString() }
    const updated = [chat, ...chats]
    saveChats(updated)
    setActiveChat(chat.id)
    setMessages([])
  }

  const switchChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId)
    if (chat) { setActiveChat(chatId); setMessages(chat.messages || []) }
  }

  const deleteChat = (chatId, e) => {
    e.stopPropagation()
    const updated = chats.filter(c => c.id !== chatId)
    saveChats(updated)
    if (activeChat === chatId) {
      if (updated.length > 0) { setActiveChat(updated[0].id); setMessages(updated[0].messages || []) }
      else { setActiveChat(null); setMessages([]) }
    }
  }

  const generate = async () => {
    if (!input.trim()) return
    if (totalUsage >= 5) { setShowSignupModal(true); return }

    const userMsg = { role: 'user', content: input, timestamp: new Date().toISOString() }
    const updatedMsgs = [...messages, userMsg]
    setMessages(updatedMsgs)
    setInput('')
    setLoading(true)

    try {
      // Build learning context from user's history
      const learningContext = buildLearningContext()

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: input, tool: selectedTool, tone: selectedTone, language: selectedLang, learningContext }),
      })
      const data = await res.json()
      const aiMsg = {
        role: 'assistant', content: data.content || data.error || 'Generation complete.',
        tool: TOOLS.find(t => t.id === selectedTool)?.name || selectedTool,
        toolId: selectedTool,
        tone: selectedTone, language: selectedLang,
        tokens: data.tokens, model: data.model, timestamp: new Date().toISOString(),
        feedback: null,
      }
      const finalMsgs = [...updatedMsgs, aiMsg]
      setMessages(finalMsgs)

      // Record this generation in the learning system
      recordGeneration({ tool: selectedTool, tone: selectedTone, language: selectedLang, topic: input })

      // Update usage
      const newUsage = totalUsage + 1
      setTotalUsage(newUsage)
      try { localStorage.setItem('nextbol-usage', newUsage.toString()) } catch(e) {}

      // Save to chat
      let chatTitle = input.length > 40 ? input.substring(0, 40) + '...' : input
      if (activeChat) {
        const updated = chats.map(c => c.id === activeChat ? { ...c, messages: finalMsgs, title: c.messages.length === 0 ? chatTitle : c.title } : c)
        saveChats(updated)
      } else {
        const newChat = { id: Date.now().toString(), title: chatTitle, messages: finalMsgs, tool: selectedTool, created: new Date().toISOString() }
        const updated = [newChat, ...chats]
        saveChats(updated)
        setActiveChat(newChat.id)
      }
    } catch (err) {
      const errMsg = { role: 'assistant', content: 'An error occurred. Please try again.', timestamp: new Date().toISOString() }
      setMessages([...updatedMsgs, errMsg])
    }
    setLoading(false)
  }

  // Handle user feedback on AI responses
  const handleFeedback = (msgIndex, rating) => {
    const msg = messages[msgIndex]
    if (!msg || msg.role !== 'assistant') return

    // Update message feedback state
    const updated = messages.map((m, i) => i === msgIndex ? { ...m, feedback: rating } : m)
    setMessages(updated)

    // Save to chat history
    if (activeChat) {
      const updatedChats = chats.map(c => c.id === activeChat ? { ...c, messages: updated } : c)
      saveChats(updatedChats)
    }

    if (rating === 'bad') {
      // Show comment box for negative feedback
      setFeedbackMsg(msgIndex)
    } else {
      // Record positive feedback immediately
      recordFeedback({
        rating: 'good',
        content: msg.content,
        tool: msg.toolId || msg.tool,
        tone: msg.tone,
        language: msg.language,
        topic: messages[msgIndex - 1]?.content || '',
      })
      setLearningStats(getLearningStats())
    }
  }

  const submitFeedbackComment = (msgIndex) => {
    const msg = messages[msgIndex]
    if (!msg) return
    recordFeedback({
      rating: 'bad',
      content: msg.content,
      tool: msg.toolId || msg.tool,
      tone: msg.tone,
      language: msg.language,
      topic: messages[msgIndex - 1]?.content || '',
      comment: feedbackComment,
    })
    setFeedbackMsg(null)
    setFeedbackComment('')
    setLearningStats(getLearningStats())
  }

  const copyContent = (text, idx) => {
    navigator.clipboard?.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'} flex-shrink-0 flex flex-col transition-all duration-300`} style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6F5FF6, #06B6D4)' }}>N</div>
            <span className="font-bold text-lg">NextBol<span style={{ color: '#6F5FF6' }}>.ai</span></span>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-3 pb-3">
          <button onClick={createNewChat} className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90" style={{ background: '#6F5FF6' }}>
            + New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-auto px-3">
          <div className="text-[10px] font-semibold text-gray-600 px-2 mb-2 uppercase tracking-wider">Chat History</div>
          {chats.length === 0 ? (
            <p className="text-xs text-gray-600 px-2">No conversations yet</p>
          ) : (
            chats.map(chat => (
              <div key={chat.id} onClick={() => switchChat(chat.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm mb-0.5 transition group ${activeChat === chat.id ? 'font-medium' : 'text-gray-400 hover:text-white'}`}
                style={{ background: activeChat === chat.id ? 'rgba(111,95,246,0.12)' : 'transparent', color: activeChat === chat.id ? '#8B7DF8' : undefined }}>
                <span className="truncate flex-1">{chat.title}</span>
                <button onClick={(e) => deleteChat(chat.id, e)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition ml-2 text-xs">x</button>
              </div>
            ))
          )}
        </div>

        {/* Usage + Links */}
        <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="mb-3 px-2">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-500">Daily Usage</span>
              <span className="text-gray-400">{totalUsage}/5</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#13161C' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((totalUsage / 5) * 100, 100)}%`, background: totalUsage >= 5 ? 'var(--red)' : 'var(--accent)' }} />
            </div>
            {totalUsage >= 4 && <p className="text-[10px] mt-1.5" style={{ color: totalUsage >= 5 ? 'var(--red)' : 'var(--yellow)' }}>{totalUsage >= 5 ? 'Limit reached. Sign up to continue.' : 'Almost at daily limit.'}</p>}
          </div>
          <Link href="/pricing" className="block px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white transition">Upgrade Plan</Link>
          <Link href="/" className="block px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white transition">Back to Home</Link>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 flex items-center px-4 gap-3 flex-shrink-0" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition text-lg">&#9776;</button>
          <div className="flex-1" />
          <button onClick={() => setShowSettings(!showSettings)} className="text-xs px-3 py-1.5 rounded-lg transition" style={{ background: showSettings ? 'rgba(111,95,246,0.15)' : '#13161C', border: '1px solid #1E2330', color: showSettings ? '#8B7DF8' : '#8B93A7' }}>
            Settings
          </button>
          <button onClick={() => { setShowLearning(!showLearning); setLearningStats(getLearningStats()) }} className="text-xs px-3 py-1.5 rounded-lg transition" style={{ background: showLearning ? 'rgba(34,197,94,0.15)' : '#13161C', border: '1px solid #1E2330', color: showLearning ? '#22C55E' : '#8B93A7' }}>
            AI Memory
          </button>
          <span className="text-xs text-gray-600 px-3 py-1.5 rounded-full" style={{ background: '#13161C' }}>{totalUsage}/5 today</span>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="px-6 py-4 flex gap-4 flex-wrap" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wider">Tool</label>
              <select className="px-3 py-2 rounded-lg text-sm outline-none appearance-none" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} value={selectedTool} onChange={e => setSelectedTool(e.target.value)}>
                {TOOLS.map(t => <option key={t.id} value={t.id}>[{t.cat}] {t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wider">Tone</label>
              <select className="px-3 py-2 rounded-lg text-sm outline-none appearance-none capitalize" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} value={selectedTone} onChange={e => setSelectedTone(e.target.value)}>
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wider">Language</label>
              <select className="px-3 py-2 rounded-lg text-sm outline-none appearance-none" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }} value={selectedLang} onChange={e => setSelectedLang(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* AI Memory/Learning Panel */}
        {showLearning && learningStats && (
          <div className="px-6 py-4" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">AI Learning Profile</h3>
              <button onClick={() => { clearLearningData(); setLearningStats(getLearningStats()) }} className="text-[10px] px-2 py-1 rounded text-gray-500 hover:text-red-400 transition" style={{ background: '#13161C' }}>Reset Memory</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="p-3 rounded-lg" style={{ background: '#13161C' }}>
                <div className="text-lg font-bold" style={{ color: '#6F5FF6' }}>{learningStats.totalInteractions}</div>
                <div className="text-[10px] text-gray-500">Interactions</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background: '#13161C' }}>
                <div className="text-lg font-bold" style={{ color: '#22C55E' }}>{learningStats.satisfactionRate}%</div>
                <div className="text-[10px] text-gray-500">Satisfaction</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background: '#13161C' }}>
                <div className="text-lg font-bold text-gray-300">{learningStats.favoriteTone || 'N/A'}</div>
                <div className="text-[10px] text-gray-500">Preferred Tone</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background: '#13161C' }}>
                <div className="text-lg font-bold text-gray-300">{learningStats.favoriteLanguage || 'N/A'}</div>
                <div className="text-[10px] text-gray-500">Preferred Language</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background: '#13161C' }}>
                <div className="text-lg font-bold" style={{ color: '#F59E0B' }}>{learningStats.successfulOutputs}</div>
                <div className="text-[10px] text-gray-500">Learned Examples</div>
              </div>
            </div>
            {learningStats.writingStyle && (
              <div className="mt-3 p-3 rounded-lg text-xs text-gray-400" style={{ background: '#13161C' }}>
                <span className="text-gray-500">Style note:</span> {learningStats.writingStyle}
              </div>
            )}
            {learningStats.commonTopics.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                <span className="text-[10px] text-gray-500">Common topics:</span>
                {learningStats.commonTopics.slice(0, 6).map((t, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(111,95,246,0.1)', color: '#8B7DF8' }}>{t.topic} ({t.count})</span>
                ))}
              </div>
            )}
            <p className="text-[9px] text-gray-600 mt-3">The AI uses your feedback and interaction history to personalize content. Rate outputs to improve future results.</p>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center pt-20">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center font-extrabold text-2xl" style={{ background: 'linear-gradient(135deg, #6F5FF6, #06B6D4)' }}>N</div>
                <h2 className="text-2xl font-bold mb-2">NextBol AI</h2>
                <p className="text-gray-500 mb-8">Select a tool, choose your settings, and start creating professional Urdu content.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
                  {['Write a viral Facebook post', 'YouTube script about success', 'Islamic reminder for Friday', 'TikTok captions for business', 'Blog about AI in Pakistan', 'Motivational quotes'].map((suggestion, i) => (
                    <button key={i} onClick={() => { setInput(suggestion); }} className="p-3 rounded-lg text-xs text-left text-gray-400 hover:text-white transition" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`mb-4 p-4 rounded-xl ${msg.role === 'user' ? 'chat-user' : 'chat-ai'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${msg.role === 'user' ? 'bg-gray-700' : ''}`}
                        style={msg.role === 'assistant' ? { background: 'linear-gradient(135deg, #6F5FF6, #06B6D4)' } : {}}>
                        {msg.role === 'user' ? 'U' : 'N'}
                      </div>
                      <span className="text-xs font-medium text-gray-400">{msg.role === 'user' ? 'You' : 'NextBol AI'}</span>
                      {msg.tool && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(111,95,246,0.1)', color: '#8B7DF8' }}>{msg.tool}</span>}
                    </div>
                    {msg.role === 'assistant' && (
                      <button onClick={() => copyContent(msg.content, i)} className="text-[10px] px-2.5 py-1 rounded text-gray-500 hover:text-white transition" style={{ background: '#13161C' }}>
                        {copied === i ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: msg.role === 'user' ? '#F0F2F5' : '#C0C5D4' }}>
                    {msg.content}
                  </div>
                  {msg.model && <div className="mt-2 text-[10px] text-gray-600">{msg.model} | {msg.tokens || 0} tokens</div>}
                  {msg.role === 'assistant' && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] text-gray-600 mr-1">Rate this response:</span>
                      <button onClick={() => handleFeedback(i, 'good')}
                        className={`px-2.5 py-1 rounded text-[10px] transition ${msg.feedback === 'good' ? 'font-semibold' : 'text-gray-500 hover:text-white'}`}
                        style={{ background: msg.feedback === 'good' ? 'rgba(34,197,94,0.15)' : '#13161C', color: msg.feedback === 'good' ? '#22C55E' : undefined, border: msg.feedback === 'good' ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent' }}>
                        Good
                      </button>
                      <button onClick={() => handleFeedback(i, 'bad')}
                        className={`px-2.5 py-1 rounded text-[10px] transition ${msg.feedback === 'bad' ? 'font-semibold' : 'text-gray-500 hover:text-white'}`}
                        style={{ background: msg.feedback === 'bad' ? 'rgba(239,68,68,0.15)' : '#13161C', color: msg.feedback === 'bad' ? '#EF4444' : undefined, border: msg.feedback === 'bad' ? '1px solid rgba(239,68,68,0.3)' : '1px solid transparent' }}>
                        Needs improvement
                      </button>
                      {msg.feedback && <span className="text-[10px] text-gray-600 ml-2">Thank you for your feedback</span>}
                    </div>
                  )}
                  {feedbackMsg === i && (
                    <div className="mt-2 flex gap-2">
                      <input className="flex-1 px-3 py-2 rounded-lg text-xs outline-none" style={{ background: '#13161C', border: '1px solid #1E2330', color: '#F0F2F5' }}
                        placeholder="What could be improved? (helps AI learn your preferences)" value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && submitFeedbackComment(i)} />
                      <button onClick={() => submitFeedbackComment(i)} className="px-3 py-2 rounded-lg text-[10px] font-medium text-white" style={{ background: '#6F5FF6' }}>Submit</button>
                      <button onClick={() => { setFeedbackMsg(null); setFeedbackComment('') }} className="px-3 py-2 rounded-lg text-[10px] text-gray-500" style={{ background: '#13161C' }}>Skip</button>
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="mb-4 p-4 rounded-xl chat-ai">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, #6F5FF6, #06B6D4)' }}>N</div>
                  <span className="text-xs font-medium text-gray-400">NextBol AI</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input className="flex-1 px-4 py-3.5 rounded-xl text-sm outline-none transition" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: '#F0F2F5' }}
              placeholder="Enter your topic or prompt..." value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generate() } }}
              disabled={loading} />
            <button onClick={generate} disabled={loading || !input.trim()} className="px-6 py-3.5 rounded-xl text-sm font-medium text-white transition disabled:opacity-50 hover:-translate-y-0.5"
              style={{ background: '#6F5FF6', boxShadow: '0 2px 12px rgba(111,95,246,0.3)' }}>
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-600 mt-2">NextBol AI may produce inaccurate content. Verify important information.</p>
        </div>
      </div>

      {/* Signup Modal — shows after 5 uses */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-2xl p-8 max-w-md w-[90%]" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-bold mb-2">Daily Limit Reached</h2>
            <p className="text-sm text-gray-400 mb-6">You have used all 5 free generations for today. Create an account to continue using NextBol AI, or upgrade for unlimited access.</p>
            <div className="flex gap-3">
              <Link href="/signup" className="flex-1 text-center py-3 rounded-lg text-sm font-medium text-white" style={{ background: '#6F5FF6' }}>Create Account</Link>
              <Link href="/login" className="flex-1 text-center py-3 rounded-lg text-sm font-medium text-gray-300" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>Log In</Link>
            </div>
            <button onClick={() => setShowSignupModal(false)} className="w-full text-center mt-3 text-xs text-gray-600 hover:text-gray-400 transition">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
