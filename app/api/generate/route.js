import { generateContent } from '@/lib/openai'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { topic, tool, tone, language, learningContext } = await request.json()
    if (!topic?.trim()) return NextResponse.json({ error: 'Topic is required' }, { status: 400 })

    const result = await generateContent({
      topic: topic.trim(),
      tool: tool || 'facebook-post',
      tone: tone || 'professional',
      language: language || 'roman-urdu',
      learningContext: learningContext || null,
    })

    return NextResponse.json({ content: result.content, tokens: result.tokens, model: result.model })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 })
  }
}
