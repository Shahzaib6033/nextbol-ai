import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY
export const stripe = (key && key !== 'your_stripe_secret_key_here') ? new Stripe(key) : null

export async function createCheckoutSession({ userId, email, plan }) {
  if (!stripe) return { url: null, error: 'Stripe not configured' }
  const priceId = plan === 'creator' ? process.env.STRIPE_PRICE_CREATOR : process.env.STRIPE_PRICE_AGENCY
  if (!priceId) return { url: null, error: 'Price ID not configured' }
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', payment_method_types: ['card'],
      customer_email: email, metadata: { userId, plan },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    })
    return { url: session.url }
  } catch (error) {
    return { url: null, error: error.message }
  }
}
