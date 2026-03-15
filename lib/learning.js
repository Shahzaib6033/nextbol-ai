// NextBol AI Learning System
// Stores user preferences, feedback, and successful outputs
// to improve future generations for each user

const STORAGE_KEY = 'nextbol-learning'

// Load learning data from localStorage
export function loadLearningData() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      preferences: data.preferences || {
        favoriteTone: null,
        favoriteLanguage: null,
        favoriteTools: [],
        writingStyle: null,
      },
      feedback: data.feedback || [],
      successfulOutputs: data.successfulOutputs || [],
      topicHistory: data.topicHistory || [],
      totalInteractions: data.totalInteractions || 0,
      lastUpdated: data.lastUpdated || null,
    }
  } catch (e) {
    return getDefaultData()
  }
}

function getDefaultData() {
  return {
    preferences: { favoriteTone: null, favoriteLanguage: null, favoriteTools: [], writingStyle: null },
    feedback: [], successfulOutputs: [], topicHistory: [], totalInteractions: 0, lastUpdated: null,
  }
}

// Save learning data
function saveLearningData(data) {
  try {
    data.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {}
}

// Record a generation event — tracks what the user creates
export function recordGeneration({ tool, tone, language, topic }) {
  const data = loadLearningData()
  data.totalInteractions += 1

  // Track topic history (last 50)
  data.topicHistory = [topic, ...data.topicHistory].slice(0, 50)

  // Track tool usage frequency
  const toolIndex = data.preferences.favoriteTools.findIndex(t => t.id === tool)
  if (toolIndex >= 0) {
    data.preferences.favoriteTools[toolIndex].count += 1
  } else {
    data.preferences.favoriteTools.push({ id: tool, count: 1 })
  }
  data.preferences.favoriteTools.sort((a, b) => b.count - a.count)

  // Auto-detect preferred tone and language (most used)
  const toneCount = {}
  const langCount = {}
  data.feedback.forEach(f => {
    if (f.rating === 'good') {
      toneCount[f.tone] = (toneCount[f.tone] || 0) + 1
      langCount[f.language] = (langCount[f.language] || 0) + 1
    }
  })
  // Also count current
  toneCount[tone] = (toneCount[tone] || 0) + 1
  langCount[language] = (langCount[language] || 0) + 1

  const topTone = Object.entries(toneCount).sort((a, b) => b[1] - a[1])[0]
  const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]
  if (topTone) data.preferences.favoriteTone = topTone[0]
  if (topLang) data.preferences.favoriteLanguage = topLang[0]

  saveLearningData(data)
  return data
}

// Record user feedback on a specific output
export function recordFeedback({ rating, content, tool, tone, language, topic, comment }) {
  const data = loadLearningData()

  const entry = {
    id: Date.now().toString(),
    rating, // 'good' or 'bad'
    tool, tone, language, topic,
    comment: comment || null,
    timestamp: new Date().toISOString(),
  }
  data.feedback = [entry, ...data.feedback].slice(0, 200)

  // If rated good, save as successful output for future context
  if (rating === 'good' && content) {
    data.successfulOutputs = [{
      content: content.substring(0, 500), // Store first 500 chars
      tool, tone, language, topic,
      timestamp: new Date().toISOString(),
    }, ...data.successfulOutputs].slice(0, 20) // Keep last 20
  }

  // If user provides a comment about style preference, save it
  if (comment) {
    data.preferences.writingStyle = comment
  }

  saveLearningData(data)
  return data
}

// Build a learning context string to include in AI prompts
// This is what makes the AI "learn" from the user
export function buildLearningContext() {
  const data = loadLearningData()
  const parts = []

  // Add user preferences
  if (data.preferences.favoriteTone) {
    parts.push(`User typically prefers ${data.preferences.favoriteTone} tone.`)
  }
  if (data.preferences.favoriteLanguage) {
    parts.push(`User usually writes in ${data.preferences.favoriteLanguage}.`)
  }
  if (data.preferences.writingStyle) {
    parts.push(`User's style preference: "${data.preferences.writingStyle}"`)
  }

  // Add most used tools
  const topTools = data.preferences.favoriteTools.slice(0, 3)
  if (topTools.length > 0) {
    parts.push(`User frequently uses: ${topTools.map(t => t.id).join(', ')}.`)
  }

  // Add recent successful output examples (up to 2)
  const goodExamples = data.successfulOutputs.slice(0, 2)
  if (goodExamples.length > 0) {
    parts.push('Examples of content the user rated positively:')
    goodExamples.forEach((ex, i) => {
      parts.push(`Example ${i + 1} (${ex.tool}, ${ex.tone}): "${ex.content.substring(0, 200)}..."`)
    })
  }

  // Add common topics
  const topicFreq = {}
  data.topicHistory.forEach(t => {
    const key = t.toLowerCase().trim()
    topicFreq[key] = (topicFreq[key] || 0) + 1
  })
  const commonTopics = Object.entries(topicFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic)
  if (commonTopics.length > 0) {
    parts.push(`User commonly writes about: ${commonTopics.join(', ')}.`)
  }

  // Add negative feedback patterns
  const badFeedback = data.feedback.filter(f => f.rating === 'bad' && f.comment)
  if (badFeedback.length > 0) {
    const recentBad = badFeedback.slice(0, 3)
    parts.push('User has given negative feedback about:')
    recentBad.forEach(f => {
      parts.push(`- "${f.comment}"`)
    })
    parts.push('Avoid these patterns in future outputs.')
  }

  if (parts.length === 0) return null

  return `USER LEARNING PROFILE (based on ${data.totalInteractions} interactions):\n${parts.join('\n')}`
}

// Get learning statistics for display
export function getLearningStats() {
  const data = loadLearningData()
  const goodCount = data.feedback.filter(f => f.rating === 'good').length
  const badCount = data.feedback.filter(f => f.rating === 'bad').length
  const total = goodCount + badCount

  return {
    totalInteractions: data.totalInteractions,
    totalFeedback: total,
    satisfactionRate: total > 0 ? Math.round((goodCount / total) * 100) : 0,
    goodCount,
    badCount,
    topTools: data.preferences.favoriteTools.slice(0, 5),
    favoriteTone: data.preferences.favoriteTone,
    favoriteLanguage: data.preferences.favoriteLanguage,
    writingStyle: data.preferences.writingStyle,
    commonTopics: getCommonTopics(data.topicHistory),
    successfulOutputs: data.successfulOutputs.length,
    lastUpdated: data.lastUpdated,
  }
}

function getCommonTopics(history) {
  const freq = {}
  history.forEach(t => {
    const key = t.toLowerCase().trim()
    freq[key] = (freq[key] || 0) + 1
  })
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }))
}

// Clear all learning data
export function clearLearningData() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {}
}
