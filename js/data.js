/* =====================================================
   ROSIE'S BEAUTY SPA — STATIC DATA
   Treatments, user mock data, utility functions
   ===================================================== */

// ─── Treatments ───────────────────────────────────────
const TREATMENTS = [
  {
    id: 'corrective-facial',
    name: 'Corrective Facial',
    duration: 60,
    priceFrom: 95,
    benefit: 'Targets hyperpigmentation & uneven tone',
    description:
      'A customized facial designed specifically for melanin-rich skin. Our estheticians analyze your unique concerns — from post-inflammatory hyperpigmentation to dryness — and build a targeted protocol using clinical-grade actives. Results are visible after the first session.',
    bestFor: ['Hyperpigmentation', 'Uneven skin tone', 'Dullness', 'Dry skin', 'Sensitive skin'],
    prep: [
      'Avoid retinoids or acids 3 days before your appointment',
      'Come with a clean face — no heavy makeup',
      'Stay hydrated the day before',
      'Let us know about any recent treatments or medications',
    ],
    image: 'assets/images/treatment-corrective-facial.jpg',
    icon: 'ph-sparkle',
  },
  {
    id: 'chemical-peel',
    name: 'Chemical Peel',
    duration: 45,
    priceFrom: 120,
    benefit: 'Resurfaces & fades dark spots fast',
    description:
      'Our melanin-safe chemical peels use carefully selected acids — lactic, mandelic, or TCA blends — chosen to resurface without triggering post-inflammatory hyperpigmentation in deeper skin tones. Expect brighter, smoother skin within 5–7 days of peeling.',
    bestFor: ['Dark spots', 'Post-acne marks', 'Rough texture', 'Fine lines', 'Uneven complexion'],
    prep: [
      'Stop using retinoids or exfoliants 5–7 days before',
      'Avoid sun exposure for 2 weeks prior',
      'Do not wax or thread the treatment area within 5 days',
      'Disclose all active skincare products at consultation',
    ],
    image: 'assets/images/treatment-chemical-peel.jpg',
    icon: 'ph-drop',
  },
  {
    id: 'microneedling',
    name: 'Microneedling',
    duration: 75,
    priceFrom: 175,
    benefit: 'Builds collagen & smooths texture',
    description:
      'Precision microneedling creates controlled micro-channels to stimulate your skin\'s natural collagen and elastin production. For melanin-rich skin, we use conservative depths and pair with brightening serums to maximize results while minimizing the risk of post-treatment hyperpigmentation.',
    bestFor: ['Acne scars', 'Large pores', 'Loss of firmness', 'Stretch marks', 'Uneven texture'],
    prep: [
      'Discontinue retinoids and vitamin C 3 days before',
      'Avoid blood-thinning supplements (fish oil, aspirin) for 3 days',
      'No active breakouts, rashes, or cold sores in the treatment area',
      'Arrive with clean, product-free skin',
    ],
    image: 'assets/images/treatment-microneedling.jpg',
    icon: 'ph-needle',
  },
  {
    id: 'brightening-treatment',
    name: 'Brightening Treatment',
    duration: 50,
    priceFrom: 85,
    benefit: 'Illuminates & evens melanin-rich skin',
    description:
      'A targeted brightening protocol combining vitamin C, niacinamide, and kojic acid to inhibit excess melanin production and restore your natural radiance. Safe for all skin tones, this treatment is our most popular service for clients dealing with persistent dark spots and dull complexion.',
    bestFor: ['Melasma', 'Sun damage', 'Dark spots', 'Dull complexion', 'Discoloration'],
    prep: [
      'Wear SPF 30+ daily for 2 weeks before your appointment',
      'Avoid harsh actives (AHAs, BHAs) 2 days prior',
      'Come with a freshly cleansed face',
      'Mention any recent sun exposure at check-in',
    ],
    image: 'assets/images/treatment-brightening.jpg',
    icon: 'ph-sun',
  },
  {
    id: 'anti-aging-facial',
    name: 'Anti-Aging Facial',
    duration: 70,
    priceFrom: 110,
    benefit: 'Lifts, firms & restores youthful glow',
    description:
      'A luxurious anti-aging protocol formulated for melanin-rich skin that needs lifting and firming without irritation. This service combines peptide-rich serums, facial massage techniques, and LED light therapy to visibly reduce fine lines and restore a plump, luminous appearance.',
    bestFor: ['Fine lines', 'Loss of firmness', 'Sagging skin', 'Dehydration', 'Lack of radiance'],
    prep: [
      'Arrive well-hydrated — drink extra water the day before',
      'Avoid heavy exercise the day of your appointment',
      'Remove all eye makeup before arriving',
      'Share any heart conditions or pacemakers before LED treatment',
    ],
    image: 'assets/images/treatment-anti-aging.jpg',
    icon: 'ph-leaf',
  },
];

// ─── Mock User ────────────────────────────────────────
const MOCK_USER = {
  name: 'Keisha',
  glowPoints: 325,
  nextRewardAt: 500,
  visitStreak: 6,

  upcomingAppointment: {
    service: 'Corrective Facial',
    date: 'Thursday, April 3',
    time: '2:30 PM',
    daysUntil: 6,
  },

  recommendedProduct: {
    name: 'Melanu Brightening Serum',
    price: 42,
    description: 'Vitamin C + niacinamide serum for melanin-rich skin.',
    image: 'assets/images/product-brightening-serum.jpg',
  },
};

// ─── Utility Functions ────────────────────────────────
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTreatmentById(id) {
  return TREATMENTS.find((t) => t.id === id) || null;
}

function formatPrice(price) {
  return `$${price}`;
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}
