import { NextResponse } from 'next/server'
import { handleWebhookEvent, getStripe } from '@/lib/stripe'
import { updateUserProfile } from '@/lib/supabase'

export async function POST(request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const result = await handleWebhookEvent(event)

  // Update user plan in Supabase
  if (result.action === 'upgrade' && result.userId) {
    await updateUserProfile(result.userId, { plan: result.plan })
    console.log(`✅ Upgraded user ${result.userId} to ${result.plan}`)
  }

  return NextResponse.json({ received: true, result })
}
