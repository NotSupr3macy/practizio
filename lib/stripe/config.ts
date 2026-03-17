export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: '',
    bookingLimit: 10,
    features: [
      'Live AI booking link',
      'Up to 10 AI bookings/month',
      'Basic dashboard',
      'Listed in SpadeChat directory',
    ],
  },
  starter: {
    name: 'Starter',
    price: 49,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
    bookingLimit: 50,
    features: [
      'Up to 50 AI bookings/month',
      'Full dashboard with analytics',
      'Email notifications',
      'Priority health monitoring',
    ],
  },
  growth: {
    name: 'Growth',
    price: 149,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID || '',
    popular: true,
    bookingLimit: Infinity,
    features: [
      'Unlimited AI bookings',
      'Featured in directory',
      'Custom business rules',
      'Priority support',
      'Advanced analytics',
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS
