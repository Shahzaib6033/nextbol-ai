import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY

let openai = null
if (apiKey && apiKey !== 'your_openai_api_key_here') {
  openai = new OpenAI({ apiKey })
}

// ═══════════════════════════════════════════════════
// AI PROMPT TEMPLATES — The secret sauce of NextBol
// ═══════════════════════════════════════════════════

const SYSTEM_PROMPT = `You are NextBol AI — an expert Urdu and Roman Urdu content writer.
You understand South Asian culture, Pakistani social media trends, Islamic values, and viral content patterns.
You always write natural, fluent, human-like content.
You NEVER do literal translations from English.
You know how Pakistani people actually talk and write online.
You use appropriate emojis for social media content.
Keep content culturally relevant and authentic.`

const TOOL_PROMPTS = {
  'youtube': `Write a viral YouTube script.
Structure:
- Strong hook (first 5 seconds)
- Story or explanation
- Key lesson or takeaway
- Call to action (like, subscribe, comment)
Make it engaging and keep viewers watching.`,

  'tiktok': `Write 5 viral TikTok/Reels captions.
Rules:
- Each caption should be 1-3 lines max
- Include trending hashtags
- Use emojis strategically
- Make them scroll-stopping
- Gen Z friendly tone`,

  'instagram': `Write an engaging Instagram caption.
Rules:
- Strong opening line (hook)
- Storytelling or value in the middle
- Call to action at the end
- Include 5-10 relevant hashtags
- Use emojis naturally`,

  'facebook': `Write a viral Facebook post.
Rules:
- Emotional or relatable opening
- Easy to read (short paragraphs)
- Encourage comments and shares
- Add emojis where appropriate
- End with a question or CTA`,

  'blog': `Write a 500-800 word SEO-optimized blog article.
Structure:
- Attention-grabbing title
- Introduction with hook
- 3-4 subheadings with content
- Conclusion with CTA
- Use simple, easy words
- Make it informative and engaging`,

  'islamic': `Write respectful Islamic content.
Rules:
- Use a soft, respectful tone
- Include relevant Quranic references or Hadith themes (not exact quotes unless certain)
- Avoid any controversial or sect-based content
- End with a positive reminder or dua
- Be motivational and uplifting`,

  'ad-copy': `Write compelling ad copy for Meta/Google Ads.
Structure:
- Headline (max 40 characters)
- Primary text (125 characters)
- Description (30 characters)
- Call to action
Create 3 variations with different angles.`,

  'converter': `Convert the given text between Urdu and Roman Urdu.
If the input is in Urdu script, convert to Roman Urdu.
If the input is in Roman Urdu, convert to Urdu script.
Use natural, commonly used Pakistani spellings.
Example: "زندگی" ↔ "Zindagi" (not "Zindagee")`,

  'hashtag': `Generate 20 viral hashtags related to the topic.
Rules:
- Mix of Urdu, Roman Urdu, and English hashtags
- Include trending and niche hashtags
- Mix popular (high volume) and specific (low competition)
- Format: #HashtagName`,

  'story': `Write an engaging short story in the requested language.
Rules:
- 300-500 words
- Strong opening
- Character development
- Emotional connection
- Satisfying ending
- Culturally relevant setting`,

  'motivational': `Write 5 powerful motivational quotes/posts.
Rules:
- Each should be 2-4 lines
- Deeply inspiring and relatable
- Mix of personal growth, success, and resilience themes
- Suitable for social media sharing
- Add relevant emojis`,

  'seo': `Write SEO-optimized content:
- Meta title (50-60 characters)
- Meta description (150-160 characters)
- 5 focus keywords
- 5 long-tail keywords
- Brief content outline with H2/H3 suggestions`,
}

const TONE_INSTRUCTIONS = {
  'professional': 'Use a professional, business-appropriate tone. Formal but accessible.',
  'emotional': 'Use an emotional, heartfelt tone. Touch the reader deeply.',
  'funny': 'Use a humorous, witty tone. Make the reader smile or laugh. Use Pakistani humor style.',
  'motivational': 'Use an inspiring, powerful tone. Fire up the reader to take action.',
  'islamic': 'Use a respectful, spiritual tone. Soft and wise.',
  'educational': 'Use a clear, teaching tone. Explain simply so everyone understands.',
}

