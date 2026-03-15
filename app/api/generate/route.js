import { generateContent } from '@/lib/openai'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { topic, tool, tone, language } = body

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const result = await generateContent({
      topic: topic.trim(),
      tool: tool || 'facebook',
      tone: tone || 'motivational',
      language: language || 'roman-urdu',
    })

    return NextResponse.json({
      content: result.content,
      tokens: result.tokens,
      model: result.model,
    })
  } catch (error) {
    console.error('Generation API error:', error)
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    )
  }
}
