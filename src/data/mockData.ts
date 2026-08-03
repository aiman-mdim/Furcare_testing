import { Pet, VetDoctor, Product, AdoptionListing, GroomingService, PetHotel, LostAndFoundListing, PetFriendlyPlace } from "../types";

export const initialPets: Pet[] = [
  {
    id: "PET-101",
    owner_id: "USR-001",
    name: "Rocky",
    species: "dog",
    breed: "Golden Retriever",
    ageYears: 1,
    ageMonths: 8,
    color: "Golden Brown",
    weightKg: 24.5,
    gender: "male",
    photoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    allergies: ["Chicken skin"],
    microchipId: "BD-PET-99823",
    vaccinations: [
      {
        id: "VAC-1",
        vaccineName: "Rabies Vaccine",
        givenDate: "2025-10-15",
        nextDueDate: "2026-10-15",
        status: "completed",
        batchNumber: "RB-88219",
        veterinarian: "Dr. Ahmed Hossain",
        postVaccineTipsEn: [
          "Ensure 24 hours of rest after vaccination.",
          "Keep the injection site clean and dry.",
          "Mild sleepiness for 12-24 hours is normal."
        ],
        postVaccineTipsBn: [
          "টিকা দেয়ার পর ২৪ ঘন্টা বিশ্রামে রাখুন।",
          "ইনজেকশন দেয়ার স্থানটি পরিষ্কার ও শুষ্ক রাখুন।",
          "১২-২৪ ঘন্টা হালকা ঘুমানো স্বাভাবিক।"
        ]
      },
      {
        id: "VAC-2",
        vaccineName: "Distemper & Parvovirus (DHPP)",
        givenDate: "2026-01-10",
        nextDueDate: "2026-07-15",
        status: "upcoming",
        veterinarian: "Dr. Sharmin Akter",
        postVaccineTipsEn: ["Avoid intense physical training for 2 days."],
        postVaccineTipsBn: ["২ দিন ভারী খেলাধুলো বন্ধ রাখুন।"]
      }
    ],
    medicalHistory: [
      {
        id: "MED-1",
        date: "2026-02-14",
        title: "Annual Health Checkup & Deworming",
        description: "Healthy heart rate, optimal body condition score, administered Drontal deworming tablet.",
        doctorName: "Dr. Ahmed Hossain",
        type: "checkup"
      }
    ]
  },
  {
    id: "PET-102",
    owner_id: "USR-001",
    name: "Mimi",
    species: "cat",
    breed: "Persian Classic",
    ageYears: 2,
    ageMonths: 1,
    color: "Pure White",
    weightKg: 4.2,
    gender: "female",
    photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    allergies: ["Cow milk lactose"],
    microchipId: "BD-PET-77123",
    vaccinations: [
      {
        id: "VAC-3",
        vaccineName: "Feline Viral Rhinotracheitis (FVRCP)",
        givenDate: "2025-12-01",
        nextDueDate: "2026-12-01",
        status: "completed",
        veterinarian: "Dr. Nusrat Jahan",
        postVaccineTipsEn: ["Keep indoor temperature warm.", "Monitor appetite."],
        postVaccineTipsBn: ["ঘরের তাপমাত্রা স্বাভাবিক রাখুন।", "খাবারের আগ্রহ খেয়াল রাখুন।"]
      }
    ],
    medicalHistory: [
      {
        id: "MED-2",
        date: "2025-11-20",
        title: "Ears Cleaning & Flea Prevention",
        description: "Applied Revolution Plus flea prevention spot-on treatment.",
        doctorName: "Dr. Nusrat Jahan",
        type: "checkup"
      }
    ]
  },
  {
    id: "PET-103",
    owner_id: "USR-001",
    name: "Bunny",
    species: "rabbit",
    breed: "Holland Lop",
    ageYears: 0,
    ageMonths: 9,
    color: "White & Caramel",
    weightKg: 1.8,
    gender: "male",
    photoUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80",
    allergies: [],
    vaccinations: [
      {
        id: "VAC-4",
        vaccineName: "Rabbit Haemorrhagic Disease (RHDV2)",
        givenDate: "2026-03-01",
        nextDueDate: "2026-09-01",
        status: "completed",
        veterinarian: "Dr. Kazi Mahbub",
        postVaccineTipsEn: ["Provide fresh Timothy hay continuously."],
        postVaccineTipsBn: ["প্রচুর তাজা টিমোথি ঘাস খেতে দিন।"]
      }
    ],
    medicalHistory: []
  }
];

