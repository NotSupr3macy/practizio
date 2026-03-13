import Link from 'next/link'

const plans = [
  {
    name: 'STARTER',
    price: '99',
    features: [
      '5 MCP tool calls/day',
      'Basic practice listing',
      'Email support',
      '1 provider profile',
    ],
    cta: 'START_FREE_TRIAL',
    buttonStyle: 'btn-pill',
  },
  {
    name: 'PROFESSIONAL',
    price: '199',
    popular: true,
    features: [
      'Unlimited MCP tool calls',
      'Priority AI directory listing',
      'Appointment booking',
      'Analytics dashboard',
      '5 provider profiles',
    ],
    cta: 'GET_STARTED',
    buttonStyle: 'btn-solid',
  },
  {
    name: 'ENTERPRISE',
    price: '499',
    features: [
      'Everything in Professional',
      'Custom MCP tools',
      'Dedicated support',
      'Unlimited providers',
      'API access',
      'White-label option',
    ],
    cta: 'CONTACT_SALES',
    buttonStyle: 'btn-accent',
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="hairline-t py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="mono-label-sm opacity-40 mb-4 block">PRICING_TIERS</span>
          <h2 className="font-display font-black uppercase text-5xl md:text-6xl tracking-tightest">
            CHOOSE YOUR PLAN
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`flex flex-col h-full p-8 md:p-12 ${
                index < plans.length - 1 ? 'hairline-r' : ''
              }`}
            >
              <div className="flex-1">
                {plan.popular && (
                  <span className="mono-label-sm bg-white text-black px-3 py-1 inline-block mb-4">
                    POPULAR
                  </span>
                )}

                <span className="mono-label opacity-60 block mb-6">{plan.name}</span>

                <div className="mb-8">
                  <span className="font-display font-black text-6xl tracking-tightest">
                    ${plan.price}
                  </span>
                  <span className="mono-label-sm opacity-40 ml-1">/MO</span>
                </div>

                <ul className="space-y-3 mb-12">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <span className="font-mono text-accent mr-2">+</span>
                      <span className="font-sans text-sm font-light leading-relaxed opacity-60">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/signup" className={plan.buttonStyle}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
