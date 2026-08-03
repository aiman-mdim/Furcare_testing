export type Language = "en" | "bn";

export type PetSpecies = "dog" | "cat" | "rabbit";

export type UserRole = "owner" | "vet" | "groomer" | "shelter";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "pet_owner" | "vet" | "groomer" | "admin" | UserRole;
  avatarUrl?: string;
  phone?: string;
  isPremium?: boolean;
  city?: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  title: string;
  description: string;
  doctorName: string;
  type: "vaccine" | "surgery" | "checkup" | "allergy";
}

export interface VaccineRecord {
  id: string;
  vaccineName: string;
  givenDate: string;
  nextDueDate: string;
  status: "completed" | "upcoming" | "overdue";
  batchNumber?: string;
  veterinarian: string;
  postVaccineTipsEn?: string[];
  postVaccineTipsBn?: string[];
}

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
  status: "scheduled" | "completed" | "cancelled";
  symptomProblem?: string;
  firstAidAdvice?: string[];
  feeTk: number;
  consultationType: "in_person" | "online_video";
}

export interface Product {
  product_id: string;
  nameEn: string;
  nameBn: string;
  category: "food" | "accessories" | "toys" | "grooming" | "healthcare";
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

export interface CartItem {
  product: Product;
  quantity: number;
  type?: "product" | "grooming_service" | "hotel_booking" | "premium_plan";
  customData?: Record<string, any>;
}

export interface AdoptionListing {
  pet_id: string;
  owner_id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  color: string;
  behaviour: "friendly" | "playful" | "calm" | "energetic" | "shy";
  ageMonths: number;
  vaccinated: boolean;
  location: string;
  city: string;
  image: string;
  descriptionEn: string;
  descriptionBn: string;
  status: "available" | "pending" | "adopted";
  postedDate: string;
}

export interface GroomingService {
  id: string;
  nameEn: string;
  nameBn: string;
  category: "bathing" | "nail_trimming" | "hair_cutting" | "flea_treatment" | "full_package";
  priceTk: number;
  durationMins: number;
  descriptionEn: string;
  descriptionBn: string;
  icon: string;
  image: string;
}

export interface PetHotel {
  id: string;
  name: string;
  location: string;
  city: string;
  dailyRateTk: number;
  roomType: "Standard Room" | "AC Luxury Room" | "VIP Suite";
  featuresEn: string[];
  featuresBn: string[];
  rating: number;
  image: string;
  availableRooms: number;
  reviewsCount: number;
}

export interface LostAndFoundListing {
  id: string;
  type: "lost" | "found";
  petName?: string;
  species: PetSpecies;
  breed: string;
  color: string;
  eyeColor: string;
  faceStructure: "round" | "long" | "pointed" | "flat";
  collarNeckband?: string;
  birthmarkOrFeature?: string;
  lastWearCloth?: string;
  lastLocation: string;
  contactPhone: string;
  contactName: string;
  photoUrl: string;
  status: "active" | "matched" | "resolved";
  reportedDate: string;
}

export interface PetFriendlyPlace {
  id: string;
  name: string;
  type: "park" | "clinic" | "cafe" | "grooming_center";
  address: string;
  city: string;
  lat: number;
  lng: number;
  rating: number;
  image: string;
  openingHours: string;
}
