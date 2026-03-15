// ---------------------------------------------------------------------------
// Service Templates — suggested services by industry keyword
// ---------------------------------------------------------------------------

type ServicePricing = {
  price: number | null
  currency: string
  priceType: 'fixed' | 'starting_at' | 'varies' | 'free'
  depositRequired: boolean
  depositAmount: number | null
  paymentTiming: 'at_booking' | 'at_service' | 'deposit_then_remainder' | 'free'
}

type ServiceTemplate = {
  name: string
  duration_minutes: number
  description: string
  pricing: ServicePricing
}

const USD_NO_DEPOSIT = { currency: 'USD' as const, depositRequired: false, depositAmount: null }

export const SERVICE_TEMPLATES: Record<string, Array<ServiceTemplate>> = {
  'hair salon': [
    { name: 'Haircut', duration_minutes: 30, description: 'Professional haircut and styling', pricing: { price: 45, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Color', duration_minutes: 90, description: 'Full hair color treatment', pricing: { price: 120, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Blowout', duration_minutes: 45, description: 'Wash and blowdry styling', pricing: { price: 45, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Highlights', duration_minutes: 120, description: 'Partial or full highlights', pricing: { price: 150, ...USD_NO_DEPOSIT, priceType: 'starting_at', paymentTiming: 'at_service' } },
    { name: 'Trim', duration_minutes: 15, description: 'Quick trim and cleanup', pricing: { price: 20, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
  ],
  'barbershop': [
    { name: "Men's Haircut", duration_minutes: 30, description: 'Classic haircut with clippers and scissors', pricing: { price: 30, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Beard Trim', duration_minutes: 15, description: 'Beard shaping and trim', pricing: { price: 15, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Hot Towel Shave', duration_minutes: 30, description: 'Traditional straight razor shave', pricing: { price: 35, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Haircut & Beard', duration_minutes: 45, description: 'Full haircut plus beard grooming', pricing: { price: 40, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
  ],
  'dental': [
    { name: 'Cleaning', duration_minutes: 60, description: 'Professional teeth cleaning and oral exam', pricing: { price: 150, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Exam', duration_minutes: 30, description: 'Comprehensive dental examination', pricing: { price: 75, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Filling', duration_minutes: 45, description: 'Cavity filling procedure', pricing: { price: 200, ...USD_NO_DEPOSIT, priceType: 'starting_at', paymentTiming: 'at_service' } },
    { name: 'Whitening', duration_minutes: 60, description: 'Professional teeth whitening treatment', pricing: { price: 300, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
  ],
  'medical': [
    { name: 'General Consultation', duration_minutes: 30, description: 'Comprehensive health evaluation', pricing: { price: 150, ...USD_NO_DEPOSIT, priceType: 'starting_at', paymentTiming: 'at_service' } },
    { name: 'Follow-up Visit', duration_minutes: 15, description: 'Follow-up on previous treatment', pricing: { price: 75, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Physical Exam', duration_minutes: 60, description: 'Annual physical examination', pricing: { price: 250, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
  ],
  'yoga studio': [
    { name: 'Vinyasa Class', duration_minutes: 60, description: 'Dynamic flow yoga class', pricing: { price: 25, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_booking' } },
    { name: 'Hot Yoga', duration_minutes: 75, description: 'Heated yoga session', pricing: { price: 30, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_booking' } },
    { name: 'Beginner Flow', duration_minutes: 60, description: 'Introductory yoga for beginners', pricing: { price: 20, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_booking' } },
    { name: 'Private Session', duration_minutes: 60, description: 'One-on-one yoga instruction', pricing: { price: 80, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_booking' } },
  ],
  'dog grooming': [
    { name: 'Bath & Brush', duration_minutes: 45, description: 'Full bath with brushout', pricing: { price: 45, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Full Groom', duration_minutes: 90, description: 'Bath, haircut, nails, ears', pricing: { price: 75, ...USD_NO_DEPOSIT, priceType: 'starting_at', paymentTiming: 'at_service' } },
    { name: 'Nail Trim', duration_minutes: 15, description: 'Nail clipping and filing', pricing: { price: 15, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Puppy Groom', duration_minutes: 60, description: 'Gentle grooming for puppies', pricing: { price: 55, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
  ],
  'auto repair': [
    { name: 'Oil Change', duration_minutes: 30, description: 'Standard oil and filter change', pricing: { price: 50, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Tire Rotation', duration_minutes: 30, description: 'Rotate and balance tires', pricing: { price: 30, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Brake Inspection', duration_minutes: 45, description: 'Comprehensive brake system check', pricing: { price: 0, ...USD_NO_DEPOSIT, priceType: 'free', paymentTiming: 'free' } },
    { name: 'Full Service', duration_minutes: 120, description: 'Complete vehicle inspection and service', pricing: { price: null, ...USD_NO_DEPOSIT, priceType: 'varies', paymentTiming: 'at_service' } },
  ],
  'tattoo': [
    { name: 'Small Tattoo', duration_minutes: 60, description: 'Small design (palm-sized or smaller)', pricing: { price: 100, currency: 'USD', priceType: 'starting_at', depositRequired: true, depositAmount: 50, paymentTiming: 'deposit_then_remainder' } },
    { name: 'Medium Tattoo', duration_minutes: 120, description: 'Medium design session', pricing: { price: 250, currency: 'USD', priceType: 'starting_at', depositRequired: true, depositAmount: 100, paymentTiming: 'deposit_then_remainder' } },
    { name: 'Large Tattoo Session', duration_minutes: 180, description: 'Extended session for large work', pricing: { price: 500, currency: 'USD', priceType: 'starting_at', depositRequired: true, depositAmount: 200, paymentTiming: 'deposit_then_remainder' } },
    { name: 'Consultation', duration_minutes: 30, description: 'Design consultation and planning', pricing: { price: 0, ...USD_NO_DEPOSIT, priceType: 'free', paymentTiming: 'free' } },
  ],
  'spa': [
    { name: 'Swedish Massage', duration_minutes: 60, description: 'Relaxing full-body massage', pricing: { price: 90, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Deep Tissue Massage', duration_minutes: 60, description: 'Targeted pressure for muscle relief', pricing: { price: 110, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Facial', duration_minutes: 60, description: 'Rejuvenating facial treatment', pricing: { price: 85, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Couples Massage', duration_minutes: 60, description: 'Side-by-side massage for two', pricing: { price: 180, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_booking' } },
  ],
  'photography': [
    { name: 'Portrait Session', duration_minutes: 60, description: 'Individual or family portrait session', pricing: { price: 200, currency: 'USD', priceType: 'starting_at', depositRequired: true, depositAmount: 100, paymentTiming: 'deposit_then_remainder' } },
    { name: 'Headshot Session', duration_minutes: 30, description: 'Professional headshots', pricing: { price: 150, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_booking' } },
    { name: 'Event Coverage', duration_minutes: 240, description: 'Event photography coverage', pricing: { price: 500, currency: 'USD', priceType: 'starting_at', depositRequired: true, depositAmount: 250, paymentTiming: 'deposit_then_remainder' } },
  ],
  'tutoring': [
    { name: 'One-on-One Session', duration_minutes: 60, description: 'Private tutoring session', pricing: { price: 60, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Group Session', duration_minutes: 90, description: 'Small group tutoring (2-4 students)', pricing: { price: 40, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Test Prep', duration_minutes: 90, description: 'Standardized test preparation', pricing: { price: 75, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
  ],
  'legal': [
    { name: 'Initial Consultation', duration_minutes: 60, description: 'Review of legal matter and preliminary advice', pricing: { price: 250, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Document Review', duration_minutes: 30, description: 'Review and analysis of legal documents', pricing: { price: 150, ...USD_NO_DEPOSIT, priceType: 'starting_at', paymentTiming: 'at_service' } },
    { name: 'Follow-up Meeting', duration_minutes: 30, description: 'Follow-up on ongoing legal matter', pricing: { price: 125, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
  ],
  'financial': [
    { name: 'Financial Planning', duration_minutes: 60, description: 'Comprehensive financial planning session', pricing: { price: 200, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Tax Preparation', duration_minutes: 90, description: 'Personal or business tax preparation', pricing: { price: 250, ...USD_NO_DEPOSIT, priceType: 'starting_at', paymentTiming: 'at_service' } },
    { name: 'Investment Review', duration_minutes: 45, description: 'Portfolio review and recommendations', pricing: { price: 150, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
  ],
  'veterinary': [
    { name: 'Wellness Exam', duration_minutes: 30, description: 'Annual wellness examination', pricing: { price: 65, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Vaccination Visit', duration_minutes: 15, description: 'Routine vaccinations', pricing: { price: 35, ...USD_NO_DEPOSIT, priceType: 'starting_at', paymentTiming: 'at_service' } },
    { name: 'Sick Visit', duration_minutes: 45, description: 'Examination for illness or injury', pricing: { price: 85, ...USD_NO_DEPOSIT, priceType: 'starting_at', paymentTiming: 'at_service' } },
  ],
  'personal trainer': [
    { name: 'Personal Training', duration_minutes: 60, description: 'One-on-one training session', pricing: { price: 70, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Assessment', duration_minutes: 45, description: 'Fitness assessment and goal setting', pricing: { price: 50, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Small Group Training', duration_minutes: 60, description: 'Training session for 2-4 people', pricing: { price: 40, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
  ],
  'music teacher': [
    { name: 'Private Lesson', duration_minutes: 30, description: 'Individual music instruction', pricing: { price: 45, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Extended Lesson', duration_minutes: 60, description: 'In-depth private music lesson', pricing: { price: 75, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Trial Lesson', duration_minutes: 30, description: 'Introductory lesson for new students', pricing: { price: 25, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
  ],
  'therapy': [
    { name: 'Initial Assessment', duration_minutes: 60, description: 'Comprehensive intake and assessment', pricing: { price: 175, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Individual Session', duration_minutes: 50, description: 'Standard therapy session', pricing: { price: 150, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Couples Session', duration_minutes: 75, description: 'Therapy session for couples', pricing: { price: 200, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
  ],
  'consultant': [
    { name: 'Discovery Call', duration_minutes: 30, description: 'Initial consultation to discuss needs', pricing: { price: 0, ...USD_NO_DEPOSIT, priceType: 'free', paymentTiming: 'free' } },
    { name: 'Strategy Session', duration_minutes: 60, description: 'In-depth strategic consultation', pricing: { price: 200, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
    { name: 'Follow-up', duration_minutes: 30, description: 'Follow-up on implementation progress', pricing: { price: 100, ...USD_NO_DEPOSIT, priceType: 'fixed', paymentTiming: 'at_service' } },
  ],
}

export function findTemplateForIndustry(industry: string): Array<ServiceTemplate> | null {
  const normalized = industry.toLowerCase().trim()

  // Direct match
  if (SERVICE_TEMPLATES[normalized]) return SERVICE_TEMPLATES[normalized]

  // Partial match
  for (const [key, templates] of Object.entries(SERVICE_TEMPLATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return templates
    }
  }

  return null
}
