export const mockVeterinarians = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    role: "Senior Veterinary Surgeon",
    specialization: "Canine Orthopedics & General Surgery",
    clinic: "Oakwood Animal Hospital",
    experience: "12 years",
    rating: 4.9,
    reviews: 184,
    fee: 65,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    virtual: true,
    inPerson: true,
    slots: ["Today, 04:30 PM", "Tomorrow, 10:00 AM", "Tomorrow, 02:15 PM"],
    bio: "Passionate about pain-free surgical recovery and proactive joint health for aging dogs."
  },
  {
    id: 2,
    name: "Dr. Marcus Vance",
    role: "Feline Medicine Specialist",
    specialization: "Feline Internal Medicine & Dermatology",
    clinic: "Purrfect Care Cat Clinic",
    experience: "9 years",
    rating: 4.95,
    reviews: 210,
    fee: 70,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    virtual: true,
    inPerson: false,
    slots: ["Today, 06:00 PM", "Tomorrow, 11:30 AM", "Friday, 03:00 PM"],
    bio: "Specializing in low-stress cat examinations, renal diet strategies, and allergy resolution."
  },
  {
    id: 3,
    name: "Dr. Elena Rostova",
    role: "Avian & Exotic Animal Vet",
    specialization: "Avian & Exotic Pets Care",
    clinic: "Metro Exotic Vet Center",
    experience: "8 years",
    rating: 4.88,
    reviews: 95,
    fee: 55,
    avatar: "https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&q=80&w=400",
    virtual: true,
    inPerson: true,
    slots: ["Tomorrow, 09:00 AM", "Tomorrow, 04:00 PM", "Saturday, 11:00 AM"],
    bio: "Expert care for parrots, reptiles, rabbits, and small pocket pets with tailored diagnostics."
  },
  {
    id: 4,
    name: "Dr. David Chen",
    role: "Veterinary Cardiologist",
    specialization: "Cardiology & Emergency Critical Care",
    clinic: "Apex 24/7 Pet Emergency",
    experience: "15 years",
    rating: 4.98,
    reviews: 320,
    fee: 85,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
    virtual: false,
    inPerson: true,
    slots: ["Today, 05:00 PM", "Friday, 10:30 AM"],
    bio: "Certified veterinary cardiologist focused on early detection of heart murmurs and cardiac failure."
  }
];

export const mockProducts = [
  {
    id: 1,
    name: "NexGard Spectra Chews (Large Dogs 30-60kg)",
    category: "flea_tick",
    categoryName: "Flea & Tick",
    price: 48.50,
    discountPrice: 42.00,
    brand: "Boehringer Ingelheim",
    requiresPrescription: true,
    rating: 4.9,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
    dosage: "1 chew monthly with meal",
    description: "Rapidly kills fleas, ticks, and controls heartworm and intestinal worms in a single chew."
  },
  {
    id: 2,
    name: "Cosequin Maximum Strength Joint Support Plus MSM",
    category: "supplements",
    categoryName: "Supplements",
    price: 36.99,
    discountPrice: null,
    brand: "Nutramax Laboratories",
    requiresPrescription: false,
    rating: 4.8,
    reviews: 620,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400",
    dosage: "Initial 4-6 weeks: 2 tablets daily; Maintenance: 1 tablet daily",
    description: "Glucosamine and Chondroitin formula to maintain cartilage structure and mobility."
  },
  {
    id: 3,
    name: "Apoquel 16mg Tablets (Allergy Relief)",
    category: "dermatology",
    categoryName: "Dermatology",
    price: 74.00,
    discountPrice: 68.50,
    brand: "Zoetis",
    requiresPrescription: true,
    rating: 4.95,
    reviews: 288,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400",
    dosage: "Twice daily for up to 14 days, then once daily",
    description: "Targeted relief from allergic and atopic dermatitis itching within 4 hours."
  },
  {
    id: 4,
    name: "Proviable-DC Digestive Health Probiotic Caps",
    category: "digestive",
    categoryName: "Digestive Care",
    price: 24.50,
    discountPrice: null,
    brand: "Nutramax",
    requiresPrescription: false,
    rating: 4.7,
    reviews: 194,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400",
    dosage: "1 capsule daily directly or sprinkled on food",
    description: "Multi-strain probiotic containing 5 billion CFUs to restore intestinal balance."
  },
  {
    id: 5,
    name: "Clavamox Drops 15ml (Amoxicillin Suspension)",
    category: "antibiotics",
    categoryName: "Antibiotics",
    price: 31.00,
    discountPrice: 28.00,
    brand: "Zoetis",
    requiresPrescription: true,
    rating: 4.85,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400",
    dosage: "Administer 6.25mg/lb body weight twice daily for 7 days",
    description: "Broad-spectrum antibacterial medication for skin and soft tissue infections in dogs and cats."
  },
  {
    id: 6,
    name: "Optixcare Eye Lube Plus Hyaluron",
    category: "eye_ear",
    categoryName: "Eye & Ear Care",
    price: 19.99,
    discountPrice: null,
    brand: "Aventix",
    requiresPrescription: false,
    rating: 4.9,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=400",
    dosage: "Instill 1 to 2 drops into affected eyes 2-3 times daily",
    description: "Long-lasting sterile ocular lubricant providing corneal hydration and soothing dry eyes."
  }
];