export const mockVets: VetDoctor[] = [
  {
    id: "VET-1",
    name: "Dr. Ahmed Hossain",
    qualification: "DVM (BAU), MS in Veterinary Surgery",
    specialty: "Canine & Feline Surgery & Orthopedics",
    clinicName: "Central Pet Hospital & Research Center",
    area: "Dhanmondi",
    city: "Dhaka",
    feeTk: 800,
    rating: 4.9,
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    availableTimes: ["10:00 AM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"],
    phone: "+8801711223344",
    experienceYears: 12
  },
  {
    id: "VET-2",
    name: "Dr. Sharmin Akter",
    qualification: "DVM, MS in Pet Medicine (CVASU)",
    specialty: "Cat Internal Medicine & Dermatology",
    clinicName: "Uttara Pet Care & Vaccination Hub",
    area: "Uttara",
    city: "Dhaka",
    feeTk: 700,
    rating: 4.8,
    photoUrl: "https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=800&q=80",
    availableTimes: ["11:00 AM", "03:00 PM", "05:00 PM", "07:00 PM"],
    phone: "+8801812998877",
    experienceYears: 8
  },
  {
    id: "VET-3",
    name: "Dr. Tanvir Rahman",
    qualification: "DVM, Specialist in Exotic Pets & Rabbits",
    specialty: "Rabbit & Small Mammal Healthcare",
    clinicName: "Chattogram Animal Welfare & Care",
    area: "Agrabad",
    city: "Chattogram",
    feeTk: 600,
    rating: 4.9,
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80",
    availableTimes: ["10:30 AM", "01:30 PM", "04:30 PM", "06:30 PM"],
    phone: "+8801911445566",
    experienceYears: 10
  }
];

export const mockAdoptionListings: AdoptionListing[] = [
  {
    pet_id: "ADOPT-1",
    owner_id: "USR-002",
    name: "Leo",
    species: "dog",
    breed: "Golden Retriever",
    color: "Golden Brown",
    behaviour: "friendly",
    ageMonths: 8,
    vaccinated: true,
    location: "GEC Circle",
    city: "Chattogram",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    descriptionEn: "Enthusiastic Golden Retriever pup, loves playing fetch in parks, fully house trained and vaccinated.",
    descriptionBn: "উৎসাহী গোল্ডেন রিট্রিভার ছানা, পার্কে বল খেলতে ভালোবাসে, সম্পূর্ণ বাসায় ট্রেইনড ও ভ্যাকসিন প্রাপ্ত।",
    status: "available",
    postedDate: "2026-07-28"
  },
  {
    pet_id: "ADOPT-2",
    owner_id: "USR-003",
    name: "Simba",
    species: "cat",
    breed: "Persian Longhair",
    color: "Cream White",
    behaviour: "calm",
    ageMonths: 12,
    vaccinated: true,
    location: "Banani",
    city: "Dhaka",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80",
    descriptionEn: "Gentle and calm Persian cat who loves lap cuddles and soft music. Perfect indoor companion.",
    descriptionBn: "শান্ত মেজাজের পার্সিয়ান বিড়াল, কোলে বসে আদর নিতে পছন্দ করে। ইনডোর অ্যাপার্টমেন্টের জন্য সেরা।",
    status: "available",
    postedDate: "2026-07-30"
  },
  {
    pet_id: "ADOPT-3",
    owner_id: "USR-004",
    name: "Snowball",
    species: "rabbit",
    breed: "Netherland Dwarf",
    color: "Pure White",
    behaviour: "playful",
    ageMonths: 6,
    vaccinated: true,
    location: "Zindabazar",
    city: "Sylhet",
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80",
    descriptionEn: "Cute little Netherland Dwarf rabbit, loves chewing fresh carrots and running around.",
    descriptionBn: "মিষ্টি ছোট খরগোশ, তাজা গাজর খেতে ও লাফালাফি করতে দারুণ পছন্দ করে।",
    status: "available",
    postedDate: "2026-08-01"
  },
  {
    pet_id: "ADOPT-4",
    owner_id: "USR-005",
    name: "Max",
    species: "dog",
    breed: "German Shepherd",
    color: "Black & Tan",
    behaviour: "energetic",
    ageMonths: 14,
    vaccinated: true,
    location: "Mirpur 10",
    city: "Dhaka",
    image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80",
    descriptionEn: "Loyal and intelligent German Shepherd, protective and energetic for active families.",
    descriptionBn: "বিশ্বস্ত ও বুদ্ধিমান জার্মান শেপার্ড, পাহারাদার ও অত্যন্ত কর্মঠ।",
    status: "available",
    postedDate: "2026-08-02"
  }
];

