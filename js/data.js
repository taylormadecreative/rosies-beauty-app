/* =====================================================
   ROSIE'S BEAUTY SPA — STATIC DATA
   Services catalog, treatments subset, user mock data,
   utility functions
   ===================================================== */

// ─── Full Service Catalog ────────────────────────────
const SERVICES = [
  // Facials
  {
    id: 'corrective-facial',
    category: 'Facials',
    name: 'Corrective Facial',
    duration: 60,
    price: 85,
    priceFrom: 85,
    benefit: 'Targets hyperpigmentation & uneven tone',
    description:
      'A customized facial targeting your specific skin concerns. Includes deep cleanse, exfoliation, extractions, targeted serums, and LED light therapy. Designed specifically for melanin-rich skin.',
    bestFor: ['Acne', 'Hyperpigmentation', 'Uneven texture', 'Congested pores'],
    prep: [
      'Avoid retinoids or acids 3 days before your appointment',
      'Come with a clean face — no heavy makeup',
      'Stay hydrated the day before',
      'Let us know about any recent treatments or medications',
    ],
    image: 'assets/images/treatment-corrective-facial.jpg',
    icon: 'ph-flower-lotus',
  },
  {
    id: 'express-facial',
    category: 'Facials',
    name: 'Express Glow Facial',
    duration: 30,
    price: 55,
    priceFrom: 55,
    benefit: 'Quick refresh for busy schedules',
    description:
      'A quick but effective facial for busy schedules. Deep cleanse, gentle exfoliation, hydrating mask, and moisturizer. Perfect for maintenance between full treatments.',
    bestFor: ['Maintenance', 'Quick refresh', 'Dry skin', 'Dullness'],
    prep: [
      'Come with a clean face — no heavy makeup',
      'Stay hydrated the day before',
    ],
    icon: 'ph-timer',
  },
  // Peels
  {
    id: 'chemical-peel',
    category: 'Peels',
    name: 'Chemical Peel',
    duration: 45,
    price: 120,
    priceFrom: 120,
    benefit: 'Resurfaces & fades dark spots fast',
    description:
      'Professional-strength exfoliation using carefully selected acids — lactic, mandelic, or TCA blends — to fade dark spots and resurface skin without triggering post-inflammatory hyperpigmentation in deeper skin tones.',
    bestFor: ['Dark spots', 'Hyperpigmentation', 'Sun damage', 'Fine lines'],
    prep: [
      'Stop using retinoids or exfoliants 5–7 days before',
      'Avoid sun exposure for 2 weeks prior',
      'Do not wax or thread the treatment area within 5 days',
      'Disclose all active skincare products at consultation',
    ],
    image: 'assets/images/treatment-chemical-peel.jpg',
    icon: 'ph-drop-half-bottom',
  },
  // Microneedling
  {
    id: 'microneedling',
    category: 'Microneedling',
    name: 'Microneedling',
    duration: 75,
    price: 200,
    priceFrom: 200,
    benefit: 'Builds collagen & smooths texture',
    description:
      'Controlled micro-channels trigger your skin\'s natural collagen and elastin production. Fades acne scars, smooths texture, and firms skin over a series of treatments.',
    bestFor: ['Acne scars', 'Fine lines', 'Skin laxity', 'Large pores'],
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
    id: 'microneedling-prp',
    category: 'Microneedling',
    name: 'Microneedling + PRP',
    duration: 90,
    price: 350,
    priceFrom: 350,
    benefit: 'Gold standard for scar revision & anti-aging',
    description:
      'Microneedling combined with Platelet-Rich Plasma from your own blood for accelerated healing and enhanced results. The gold standard for scar revision and anti-aging.',
    bestFor: ['Deep scars', 'Anti-aging', 'Skin rejuvenation', 'Collagen boost'],
    prep: [
      'Discontinue retinoids and vitamin C 3 days before',
      'Avoid blood-thinning supplements (fish oil, aspirin) for 3 days',
      'No active breakouts, rashes, or cold sores in the treatment area',
      'Arrive with clean, product-free skin',
      'Stay well-hydrated — we\'ll be drawing a small blood sample',
    ],
    icon: 'ph-sparkle',
  },
  // Brightening
  {
    id: 'brightening-treatment',
    category: 'Brightening',
    name: 'Brightening Treatment',
    duration: 60,
    price: 95,
    priceFrom: 95,
    benefit: 'Illuminates & evens melanin-rich skin',
    description:
      'Targeted treatment using vitamin C, niacinamide, and professional brightening agents to even out skin tone and restore your natural glow.',
    bestFor: ['Dull skin', 'Uneven tone', 'Post-inflammatory marks'],
    prep: [
      'Wear SPF 30+ daily for 2 weeks before your appointment',
      'Avoid harsh actives (AHAs, BHAs) 2 days prior',
      'Come with a freshly cleansed face',
      'Mention any recent sun exposure at check-in',
    ],
    image: 'assets/images/treatment-brightening.jpg',
    icon: 'ph-sun',
  },
  // Waxing
  {
    id: 'brow-wax',
    category: 'Waxing',
    name: 'Brow Wax & Shape',
    duration: 15,
    price: 25,
    priceFrom: 25,
    benefit: 'Clean, precise brow shaping',
    description:
      'Clean, precise brow shaping using gentle wax formulated for sensitive and melanin-rich skin. Includes soothing aftercare to prevent irritation.',
    bestFor: ['Brow shaping', 'Clean lines'],
    icon: 'ph-eye',
  },
  {
    id: 'full-face-wax',
    category: 'Waxing',
    name: 'Full Face Wax',
    duration: 30,
    price: 55,
    priceFrom: 55,
    benefit: 'Complete facial waxing for smooth skin',
    description:
      'Complete facial waxing — brows, upper lip, chin, and sides. Uses gentle formulas to minimize irritation on sensitive skin.',
    bestFor: ['Facial hair', 'Clean skin', 'Smooth finish'],
    icon: 'ph-smiley',
  },
  // Consultation
  {
    id: 'consultation',
    category: 'Consultation',
    name: 'Skin Consultation',
    duration: 30,
    price: 0,
    priceFrom: 0,
    benefit: 'One-on-one skin analysis with Ashley',
    description:
      'A one-on-one skin analysis with Ashley. We assess your skin type, concerns, history, and goals to build a personalized treatment plan. Free for new clients.',
    bestFor: ['New clients', 'Treatment planning', 'Skin assessment'],
    icon: 'ph-chat-circle-text',
  },
];

// ─── Service Helpers ─────────────────────────────────
function getServiceCategories() {
  return [...new Set(SERVICES.map((s) => s.category))];
}

function getServicesByCategory(category) {
  if (!category || category === 'All') return SERVICES;
  return SERVICES.filter((s) => s.category === category);
}

// ─── Treatments (Home screen subset) ─────────────────
// The 5 most popular services shown on the Home tab
const TREATMENTS = SERVICES.filter((s) =>
  ['corrective-facial', 'chemical-peel', 'microneedling', 'brightening-treatment', 'express-facial'].includes(s.id)
);

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
  return SERVICES.find((s) => s.id === id) || null;
}

function formatPrice(price) {
  if (price === 0) return 'Free';
  return `$${price}`;
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}
