import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nextbol.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'NextBol2026Secure!'
    const secret = process.env.ADMIN_SECRET || 'default-secret-change-this'

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Simple token: base64(email:timestamp:secret)
    const token = Buffer.from(`${email}:${Date.now()}:${secret}`).toString('base64')

    return NextResponse.json({ success: true, token, email: adminEmail })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