export const mockProducts: Product[] = [
  {
    product_id: "PRD-01",
    nameEn: "Royal Canin Golden Retriever Puppy Food (3kg)",
    nameBn: "রয়েল ক্যানিন গোল্ডেন রিট্রিভার পাপ্পি ফুড (৩ কেজি)",
    category: "food",
    targetSpecies: "dog",
    priceTk: 3450,
    originalPriceTk: 3800,
    rating: 4.9,
    reviewsCount: 128,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
    descriptionEn: "Tailored nutrition for Golden Retriever puppies up to 12 months. Enriched with Omega-3 and DHA.",
    descriptionBn: "গোল্ডেন রিট্রিভার পাপ্পির জন্য ওমেগা-৩ ও ডিএইচএ সমৃদ্ধ সুষম পুষ্টিকর খাবার।",
    stock: 25,
    weightGrams: 3000
  },
  {
    product_id: "PRD-02",
    nameEn: "Reflex Plus Adult Cat Food Salmon (1.5kg)",
    nameBn: "রিফ্লেক্স প্লাস অ্যাডাল্ট ক্যাট ফুড সালমন (১.৫ কেজি)",
    category: "food",
    targetSpecies: "cat",
    priceTk: 1650,
    originalPriceTk: 1850,
    rating: 4.8,
    reviewsCount: 210,
    image: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?auto=format&fit=crop&w=800&q=80",
    descriptionEn: "Premium salmon formulation for adult cats. Supports glossy coat and healthy urinary system.",
    descriptionBn: "বয়স্ক বিড়ালের স্বাস্থ্যকর লোম ও ইউরিনারি সিস্টেম ঠিক রাখার জন্য সালমন মাছের খাবার।",
    stock: 40,
    weightGrams: 1500
  },
  {
    product_id: "PRD-03",
    nameEn: "Oxbow Timothy Hay for Rabbits (1.1kg)",
    nameBn: "অক্সবো টিমোথি হে খরগোশের তাজা ঘাস (১.১ কেজি)",
    category: "food",
    targetSpecies: "rabbit",
    priceTk: 1200,
    originalPriceTk: 1350,
    rating: 5.0,
    reviewsCount: 84,
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80",
    descriptionEn: "High-fiber Timothy hay essential for rabbit digestion and dental health.",
    descriptionBn: "খরগোশের হজম প্রক্রিয়া ও দাঁতের সুরক্ষার জন্য হাই-ফাইবার তাজা ড্রাইড টিমোথি ঘাস।",
    stock: 18,
    weightGrams: 1100
  },
  {
    product_id: "PRD-04",
    nameEn: "Ergonomic Padded Leather Dog Harness & Leash Set",
    nameBn: "অ্যারগোনোমিক প্যাডেড লেদার ডগ হারনেস ও বেল্ট সেট",
    category: "accessories",
    targetSpecies: "dog",
    priceTk: 950,
    originalPriceTk: 1200,
    rating: 4.7,
    reviewsCount: 65,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    descriptionEn: "Durable non-pull harness with heavy-duty metal buckle and comfortable padded chest strap.",
    descriptionBn: "মজবুত ও আরামদায়ক প্যাডেড বুকের বেল্ট ও লিড রশি।",
    stock: 30
  },
  {
    product_id: "PRD-05",
    nameEn: "Interactive Multi-Level Cat Scratching Post Tree",
    nameBn: "মাল্টি-লেভেল ক্যাট স্ক্র্যাচিং পোস্ট ও প্লে ট্রি",
    category: "toys",
    targetSpecies: "cat",
    priceTk: 2850,
    originalPriceTk: 3200,
    rating: 4.9,
    reviewsCount: 92,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80",
    descriptionEn: "Sisal rope covered scratching post with cozy hammock and hanging ball toys.",
    descriptionBn: "বিড়ালের নখ ধার করা এবং খেলার জন্য সুন্দর মাল্টি-লেভেল স্ক্র্যাচিং পোস্ট।",
    stock: 12
  },
  {
    product_id: "PRD-06",
    nameEn: "Stainless Steel Pet Nail Clipper with LED Light",
    nameBn: "এলইডি লাইট সহ স্টেইনলেস স্টিল নখ কাটার ক্লিপার",
    category: "grooming",
    targetSpecies: "all",
    priceTk: 650,
    originalPriceTk: 800,
    rating: 4.6,
    reviewsCount: 140,
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
    descriptionEn: "Prevents clipping blood vessels with built-in precision LED guide light.",
    descriptionBn: "এলইডি লাইট দেখে নিরাপদে পোষা প্রাণীর নখ কাটার বিশেষ ক্লিপার।",
    stock: 50
  }
];