const LANGUAGE_INSTRUCTIONS = {
  'urdu': 'Write ENTIRELY in Urdu script (نستعلیق). Do not use any Roman Urdu or English.',
  'roman-urdu': 'Write ENTIRELY in Roman Urdu using common Pakistani spellings. Example: "Zindagi mushkil hai" not "Zindagee mushkil hay". Do not use Urdu script.',
  'both': 'Write in BOTH Urdu script AND Roman Urdu. First write in Urdu, then provide the Roman Urdu version below it.',
}

// ═══════════════════════════════════════════════════
// MAIN GENERATION FUNCTION
// ═══════════════════════════════════════════════════

export async function generateContent({ topic, tool, tone, language }) {
  // If no API key, return demo content
  if (!openai) {
    return getDemoContent(topic, tool, language)
  }

  const toolPrompt = TOOL_PROMPTS[tool] || TOOL_PROMPTS['facebook']
  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS['professional']
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS['roman-urdu']

  const userPrompt = `
TASK: ${toolPrompt}

TOPIC: ${topic}

TONE: ${toneInstruction}

LANGUAGE: ${langInstruction}

IMPORTANT RULES:
- Sound natural and culturally relevant to Pakistani audience
- Use easy, commonly understood words
- Never include any English unless the user specifically asked for it
- If social media content, add appropriate emojis
- Output ONLY the final content, no explanations or meta-commentary
`

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
    console.error('OpenAI API error:', error)
    throw new Error(error.message || 'AI generation failed')
  }
}

// ═══════════════════════════════════════════════════
// DEMO CONTENT (when no API key)
// ═══════════════════════════════════════════════════

function getDemoContent(topic, tool, language) {
  const demos = {
    urdu: {
      default: `کامیابی اُن لوگوں کو ملتی ہے جو مشکل وقت میں بھی ہمت نہیں ہارتے۔ اگر آج آپ کی محنت نظر نہیں آ رہی تو فکر نہ کریں، کل یہی محنت آپ کی پہچان بنے گی۔

خود پر یقین رکھیں اور آگے بڑھتے رہیں۔ 💪✨

#محنت #کامیابی #حوصلہ #NextBolAI`,
      islamic: `نماز صرف ایک عبادت نہیں بلکہ سکون کا ذریعہ بھی ہے۔ جب انسان اللہ کے سامنے جھکتا ہے تو اس کا دل ہلکا ہو جاتا ہے۔

آج سے نماز کو اپنی زندگی کا سب سے خوبصورت حصہ بنائیں۔ 🤲

#اسلام #نماز #سکون`,
    },
    'roman-urdu': {
      default: `Zindagi un logon ko inaam deti hai jo kabhi haar nahi maante. Aaj ki mehnat kal ki kamyabi ban jati hai.

Bas apne khwab par yaqeen rakho aur chaltay raho. Success door nahi hai! 🔥

Topic: ${topic}

#Motivation #UrduQuotes #Success #NextBolAI`,
      youtube: `🎬 HOOK: Kya aap jaante hain ke ${topic} se aapki zindagi kaise badal sakti hai?

📖 STORY: Aaj main aapko bataunga ek aisi baat jo shayad aap pehli baar sun rahe honge...

${topic} ke baare mein soch kar dekho — kitne log hain jo is cheez ko samajh nahi paate.

💡 LESSON: Sab se bari baat ye hai ke aapko shuru karna hai. Bas pehla qadam uthao.

📢 CTA: Agar ye video helpful lagi to LIKE karo, SUBSCRIBE karo, aur comments mein batao aapka tajurba!

#YouTube #UrduContent #${topic.replace(/\s+/g, '')}`,
    },
    both: `کامیابی صرف خوابوں سے نہیں ملتی، محنت سے ملتی ہے۔
Kamyabi sirf khwabon se nahi milti, mehnat se milti hai.

${topic}

ہر دن ایک نیا موقع ہے — اسے ضائع مت کرو!
Har din ek naya mauka hai — grab it! 💪

#کامیابی #Mehnat #Motivation #NextBolAI`,
  }

  const langContent = demos[language] || demos['roman-urdu']
  const content = langContent[tool] || langContent.default

  return {
    content,
    tokens: 0,
    model: 'demo-mode',
  }
}

export default { generateContent }
