// ============================================================
// LANGUAGE
// ============================================================

export type Language = "en" | "bn";

// ============================================================
// PET SPECIES
// ============================================================

export type PetSpecies = "dog" | "cat" | "rabbit";

// ============================================================
// USER
// ============================================================

export type UserRole =
  | "pet_owner"
  | "vet"
  | "groomer"
  | "admin"
  | "owner"
  | "shelter";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  avatarUrl?: string;
  phone?: string;
  isPremium?: boolean;
  city?: string;
}

// ============================================================
// MEDICAL RECORD
// ============================================================

export interface MedicalRecord {
  id: string;
  date: string;
  title: string;
  description: string;
  doctorName: string;

  type:
    | "vaccine"
    | "surgery"
    | "checkup"
    | "allergy";
}

// ============================================================
// VACCINE RECORD
// ============================================================

export interface VaccineRecord {
  id: string;
  vaccineName: string;
  givenDate: string;
  nextDueDate: string;

  status:
    | "completed"
    | "upcoming"
    | "overdue";

  batchNumber?: string;

  veterinarian: string;

  postVaccineTipsEn?: string[];
  postVaccineTipsBn?: string[];
}

// ============================================================
// PET
// ============================================================

export interface Pet {
  id: string;
  owner_id: string;

  name: string;
  species: PetSpecies;
  breed: string;

  ageYears: number;
  ageMonths: number;

  color: string;
  weightKg: number;

  gender: "male" | "female";

  photoUrl: string;

  allergies: string[];

  vaccinations: VaccineRecord[];

  medicalHistory: MedicalRecord[];

  microchipId?: string;
}

// ============================================================
// NEW PET DATA
// Used when creating a pet.
// Backend creates id and owner_id.
// ============================================================

export type NewPetData = Omit<
  Pet,
  "id" | "owner_id"
>;

// ============================================================
// VETERINARIAN / DOCTOR
// ============================================================

export interface VetDoctor {
  id: string;

  name: string;
  qualification: string;
  specialty: string;

  clinicName: string;
  area: string;
  city: string;

  feeTk: number;
  rating: number;

  photoUrl: string;

  availableTimes: string[];

  phone: string;

  experienceYears: number;
}

// ============================================================
// APPOINTMENT
// ============================================================

export interface Appointment {
  id: string;

  pet_id: string;
  petName: string;

  vet_id: string;
  vetName: string;

  clinicName: string;
  area: string;

  date: string; // YYYY-MM-DD
  time: string; // HH:MM

  status:
    | "scheduled"
    | "completed"
    | "cancelled";

  symptomProblem?: string;

  firstAidAdvice?: string[];

  feeTk: number;

  consultationType:
    | "in_person"
    | "online_video";
}

// ============================================================
// PRODUCT
// ============================================================

export interface Product {
  product_id: string;

  nameEn: string;
  nameBn: string;

  category:
    | "food"
    | "accessories"
    | "toys"
    | "grooming"
    | "healthcare";

  targetSpecies: PetSpecies | "all";

  priceTk: number;

  originalPriceTk?: number;

  rating: number;
  reviewsCount: number;

  image: string;

  descriptionEn: string;
  descriptionBn: string;

  stock: number;

  weightGrams?: number;
}

// ============================================================
// CART
// ============================================================

export type CartItemType =
  | "product"
  | "grooming_service"
  | "hotel_booking"
  | "premium_plan"
  | "vet_appointment"
  | "adoption";

export interface CartItem {
  id: string;

  product: Product;

  quantity: number;

  type: CartItemType;

  customData?: Record<string, any>;
}

// ============================================================
// PAYMENT
// ============================================================

export type PaymentMethod =
  | "cash"
  | "visa"
  | "mastercard"
  | "american_express"
  | "bkash"
  | "none";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "not_required";

// ============================================================
// ORDER ITEM
// ============================================================

export interface OrderItem {
  itemId: string;

  productId: string;

  name: string;

  quantity: number;

  priceTk: number;

  type: CartItemType;

  customData?: Record<string, any>;
}

// ============================================================
// ORDER
// ============================================================

export interface Order {
  id: string;

  orderId: string;

  userId: string;

  items: OrderItem[];

  subtotal: number;

  deliveryFee: number;

  totalAmount: number;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "completed"
    | "cancelled";

  customerEmail?: string;

  customerPhone?: string;

  deliveryAddress?: string;

  createdAt: string;
}

// ============================================================
// ADOPTION
// ============================================================

export interface AdoptionListing {
  pet_id: string;

  owner_id: string;

  name: string;

  species: PetSpecies;

  breed: string;

  color: string;

  behaviour:
    | "friendly"
    | "playful"
    | "calm"
    | "energetic"
    | "shy";

  ageMonths: number;

  vaccinated: boolean;

  location: string;

  city: string;

  image: string;

  descriptionEn: string;

  descriptionBn: string;

  status:
    | "available"
    | "pending"
    | "adopted";

  postedDate: string;
}

// ============================================================
// GROOMING
// ============================================================

export interface GroomingService {
  id: string;

  nameEn: string;
  nameBn: string;

  category:
    | "bathing"
    | "nail_trimming"
    | "hair_cutting"
    | "flea_treatment"
    | "full_package";

  priceTk: number;

  durationMins: number;

  descriptionEn: string;
  descriptionBn: string;

  icon: string;

  image: string;
}

// ============================================================
// PET HOTEL
// ============================================================

export interface PetHotel {
  id: string;

  name: string;

  location: string;

  city: string;

  dailyRateTk: number;

  roomType:
    | "Standard Room"
    | "AC Luxury Room"
    | "VIP Suite";

  featuresEn: string[];

  featuresBn: string[];

  rating: number;

  image: string;

  availableRooms: number;

  reviewsCount: number;
}

// ============================================================
// LOST & FOUND
// ============================================================

export interface LostAndFoundListing {
  id: string;

  owner_id?: string;

  type: "lost" | "found";

  petName?: string;

  species: PetSpecies;

  breed: string;

  color: string;

  eyeColor: string;

  faceStructure:
    | "round"
    | "long"
    | "pointed"
    | "flat";

  collarNeckband?: string;

  birthmarkOrFeature?: string;

  lastWearCloth?: string;

  lastLocation: string;

  contactPhone: string;

  contactName: string;

  photoUrl: string;

  status:
    | "active"
    | "matched"
    | "resolved";

  reportedDate: string;

  imageFeatures?: {
    species?: string;

    breed?: string;

    color?: string;

    markings?: string[];

    facialFeatures?: string[];

    distinctiveFeatures?: string[];
  };

  aiMatches?: {
    listingId: string;

    confidence: number;

    reason: string;
  }[];
}

// ============================================================
// PET FRIENDLY PLACES
// ============================================================

export interface PetFriendlyPlace {
  id: string;

  name: string;

  type:
    | "park"
    | "clinic"
    | "cafe"
    | "grooming_center";

  address: string;

  city: string;

  lat: number;

  lng: number;

  rating: number;

  image: string;

  openingHours: string;
}