export const mockGroomingServices: GroomingService[] = [
  {
    id: "GRM-1",
    nameEn: "Medicated Flea & Tick Herbal Bath",
    nameBn: "মেডিকেটেড ফ্লি ও টিক হার্বাল গোসল",
    category: "flea_treatment",
    priceTk: 1200,
    durationMins: 45,
    descriptionEn: "Soothes irritated skin, eliminates fleas, ticks, and deep cleans fur with organic oils.",
    descriptionBn: "পোকা দূর করে ও প্রাকৃতিক ভেষজ শ্যাম্পু দিয়ে লোম পরিষ্কার ও সতেজ করে।",
    icon: "Bath",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "GRM-2",
    nameEn: "Full Styling Fur Cut & Blow Dry",
    nameBn: "ফুল স্টাইলিং লোম ছাঁটা ও ব্লো ড্রাই",
    category: "hair_cutting",
    priceTk: 1500,
    durationMins: 60,
    descriptionEn: "Breed-specific fur trimming, mat removal, ear cleaning and aromatic blow dry.",
    descriptionBn: "পছন্দসই স্টাইলে লোম ট্রিম, কান পরিষ্কার এবং সুগন্ধযুক্ত ব্লো ড্রাই।",
    icon: "Scissors",
    image: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "GRM-3",
    nameEn: "Paws & Precision Nail Trimming",
    nameBn: "প এর যত্ন ও নিখুঁত নখ কাটা",
    category: "nail_trimming",
    priceTk: 400,
    durationMins: 20,
    descriptionEn: "Gentle claw filing, edge smoothing and paw pad moisturization treatment.",
    descriptionBn: "নখ নিরাপদে কেটে স্মুথ করা এবং পায়ের থাবায় বিশেষ ময়েশ্চারাইজার প্রয়োগ।",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "GRM-4",
    nameEn: "Royal VIP Full Body Grooming Spa",
    nameBn: "রয়েল ভিআইপি ফুল বডি গ্রুমিং স্পা",
    category: "full_package",
    priceTk: 2500,
    durationMins: 90,
    descriptionEn: "Complete package: Bathing, Hair Trimming, Nail Clipping, Ear & Eye cleaning, perfume finish.",
    descriptionBn: "সম্পূর্ণ প্যাকেজ: গোসল, লোম ছাঁটা, নখ কাটা, চোখ-কান পরিষ্কার ও পারফিউম।",
    icon: "Crown",
    image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80"
  }
];