export const mockPosts = [
  {
    id: 101,
    author: "Elena Vasquez",
    authorRole: "Pet Parent",
    petName: "Barnaby",
    petBreed: "Golden Retriever • 3 yrs",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    title: "Barnaby is 8 weeks post-TPLO surgery and back on the grass!",
    content: "When our vet diagnosed Barnaby with a torn cranial cruciate ligament, we were terrified. Two months of strict crate rest, hydrotherapy sessions, and joint supplements later, Dr. Jenkins cleared him for short leash walks! Never lose hope if your pup is undergoing orthopedic recovery.",
    tag: "Recovery Journey",
    likes: 47,
    liked: false,
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800",
    timestamp: "2 hours ago",
    comments: [
      { id: 1, user: "Marcus Vance", text: "Incredible milestone! Make sure to keep the cold compress routine post-walk." },
      { id: 2, user: "Chloe M.", text: "Such inspiring news! My lab is having TPLO next month." }
    ]
  },
  {
    id: 102,
    author: "David Kim",
    authorRole: "Cat Rescuer",
    petName: "Mochi",
    petBreed: "British Shorthair • 1.5 yrs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    title: "How we conquered chronic feline food allergies",
    content: "Mochi spent 6 months scratching her neck raw. After an elimination diet supervised by our telehealth vet and switching to novel rabbit protein with omega-3 drops, her coat has completely grown back silky soft!",
    tag: "Diet & Nutrition",
    likes: 35,
    liked: true,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
    timestamp: "5 hours ago",
    comments: [
      { id: 3, user: "Dr. Marcus Vance", text: "Novel proteins work wonders. Delighted to see Mochi's barrier restored!" }
    ]
  },
  {
    id: 103,
    author: "Sarah Taylor",
    authorRole: "Agility Trainer",
    petName: "Zephyr",
    petBreed: "Border Collie • 4 yrs",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    title: "Top 3 mental enrichment games for high-energy working breeds",
    content: "Physical exercise alone doesn't tire out a working dog. Here is our daily routine: 1. Snuffle mat forage 2. Scent distinction games 3. Place training during household chores. Calmer mind, happier pup!",
    tag: "Behavior & Training",
    likes: 62,
    liked: false,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800",
    timestamp: "Yesterday",
    comments: [
      { id: 4, user: "Sam R.", text: "The snuffle mat saved our sanity on rainy days!" }
    ]
  }
];

export const mockPetProfiles = [
  {
    id: 1,
    name: "Milo",
    species: "Dog",
    breed: "Golden Retriever",
    age: "3 years",
    weight: "31.5 kg",
    chipId: "985-1410-0921-A",
    avatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300",
    allergies: "Chicken protein (mild)",
    records: [
      { id: 1, type: "Vaccination", title: "DHPP & Rabies Booster", date: "2026-08-15", vet: "Dr. Sarah Jenkins", status: "Active" },
      { id: 2, type: "Checkup", title: "Annual Dental & Heart Screening", date: "2026-05-10", vet: "Dr. David Chen", status: "Completed" },
      { id: 3, type: "Medication", title: "NexGard Spectra 6-Month Course", date: "2026-09-01", vet: "Dr. Sarah Jenkins", status: "Ongoing" }
    ]
  },
  {
    id: 2,
    name: "Luna",
    species: "Cat",
    breed: "Siamese / Lynx Point",
    age: "2 years",
    weight: "4.2 kg",
    chipId: "985-8821-4412-B",
    avatar: "https://images.unsplash.com/photo-1513360309081-38f076278f1e?auto=format&fit=crop&q=80&w=300",
    allergies: "None reported",
    records: [
      { id: 4, type: "Vaccination", title: "FVRCP Core Vaccine", date: "2026-07-22", vet: "Dr. Marcus Vance", status: "Active" },
      { id: 5, type: "General", title: "Wellness Microchip Verification", date: "2026-02-14", vet: "Dr. Marcus Vance", status: "Completed" }
    ]
  }
];
