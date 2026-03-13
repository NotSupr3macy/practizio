export const PLANS = {
  starter: {
    name: 'Starter',
    price: 99,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
    features: [
      '1 location',
      'Basic availability & booking',
      'Listed in Practizio AI directory',
      'Standard MCP endpoint',
      'Email support',
    ],
  },
  professional: {
    name: 'Professional',
    price: 199,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
    popular: true,
    features: [
      'Up to 3 locations',
      'Insurance & services data',
      'Priority in AI agent responses',
      'Analytics dashboard',
      'Priority support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 499,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    features: [
      'Unlimited locations',
      'Custom MCP endpoint domain',
      'HIPAA BAA included',
      'White-glove onboarding',
      'API access',
      'Dedicated account manager',
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS
