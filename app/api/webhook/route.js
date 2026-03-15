import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { updateUserProfile } from '@/lib/supabase'

export async function POST(request) {
  if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  if (event.type === 'checkout.session.completed') {
    const s = event.data.object
    if (s.metadata?.userId) await updateUserProfile(s.metadata.userId, { plan: s.metadata.plan })
  }
  return NextResponse.json({ received: true })
}
