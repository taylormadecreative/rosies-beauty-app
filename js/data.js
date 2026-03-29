/* =====================================================
   ROSIE'S BEAUTY SPA — STATIC DATA
   Services catalog, treatments subset, user mock data,
   utility functions
   ===================================================== */

// ─── PocketSuite Deep Links ─────────────────────────
const POCKETSUITE_LINKS = {
  'New Clients':      'https://pocketsuite.io/book/rosies-beauty-spa/items/new-clients%2C-start-here',
  'Facials':          'https://pocketsuite.io/book/rosies-beauty-spa/items/returning-rosebuds',
  'Microneedling':    'https://pocketsuite.io/book/rosies-beauty-spa/items/microneedling-treatments',
  'Waxing':           'https://pocketsuite.io/book/rosies-beauty-spa/items/rosebud-waxing-and-intimate-skin-treatment',
  'Body Treatments':  'https://pocketsuite.io/book/rosies-beauty-spa/items/rosebud-body-peels-and-body-treatment',
  'Packages':         'https://pocketsuite.io/book/rosies-beauty-spa/items/rosebud-memberships-and-packages',
  'Gift Certificates':'https://pocketsuite.io/book/rosies-beauty-spa/items/gift-certificates',
};

// ─── Full Service Catalog ────────────────────────────
const SERVICES = [

  /* ── New Clients ─────────────────────────────────── */
  {
    id: 'new-rosebud-experience',
    category: 'New Clients',
    name: 'New Rosebud Experience + Consultation',
    duration: 90,
    price: 175,
    salePrice: 140,
    description: 'Comprehensive consultation plus a 60-min customized facial for first-time clients. 25% off your first visit.',
    bestFor: ['First visit', 'Skin assessment', 'Customized facial'],
    icon: 'ph-flower-lotus',
    image: 'assets/images/ashley-facial.jpg',
  },
  {
    id: 'virtual-skin-consultation',

    category: 'New Clients',
    name: '(Virtual) Skin Consultation',
    duration: 30,
    price: 50,
    description: 'Virtual skin analysis via FaceTime. Send 3 photos beforehand and come with clean skin.',
    bestFor: ['Remote clients', 'Skin assessment', 'New clients'],
    icon: 'ph-chat-circle-text',
    image: 'assets/images/ashley-portrait.jpg',
  },
  {
    id: 'new-client-brazilian',
    category: 'New Clients',
    name: 'New Client Brazilian Wax',
    duration: 35,
    price: 65,
    salePrice: 58.50,
    description: 'Brazilian wax for first-time wax clients at a discounted intro rate.',
    bestFor: ['First-time wax', 'New clients'],
    icon: 'ph-flower-tulip',
    image: 'assets/images/waxing.jpg',
  },
  {
    id: 'power-hour',
    category: 'New Clients',
    name: 'Power Hour (Pick My Brain)',
    duration: 60,
    price: 129,
    description: 'Business consultation for estheticians and spa owners. Available virtual or in-person.',
    bestFor: ['Estheticians', 'Spa owners', 'Business advice'],
    icon: 'ph-brain',
  },

  /* ── Facials (Returning Rosebuds) ────────────────── */
  {
    id: 'rosie-glow-facial',
    category: 'Facials',
    name: 'Rosie 60-min Glow Facial',
    duration: 75,
    price: 129,
    description: 'Customized facial with double cleanse, exfoliation, massage, and mask. Recommended every 4-6 weeks.',
    bestFor: ['Maintenance', 'Glow', 'Relaxation', 'All skin types'],
    icon: 'ph-sparkle',
    image: 'assets/images/facial-massage.jpg',
  },
  {
    id: 'corrective-renewal',
    category: 'Facials',
    name: 'Corrective Renewal Treatment',
    duration: 90,
    price: 189,
    description: 'Level 2 corrective treatment with extractions, chemical peel, LED, high frequency, and 2 enhancers included.',
    bestFor: ['Hyperpigmentation', 'Acne', 'Texture', 'Corrective'],
    icon: 'ph-shield-check',
    image: 'assets/images/ashley-facial.jpg',
  },
  {
    id: 'biweekly-acne',
    category: 'Facials',
    name: 'Bi-Weekly Acne Treatment',
    duration: 75,
    price: 99,
    description: 'For clients getting treatments every 2 weeks. Targets active breakouts and unclogs pores.',
    bestFor: ['Active acne', 'Breakouts', 'Congested pores'],
    icon: 'ph-repeat',
    image: 'assets/images/facial-massage.jpg',
  },
  {
    id: 'teen-acne-facial',
    category: 'Facials',
    name: 'Teen Acne Facial',
    duration: 60,
    price: 100,
    description: 'Ages 13-18. A 45-min facial targeted for teenage skin with breakouts.',
    bestFor: ['Teens', 'Acne', 'Young skin'],
    icon: 'ph-smiley',
    image: 'assets/images/facial-massage.jpg',
  },
  {
    id: 'acne-check-in',
    category: 'Facials',
    name: 'Acne Check-In',
    duration: 15,
    price: 25,
    description: 'Required follow-up call for acne clients. Send progress photos before your appointment.',
    bestFor: ['Acne follow-up', 'Progress check'],
    icon: 'ph-video-camera',
    image: 'assets/images/ashley-portrait.jpg',
  },
  {
    id: 'post-treatment-followup',
    category: 'Facials',
    name: 'Post Treatment Follow-Up Facial',
    duration: 60,
    price: 75,
    description: '7-10 days post-peel or microneedling. Polishes dead skin and promotes healing.',
    bestFor: ['Post-peel', 'Post-microneedling', 'Healing'],
    icon: 'ph-first-aid-kit',
    image: 'assets/images/led-treatment.jpg',
  },
  {
    id: 'rosebud-perfect-peel',
    category: 'Facials',
    name: 'Rosebud Perfect Peel',
    duration: 60,
    price: 279,
    description: 'Medium depth peel for all skin types. Stop retinol 7-10 days before your appointment.',
    bestFor: ['Dark spots', 'Hyperpigmentation', 'Resurfacing', 'All skin types'],
    icon: 'ph-drop-half-bottom',
    image: 'assets/images/ashley-facial.jpg',
  },
  {
    id: 'rosebud-perfect-peel-booster',
    category: 'Facials',
    name: 'Rosebud Perfect Peel + Booster',
    duration: 60,
    price: 329,
    description: 'Medium depth peel with an added booster for enhanced results. Stop retinol 7-10 days before.',
    bestFor: ['Dark spots', 'Hyperpigmentation', 'Enhanced results'],
    icon: 'ph-drop-half-bottom',
    image: 'assets/images/ashley-facial.jpg',
  },
  {
    id: 'dpn-skin-tag-60',
    category: 'Facials',
    name: 'DPN, Skin Tag & Milia Treatment (60min)',
    duration: 80,
    price: 300,
    description: 'Treats DPN, skin tags, and seborrheic keratosis. Numbing cream is applied for comfort.',
    bestFor: ['DPN', 'Skin tags', 'Milia', 'Seborrheic keratosis'],
    icon: 'ph-bandaids',
    image: 'assets/images/led-treatment.jpg',
  },
  {
    id: 'dpn-skin-tag-30',
    category: 'Facials',
    name: 'DPN & Skin Tag Treatment (30min)',
    duration: 60,
    price: 175,
    description: 'Shorter DPN and skin tag removal treatment for smaller areas.',
    bestFor: ['DPN', 'Skin tags'],
    icon: 'ph-bandaids',
    image: 'assets/images/led-treatment.jpg',
  },

  /* ── Microneedling ───────────────────────────────── */
  {
    id: 'skinpen-microneedling',
    category: 'Microneedling',
    name: 'SkinPen Microneedling',
    duration: 75,
    price: 299,
    description: 'FDA-approved SkinPen collagen therapy. Includes post-care home kit and a gift.',
    bestFor: ['Collagen boost', 'Acne scars', 'Fine lines', 'Texture'],
    icon: 'ph-needle',
    image: 'assets/images/microneedling.jpg',
  },
  {
    id: 'brightening-microneedling',
    category: 'Microneedling',
    name: 'Brightening Infusion Microneedling',
    duration: 75,
    price: 339,
    description: 'Microneedling with exosomes + PDRN to correct dark spots, melasma, and PIH. Includes LED therapy.',
    bestFor: ['Dark spots', 'Melasma', 'PIH', 'Brightening'],
    icon: 'ph-sun-dim',
    image: 'assets/images/microneedling.jpg',
  },
  {
    id: 'microneedling-peel',
    category: 'Microneedling',
    name: 'Microneedling + Chemical Peel',
    duration: 75,
    price: 450,
    description: 'Dual-action treatment combining microneedling with a chemical peel for deeper results.',
    bestFor: ['Deep scars', 'Resurfacing', 'Anti-aging', 'Maximum results'],
    icon: 'ph-lightning',
    image: 'assets/images/microneedling.jpg',
  },
  {
    id: 'microneedling-neck',
    category: 'Microneedling',
    name: 'Microneedling Neck Enhancer',
    duration: 15,
    price: 75,
    description: 'Add-on microneedling treatment for the neck area. Pair with any face microneedling service.',
    bestFor: ['Neck', 'Add-on', 'Anti-aging'],
    icon: 'ph-needle',
  },

  /* ── Waxing ──────────────────────────────────────── */
  {
    id: 'brazilian-wax',
    category: 'Waxing',
    name: 'Brazilian Wax',
    duration: 30,
    price: 65,
    description: 'Full Brazilian wax — front and back plus stomach strip.',
    bestFor: ['Brazilian', 'Full removal'],
    icon: 'ph-flower-tulip',
    image: 'assets/images/waxing.jpg',
  },
  {
    id: 'new-client-brazilian-wax',
    category: 'Waxing',
    name: 'New Client Brazilian Wax',
    duration: 35,
    price: 65,
    salePrice: 58.50,
    description: 'Brazilian wax for first-time wax clients at a discounted rate.',
    bestFor: ['First-time wax', 'New clients'],
    icon: 'ph-flower-tulip',
    image: 'assets/images/waxing.jpg',
  },
  {
    id: 'brazilian-mini-intimate',
    category: 'Waxing',
    name: 'Brazilian Wax + Mini Intimate Treatment',
    duration: 75,
    price: 129,
    description: 'Brazilian wax plus a post-wax calming treatment with jelly mask and serum.',
    bestFor: ['Brazilian', 'Skin treatment', 'Ingrown prevention'],
    icon: 'ph-flower-tulip',
    image: 'assets/images/waxing.jpg',
  },
  {
    id: 'extended-brazilian',
    category: 'Waxing',
    name: 'Extended Brazilian',
    duration: 45,
    price: 85,
    description: 'Full Brazilian plus butt strip, inner thighs, and tummy strip.',
    bestFor: ['Extended coverage', 'Full removal'],
    icon: 'ph-flower-tulip',
    image: 'assets/images/waxing.jpg',
  },
  {
    id: 'bikini-wax',
    category: 'Waxing',
    name: 'Bikini Wax',
    duration: 20,
    price: 35,
    description: 'Panty line area only.',
    bestFor: ['Bikini line', 'Quick wax'],
    icon: 'ph-flower',
  },
  {
    id: 'brazilian-underarm',
    category: 'Waxing',
    name: 'Brazilian Wax + Underarm',
    duration: 45,
    price: 80,
    description: 'Bundle deal — Brazilian wax and underarm wax together.',
    bestFor: ['Bundle', 'Brazilian', 'Underarms'],
    icon: 'ph-flower-tulip',
  },
  {
    id: 'underarm-wax',
    category: 'Waxing',
    name: 'Under Arm Wax',
    duration: 15,
    price: 25,
    description: 'Quick underarm wax for smooth, clean results.',
    bestFor: ['Underarms'],
    icon: 'ph-scissors',
  },
  {
    id: 'eyebrows-wax',
    category: 'Waxing',
    name: 'Eyebrows Wax',
    duration: 15,
    price: 21,
    description: 'Precise eyebrow wax and shaping.',
    bestFor: ['Brow shaping', 'Clean lines'],
    icon: 'ph-eye',
  },
  {
    id: 'lip-wax',
    category: 'Waxing',
    name: 'Lip Wax',
    duration: 15,
    price: 15,
    description: 'Quick upper lip wax.',
    bestFor: ['Upper lip'],
    icon: 'ph-smiley-wink',
  },
  {
    id: 'chin-wax',
    category: 'Waxing',
    name: 'Chin Wax',
    duration: 15,
    price: 25,
    description: 'Chin area wax for smooth skin.',
    bestFor: ['Chin'],
    icon: 'ph-smiley-wink',
  },
  {
    id: 'full-face-wax',
    category: 'Waxing',
    name: 'Full Face Wax',
    duration: 30,
    price: 61,
    description: 'Complete facial wax — chin, lips, eyebrows, lower jaw, and sideburns.',
    bestFor: ['Full face', 'Smooth finish'],
    icon: 'ph-user',
  },
  {
    id: 'half-stomach-wax',
    category: 'Waxing',
    name: 'Half Stomach Wax',
    duration: 30,
    price: 30,
    description: 'Waxing below the belly button.',
    bestFor: ['Stomach', 'Below navel'],
    icon: 'ph-scissors',
  },
  {
    id: 'lower-leg-wax',
    category: 'Waxing',
    name: 'Lower Leg Wax',
    duration: 30,
    price: 65,
    description: 'Lower leg wax from knee to ankle.',
    bestFor: ['Legs', 'Lower leg'],
    icon: 'ph-person',
  },
  {
    id: 'full-leg-wax',
    category: 'Waxing',
    name: 'Full Leg Wax',
    duration: 45,
    price: 120,
    description: 'Full leg wax — thighs to ankles.',
    bestFor: ['Legs', 'Full coverage'],
    icon: 'ph-person',
  },
  {
    id: 'vajacial',
    category: 'Waxing',
    name: 'Intimate Skin Treatment (Vajacial)',
    duration: 60,
    price: 100,
    description: 'Post-wax skin treatment for the bikini area. Cleanse, exfoliate, extractions, and jelly mask.',
    bestFor: ['Ingrown prevention', 'Post-wax care', 'Bikini area'],
    icon: 'ph-heart',
    image: 'assets/images/waxing.jpg',
  },

  /* ── Body Treatments ─────────────────────────────── */
  {
    id: 'body-brightening-peel',
    category: 'Body Treatments',
    name: 'Body Brightening Peel',
    duration: 60,
    price: 175,
    description: 'Professional body peel to even tone and brighten skin on the body. Great for knees, elbows, and underarms.',
    bestFor: ['Body brightening', 'Uneven tone', 'Hyperpigmentation'],
    icon: 'ph-person-arms-spread',
    image: 'assets/images/ashley-facial.jpg',
  },
  {
    id: 'back-facial',
    category: 'Body Treatments',
    name: 'Back Facial Treatment',
    duration: 60,
    price: 150,
    description: 'Deep cleanse, exfoliation, and treatment for back acne, congestion, and uneven texture.',
    bestFor: ['Back acne', 'Body skin', 'Deep cleanse'],
    icon: 'ph-person-arms-spread',
    image: 'assets/images/facial-massage.jpg',
  },

  /* ── Packages ────────────────────────────────────── */
  {
    id: 'memberships-packages',
    category: 'Packages',
    name: 'Memberships & Packages',
    duration: 0,
    price: 0,
    description: 'Save with monthly memberships and service packages. View all available options on our booking page.',
    bestFor: ['Savings', 'Membership', 'Bundles'],
    icon: 'ph-package',
  },

  /* ── Gift Certificates ───────────────────────────── */
  {
    id: 'gift-certificate',
    category: 'Gift Certificates',
    name: 'Gift Certificate',
    duration: 0,
    price: 0,
    description: 'Give the gift of glow. Purchase a gift certificate for any amount through our booking page.',
    bestFor: ['Gifts', 'Any occasion'],
    icon: 'ph-gift',
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
  ['new-rosebud-experience', 'rosie-glow-facial', 'corrective-renewal', 'skinpen-microneedling', 'brazilian-wax'].includes(s.id)
);

// ─── Mock User ────────────────────────────────────────
const MOCK_USER = {
  name: 'Keisha',
  glowPoints: 325,
  nextRewardAt: 500,
  visitStreak: 6,

  upcomingAppointment: {
    service: 'Rosie 60-min Glow Facial',
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

function getPocketSuiteLink(category) {
  return POCKETSUITE_LINKS[category] || 'https://pocketsuite.io/book/rosies-beauty-spa';
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}
