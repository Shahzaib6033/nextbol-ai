import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

let stripe = null
if (stripeSecretKey && stripeSecretKey !== 'your_stripe_secret_key_here') {
  stripe = new Stripe(stripeSecretKey)
}

// Create a checkout session for plan upgrade
export async function createCheckoutSession({ userId, email, plan }) {
  if (!stripe) {
    return { url: null, error: 'Stripe not configured — add STRIPE_SECRET_KEY to .env.local' }
  }

  const priceId = plan === 'creator'
    ? process.env.STRIPE_PRICE_CREATOR
    : process.env.STRIPE_PRICE_AGENCY

  if (!priceId) {
    return { url: null, error: 'Stripe Price ID not configured' }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      metadata: { userId, plan },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    })

    return { url: session.url, error: null }
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return { url: null, error: error.message }
  }
}

// Handle webhook events from Stripe
export async function handleWebhookEvent(event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const userId = session.metadata?.userId
      const plan = session.metadata?.plan
      console.log(`✅ User ${userId} upgraded to ${plan}`)
      return { userId, plan, action: 'upgrade' }
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      console.log(`⬇️ Subscription canceled:`, subscription.id)
      return { subscriptionId: subscription.id, action: 'downgrade' }
    }

    default:
      return { action: 'ignored', type: event.type }
  }
}

// Get Stripe instance for direct use
export function getStripe() {
  return stripe
}

export default { createCheckoutSession, handleWebhookEvent, getStripe }
