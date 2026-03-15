import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY
let openai = null
if (apiKey && apiKey !== 'your_openai_api_key_here' && apiKey !== 'skip') {
  openai = new OpenAI({ apiKey })
}

const SYSTEM_PROMPT = `You are NextBol AI, an expert Urdu and Roman Urdu content writer.
You understand South Asian culture, Pakistani social media trends, and Islamic values.
You write natural, fluent, human-like content. Never do literal translations.
IMPORTANT: Never use emojis in your output. Keep the tone professional and polished.
Write clean, well-structured content without any emoji characters.`

const TOOL_PROMPTS = {
  'youtube-script': `Write a compelling YouTube script.\nStructure: Hook (first 5 seconds) > Main content > Key takeaway > Call to action.\nMake it engaging. No emojis.`,
  'tiktok-caption': `Write 5 viral TikTok/Reels captions.\nRules: 1-3 lines each, include hashtags, scroll-stopping, no emojis.`,
  'instagram-caption': `Write an engaging Instagram caption.\nStructure: Strong hook > Value/story > Call to action > 5-10 hashtags. No emojis.`,
  'facebook-post': `Write a viral Facebook post.\nRules: Relatable opening, short paragraphs, encourage engagement. No emojis.`,
  'blog-article': `Write a 500-800 word SEO blog article.\nStructure: Title > Introduction > 3-4 sections with subheadings > Conclusion. No emojis.`,
  'islamic-content': `Write respectful Islamic content.\nRules: Soft respectful tone, relevant references, avoid controversy, end with positive reminder. No emojis.`,
  'ad-copy': `Write ad copy for Meta/Google Ads.\nCreate 3 variations: Headline (40 chars) > Primary text (125 chars) > Description (30 chars) > CTA. No emojis.`,
  'urdu-roman-converter': `Convert between Urdu and Roman Urdu.\nIf input is Urdu script, convert to Roman Urdu. If Roman Urdu, convert to Urdu script. Use natural Pakistani spellings.`,
  'hashtag-generator': `Generate 20 viral hashtags.\nMix Urdu, Roman Urdu, and English. Include trending and niche tags. Format: #HashtagName. No emojis.`,
  'story-writer': `Write a short story (300-500 words).\nStrong opening, character development, emotional connection, satisfying ending. No emojis.`,
  'motivational-quotes': `Write 5 powerful motivational quotes.\n2-4 lines each, deeply inspiring, suitable for social media. No emojis.`,
  'seo-meta': `Write SEO content:\nMeta title (50-60 chars) > Meta description (150-160 chars) > 5 focus keywords > 5 long-tail keywords > Content outline. No emojis.`,
  'email-writer': `Write a professional email.\nClear subject line, proper greeting, concise body, professional closing. No emojis.`,
  'product-description': `Write a compelling product description.\n150-300 words, highlight benefits, create urgency, include key features. No emojis.`,
  'tweet-thread': `Write a Twitter/X thread (5-7 tweets).\nEach tweet under 280 chars, hook in first tweet, value throughout, CTA in last tweet. No emojis.`,
}

const TONE_INSTRUCTIONS = {
  'professional': 'Use a professional, business-appropriate tone. Formal but accessible.',
  'emotional': 'Use an emotional, heartfelt tone that resonates deeply with the reader.',
  'funny': 'Use a humorous, witty tone with Pakistani humor style.',
  'motivational': 'Use an inspiring, powerful tone that drives action.',
  'islamic': 'Use a respectful, spiritual tone. Soft and wise.',
  'educational': 'Use a clear, teaching tone. Explain simply for everyone.',
  'casual': 'Use a relaxed, conversational tone like talking to a friend.',
  'formal': 'Use a highly formal, authoritative tone suitable for official content.',
}

const LANGUAGE_INSTRUCTIONS = {
  'urdu': 'Write ENTIRELY in Urdu script. No Roman Urdu or English.',
  'roman-urdu': 'Write ENTIRELY in Roman Urdu with common Pakistani spellings. No Urdu script.',
  'both': 'Write in BOTH Urdu script AND Roman Urdu. First Urdu, then Roman Urdu version.',
  'english': 'Write in English but with South Asian cultural context.',
}

export async function generateContent({ topic, tool, tone, language, learningContext }) {
  if (!openai) return getDemoContent(topic, tool, language)

  const toolPrompt = TOOL_PROMPTS[tool] || TOOL_PROMPTS['facebook-post']
  const toneInst = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS['professional']
  const langInst = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS['roman-urdu']

  let learningSection = ''
  if (learningContext) {
    learningSection = `\n\n${learningContext}\n\nUse the above learning profile to tailor your output to this user's preferences. Match their preferred style, avoid patterns they disliked, and build on examples they rated positively.`
  }

  const userPrompt = `TASK: ${toolPrompt}\n\nTOPIC: ${topic}\n\nTONE: ${toneInst}\n\nLANGUAGE: ${langInst}${learningSection}\n\nRULES:\n- Natural and culturally relevant to Pakistani audience\n- Easy, commonly understood words\n- NEVER use any emojis or emoji characters\n- Professional, clean formatting\n- Output ONLY the final content`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 800,
      temperature: 0.8,
    })
    return {
      content: completion.choices[0].message.content,
      tokens: completion.usage?.total_tokens || 0,
      model: 'gpt-4o-mini',
    }
  } catch (error) {
    console.error('OpenAI error:', error)
    throw new Error(error.message || 'AI generation failed')
  }
}

function getDemoContent(topic, tool, language) {
  const demos = {
    urdu: `یہ ایک ڈیمو آؤٹ پٹ ہے۔ اصل AI مواد کے لیے اپنی OpenAI API کلید شامل کریں۔\n\nموضوع: ${topic}\n\nNextBol AI آپ کو اردو اور رومن اردو میں پیشہ ورانہ مواد بنانے میں مدد کرتا ہے۔ سوشل میڈیا پوسٹس سے لے کر یوٹیوب اسکرپٹس تک، ہمارا AI آپ کی زبان اور ثقافت کو سمجھتا ہے۔\n\nیہ ڈیمو موڈ ہے۔ حقیقی AI مواد کے لیے اپنی API کلید Vercel ماحولیاتی متغیرات میں شامل کریں۔`,
    'roman-urdu': `Yeh ek demo output hai. Asal AI content ke liye apni OpenAI API key shamil karein.\n\nTopic: ${topic}\n\nNextBol AI aapko Urdu aur Roman Urdu mein professional content banane mein madad karta hai. Social media posts se lekar YouTube scripts tak, hamara AI aapki zabaan aur saqafat ko samajhta hai.\n\nYeh demo mode hai. Real AI content ke liye apni API key Vercel environment variables mein add karein.`,
    both: `یہ ایک ڈیمو آؤٹ پٹ ہے۔\nYeh ek demo output hai.\n\nTopic: ${topic}\n\nNextBol AI aapko dono scripts mein content generate karne ki suvidha deta hai. API key add karein aur real AI content hasil karein.`,
    english: `This is a demo output. Add your OpenAI API key for real AI-generated content.\n\nTopic: ${topic}\n\nNextBol AI helps you create professional content in Urdu and Roman Urdu. From social media posts to YouTube scripts, our AI understands your language and culture.\n\nThis is demo mode. Add your API key in Vercel environment variables for real content.`,
  }
  return { content: demos[language] || demos['roman-urdu'], tokens: 0, model: 'demo-mode' }
}