export const mockPetHotels: PetHotel[] = [
  {
    id: "HTL-1",
    name: "Happy Paws Resort & Boarding Hotel",
    location: "Gulshan 2",
    city: "Dhaka",
    dailyRateTk: 500,
    roomType: "AC Luxury Room",
    featuresEn: ["24/7 CCTV Live Monitoring Access", "Air Conditioned Quiet Environment", "3 Organic Meals Per Day", "Daily Playtime in Turf Garden"],
    featuresBn: ["২৪/৭ সিসিটিভি লাইভ মনিটরিং অ্যাক্সেস", "সম্পূর্ণ এয়ার কন্ডিশন্ড শান্ত পরিবেশ", "দৈনিক ৩ বার পুষ্টিকর খাবার", "ইনডোর খেলার মাঠ"],
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    availableRooms: 8,
    reviewsCount: 142
  },
  {
    id: "HTL-2",
    name: "FurHaven Deluxe Pet Suite",
    location: "Uttara Sector 7",
    city: "Dhaka",
    dailyRateTk: 800,
    roomType: "VIP Suite",
    featuresEn: ["Private Vet On-call 24 Hours", "Orthopedic Memory Foam Bed", "Individual Outdoor Playpen", "Grooming session included for 3+ days stay"],
    featuresBn: ["২৪ ঘন্টা সার্বক্ষণিক অন-কল ডাক্তার", "মেমোরি ফোম আরামদায়ক বেড", "আলাদা আউটডোর প্লেগ্রাউন্ড", "৩ দিনের বেশি থাকলে ফ্রি গ্রুমিং"],
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    availableRooms: 5,
    reviewsCount: 89
  },
  {
    id: "HTL-3",
    name: "Chattogram Pet Kingdom Hotel",
    location: "Khulshi",
    city: "Chattogram",
    dailyRateTk: 600,
    roomType: "Standard Room",
    featuresEn: ["Airy room with natural sunlight", "Fresh mineral water fountains", "Cat trees and scratching stations"],
    featuresBn: ["প্রাকৃতিক আলো বাতাস যুক্ত ঘর", "বিশুদ্ধ মিনারেল ওয়াটার", "বিড়ালের খেলার পোস্ট ও খেলনা"],
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    availableRooms: 12,
    reviewsCount: 65
  }
];

export const mockLostFound: LostAndFoundListing[] = [
  {
    id: "LF-01",
    type: "lost",
    petName: "Buddy",
    species: "dog",
    breed: "Golden Retriever",
    color: "Light Golden",
    eyeColor: "Dark Brown",
    faceStructure: "round",
    collarNeckband: "Red leather collar with bell",
    birthmarkOrFeature: "Black mark on right rear paw",
    lastWearCloth: "Blue winter jacket",
    lastLocation: "Dhanmondi Lake Road 8, Dhaka",
    contactPhone: "+8801700112233",
    contactName: "Rahim Chowdhury",
    photoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    status: "active",
    reportedDate: "2026-08-01"
  },
  {
    id: "LF-02",
    type: "found",
    petName: "Unknown Cat",
    species: "cat",
    breed: "Persian",
    color: "Pure White",
    eyeColor: "Blue",
    faceStructure: "flat",
    collarNeckband: "Pink ribbon collar",
    birthmarkOrFeature: "Very fluffy tail",
    lastLocation: "Uttara Sector 3 Park, Dhaka",
    contactPhone: "+8801822334455",
    contactName: "Sadia Sultana",
    photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    status: "active",
    reportedDate: "2026-08-02"
  }
];

export const mockPetPlaces: PetFriendlyPlace[] = [
  {
    id: "PLC-1",
    name: "Dhanmondi Lake Pet Walking Trail",
    type: "park",
    address: "Road 8A, Dhanmondi",
    city: "Dhaka",
    lat: 23.7461,
    lng: 90.3742,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
    openingHours: "06:00 AM - 09:00 PM"
  },
  {
    id: "PLC-2",
    name: "The Meow & Bark Pet Cafe",
    type: "cafe",
    address: "Banani Road 11, Block D",
    city: "Dhaka",
    lat: 23.7937,
    lng: 90.4047,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    openingHours: "11:00 AM - 10:30 PM"
  },
  {
    id: "PLC-3",
    name: "Central Veterinary Hospital 24/7",
    type: "clinic",
    address: "48 Kazi Nazrul Islam Ave",
    city: "Dhaka",
    lat: 23.7508,
    lng: 90.3924,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    openingHours: "Open 24 Hours"
  }
];
