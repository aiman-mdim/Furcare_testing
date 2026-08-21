import { Language } from "../types";

export const translations = {
  en: {
    // Header & Brand
    brandName: "FurCare",
    tagline: "Smart Pet Healthcare & Services Platform",
    navHome: "Home",
    navAdoption: "Pet Adoption",
    navVet: "Vet Appointment",
    navGrooming: "Grooming",
    navHotel: "Pet Hotel",
    navStore: "Pet Store",
    navVaccine: "Vaccines",
    navLostFound: "Lost & Found",
    navPremium: "Extra Premium",
    navCart: "Cart",
    navDashboard: "My Dashboard",
    loginSignup: "Login / Signup",
    logout: "Logout",
    welcome: "Welcome",

    // Hero & Home
    heroTitle: "Smart Care & Healthcare for Your Beloved Pets",
    heroSubtitle: "Book verified vets, adopt matched pets, order supermart food, track vaccination passports, and access 24/7 AI emergency care in Bangladesh.",
    bookVetNow: "Book Vet Appointment",
    exploreAdoption: "Explore Pet Adoption",
    exploreShop: "Shop Food & Accessories",

    // Categories
    servicesTitle: "Complete Pet Care Ecosystem",
    servicesSubtitle: "Select a service category below to view details, book appointments, or shop online.",
    catAdoptionTitle: "Pet Adoption",
    catAdoptionDesc: "Swipe & match pets with Tinder-style preference survey in Bangladesh.",
    catVetTitle: "Vet Appointment System",
    catVetDesc: "Find top veterinarians, get 1-hr appointment reminders & AI first-aid tips.",
    catGroomingTitle: "Grooming Services",
    catGroomingDesc: "Bathing, hair cutting, nail trimming & Flea treatments at home or center.",
    catHotelTitle: "Pet House / Boarding",
    catHotelDesc: "Book AC rooms, 24/7 monitoring, daily rates starting at ৳500/day.",
    catStoreTitle: "Pet Food & Accessories Store",
    catStoreDesc: "Supermarket online shopping with quantity controls, instant cart & fast delivery.",
    catVaccineTitle: "Digital Health & Vaccine Passport",
    catVaccineDesc: "Track vaccine history (Rabies, Distemper) with real-time due alerts.",
    catLostFoundTitle: "Lost & Found AI Detection",
    catLostFoundDesc: "Upload photos & facial/color features to AI match lost pets in Bangladesh.",
    catPremiumTitle: "Extra Premium Features",
    catPremiumDesc: "Pet walking, 24/7 Emergency Vet, Breed matching & Pet-friendly spots map for ৳500.",

    // AI Assistant
    aiAssistantTitle: "FurCare AI Doctor & Companion",
    aiAssistantSubtitle: "Ask about pet nutrition, symptoms, training, or emergency first aid",
    aiVoiceMode: "Voice Guide",
    aiTextMessage: "Type message...",
    aiSend: "Send",
    aiListening: "Listening... speak now",

    // Adoption Page
    adoptionHeader: "Find Your Perfect Pet Companion",
    adoptionFilterBreed: "All Breeds",
    adoptionFilterColor: "All Colors",
    adoptionFilterBehavior: "Behavior",
    adoptionFilterAge: "Age Group",
    swipeRightToAdopt: "Swipe Right to Adopt",
    swipeLeftToPass: "Swipe Left to Skip",
    matchedPetTitle: "Survey Matched Pet IDs",
    adoptNowBtn: "Approve Adoption Request",
    adoptedSuccess: "Adoption request submitted successfully! Owner will contact you.",
    locationLabel: "Location",
    vaccinatedYes: "Vaccinated: Yes",
    vaccinatedNo: "Vaccinated: No",

    // Vet Appointment Page
    vetPageTitle: "Veterinary Appointment & Consultation System",
    vetSearchPlaceholder: "Search by vet name, specialty or location (e.g. Dhaka, Chattogram, Uttara)...",
    searchBtn: "Search Vets",
    selectPetLabel: "Select Pet",
    selectTimeSlot: "Select Available Slot",
    symptomLabel: "Pet Symptom / Health Concern",
    getAiFirstAid: "Get AI First-Aid Advice First",
    aiFirstAidTitle: "AI Suggested First-Aid Guidance",
    confirmBooking: "Confirm Booking (৳",
    reminderNotice: "⏰ Real-time Reminder Enabled: You will receive a notification 1 hour prior to appointment.",
    prescriptionHistoryTitle: "Prescription & Medical History",

    // Grooming Page
    groomingTitle: "Professional Pet Grooming Services",
    groomingSub: "Select grooming center or request premium home grooming service directly to your doorstep.",
    centerGrooming: "Grooming Center",
    homeGrooming: "Doorstep Home Grooming",
    addToCartBtn: "Add to Cart",

    // Pet Hotel Page
    hotelTitle: "Pet Hotel & Boarding Facilities",
    hotelSub: "Safe, air-conditioned rooms, 24/7 CCTV monitoring and healthy meals while you travel.",
    bookHotelRoom: "Book Room & Pay Advance",
    perDay: "day",

    // Pet Store Page
    storeTitle: "Pet Supermarket & Accessories Store",
    allProducts: "All Products",
    foodCategory: "Food & Nutrition",
    accessoriesCategory: "Accessories & Leashes",
    toysCategory: "Toys & Activity",
    groomingCategory: "Grooming Supplies",
    healthCategory: "Health & Pharma",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    qty: "Qty",

    // Vaccination Passport Page
    passportTitle: "Pet Digital Health & Vaccine Passport",
    upcomingVaccines: "Upcoming Vaccine Reminders",
    vaccineHistory: "Vaccination History",
    nextDue: "Next Due Date",
    postVaccineTips: "Post-Vaccination Care Tips",
    bookVaccineAppt: "Book Vaccine Appointment",

    // Lost & Found Page
    lostFoundTitle: "Lost & Found Pets with AI Feature Detection",
    lostFoundSub: "File a missing pet report or post a found pet. Our AI detects color, face structure, eye color, neckband & birthmarks.",
    reportLostPet: "File Lost Pet FIR Report",
    reportFoundPet: "Report Found Pet",
    aiMatchingBtn: "Run AI Detect & Match Analysis",
    aiMatchResult: "AI Feature Detection Result",

    // Premium Page
    premiumTitle: "FurCare Extra Premium Membership",
    premiumSub: "Unlock elite home grooming, 24/7 Emergency Vet Hotline, Dog Walking, Breed Matchmaker & Pet-friendly spots interactive map.",
    premiumPrice: "৳500 / month",
    premiumBenefits: [
      "Dog & Cat Walking Service on demand",
      "24/7 Emergency Vet Call & Ambulance dispatch",
      "Genetic Breed Matching & Compatibility",
      "Interactive Map of Pet Parks, Vet Clinics & Pet Cafes in Bangladesh",
      "Flat 15% discount on Pet Store & Hotels"
    ],
    subscribePremium: "Continue to Payment (৳500)",

    // Cart & Checkout Page
    cartTitle: "Your Shopping Cart & Order Checkout",
    cartSub: "Review cart items, delivery address, and proceed to Stripe secure card payment.",
    emptyCartMsg: "Your cart is currently empty. Explore our services and store!",
    emptyCart: "Your cart is currently empty. Explore our services and store!",
    itemTotal: "Item Total",
    deliveryFee: "Delivery / Service Fee",
    grandTotal: "Grand Total",
    customerDetails: "Customer Shipping Address & Information",
    fullName: "Full Name",
    emailAddress: "Email Address (For Invoice)",
    phoneNo: "Mobile Phone Number",
    shippingAddress: "Shipping Address (House, Road, City in Bangladesh)",
    stripeMockTitle: "Stripe Online Payment Gateway",
    payNowBtn: "Pay & Generate Official Invoice (৳",
    invoiceGeneratedTitle: "Official Payment Invoice & Order Confirmation",
    downloadInvoice: "Print / Save Invoice PDF",
    loginTitle: "FurCare Account Portal",
    loginBtn: "Sign In",

    // Dashboard Page
    dashboardTitle: "Pet Owner Dashboard & Multi-Pet Management",
    myPets: "My Registered Pets",
    addPetBtn: "Register New Pet",
    petDetailsTitle: "Pet Passport & Profile",
    noPetsYet: "No pets registered yet. Click 'Register New Pet' to create your pet's digital passport!",

    // Language Toggle
    langEn: "English",
    langBn: "বাংলা",
  },

  bn: {
    // Header & Brand
    brandName: "FurCare",
    tagline: "স্মার্ট পোষা প্রাণীর স্বাস্থ্যসেবা ও সার্ভিস প্ল্যাটফর্ম",
    navHome: "হোম",
    navAdoption: "পোষা প্রাণী দত্তক",
    navVet: "পশু চিকিৎসক অ্যাপয়েন্টমেন্ট",
    navGrooming: "গ্রুমিং সার্ভিস",
    navHotel: "পেট হোটেল",
    navStore: "পেট শপ",
    navVaccine: "টিকা রেকর্ড",
    navLostFound: "হারানো ও প্রাপ্তি",
    navPremium: "এক্সট্রা প্রিমিয়াম",
    navCart: "কার্ট",
    navDashboard: "মাই ড্যাশবোর্ড",
    loginSignup: "লগইন / সাইনআপ",
    logout: "লগআউট",
    welcome: "স্বাগতম",

    // Hero & Home
    heroTitle: "আপনার প্রিয় পোষা প্রাণীর স্মার্ট যত্ন ও আধুনিক স্বাস্থ্যসেবা",
    heroSubtitle: "যাচাইকৃত পশু ডাক্তার বুক করুন, পোষা প্রাণী দত্তক নিন, অনলাইন সুপারমার্ট থেকে খাবার কিনুন, টিকাদান পাসপোর্ট ট্র্যাক করুন এবং ২৪/৭ AI জরুরি সেবা পান।",
    bookVetNow: "ডাক্তার বুকিং করুন",
    exploreAdoption: "দত্তক তালিকা দেখুন",
    exploreShop: "খাবার ও অ্যাক্সেসরিজ কিনুন",

    // Categories
    servicesTitle: "সম্পূর্ণ পেট কেয়ার সেবা সমূহ",
    servicesSubtitle: "আপনার কাঙ্ক্ষিত ক্যাটাগরি বেছে নিয়ে সেবা বুক করুন অথবা কেনাকাটা করুন।",
    catAdoptionTitle: "পোষা প্রাণী দত্তক (Adoption)",
    catAdoptionDesc: "টিন্ডার স্টাইল সোয়াইপ ও পছন্দ মত ব্রাউজ করে পোষা প্রাণী দত্তক নিন।",
    catVetTitle: "পশু চিকিৎসক অ্যাপয়েন্টমেন্ট",
    catVetDesc: "সেরা ডাক্তার খুঁজুন, ১ ঘন্টা আগে রিমাইন্ডার ও AI প্রাথমিক চিকিৎসা নির্দেশিকা পান।",
    catGroomingTitle: "গ্রুমিং সার্ভিসেস (Grooming)",
    catGroomingDesc: "গোসল, নখ কাটা, চুল ছাঁটা ও পোকা তাড়ানোর চিকিৎসা সেন্টার বা হোম সার্ভিসে পান।",
    catHotelTitle: "পেট হাউস / বোর্ডিং (Hotel)",
    catHotelDesc: "এসি রুম, ২৪/৭ সিসিটিভি নজরদারি সহ দৈনিক মাত্র ৳৫০০ থেকে পেট হোটেল বুক করুন।",
    catStoreTitle: "পেট ফুড ও অ্যাক্সেসরিজ স্টোর",
    catStoreDesc: "সুপারমার্কেট অনলাইন শপিং, পরিমাণ বৃদ্ধি/হ্রাস, সরাসরি কার্টে যুক্ত ও দ্রুত ডেলিভারি।",
    catVaccineTitle: "ডিজিটাল ভ্যাকসিন পাসপোর্ট",
    catVaccineDesc: "র‍্যাবিস ও ডিস্টেম্পার টিকার হিস্ট্রি এবং পরবর্তী টিকার রিয়েল-টাইম অ্যালার্ট পান।",
    catLostFoundTitle: "হারানো প্রাণী শনাক্তকরণ AI",
    catLostFoundDesc: "ছবি ও বৈশিষ্ট্যের মাধ্যমে AI দিয়ে হারানো পোষা প্রাণী ম্যাচ করুন।",
    catPremiumTitle: "এক্সট্রা প্রিমিয়াম ফিচারস",
    catPremiumDesc: "ওয়াকিং সার্ভিস, ২৪/৭ ইমার্জেন্সি ডাক্তার, ব্রিড ম্যাচিং ও পেট ফ্রেন্ডলি স্পট ম্যাপ মাত্র ৳৫০০ টাকায়।",

    // AI Assistant
    aiAssistantTitle: "FurCare AI ডাক্তার ও সহায়ক",
    aiAssistantSubtitle: "পোষা প্রাণীর খাদ্য, লক্ষণ, প্রশিক্ষণ বা জরুরি প্রাথমিক চিকিৎসা নিয়ে প্রশ্ন করুন",
    aiVoiceMode: "ভয়েস গাইড",
    aiTextMessage: "আপনার বার্তা লিখুন...",
    aiSend: "পাঠান",
    aiListening: "শুনছি... এখন কথা বলুন",

    // Adoption Page
    adoptionHeader: "আপনার পছন্দের পোষা প্রাণী নির্বাচন করুন",
    adoptionFilterBreed: "সকল ব্রিড",
    adoptionFilterColor: "সকল রঙ",
    adoptionFilterBehavior: "আচরণ",
    adoptionFilterAge: "বয়স গ্রুপ",
    swipeRightToAdopt: "দত্তক নিতে ডানে সোয়াইপ করুন",
    swipeLeftToPass: "এড়িয়ে যেতে বামে সোয়াইপ করুন",
    matchedPetTitle: "সার্ভে অনুযায়ী ম্যাচ করা পেট আইডি",
    adoptNowBtn: "দত্তক অনুরোধ অনুমোদন করুন",
    adoptedSuccess: "দত্তকের অনুরোধ সফলভাবে পাঠানো হয়েছে! মালিক শীঘ্রই যোগাযোগ করবেন।",
    locationLabel: "অবস্থান",
    vaccinatedYes: "ভ্যাকসিন প্রদান: হ্যাঁ",
    vaccinatedNo: "ভ্যাকসিন প্রদান: না",

    // Vet Appointment Page
    vetPageTitle: "পশু চিকিৎসক অ্যাপয়েন্টমেন্ট ও পরামর্শ ব্যবস্থা",
    vetSearchPlaceholder: "ডাক্তারের নাম, স্পেশালিটি বা এলাকা লিখে খুঁজুন (যেমন: ঢাকা, চট্টগ্রাম, উত্তরা)...",
    searchBtn: "ডাক্তার খুঁজুন",
    selectPetLabel: "পোষা প্রাণী সিলেক্ট করুন",
    selectTimeSlot: "উপলব্ধ সময় নির্বাচন করুন",
    symptomLabel: "পোষা প্রাণীর সমস্যা বা লক্ষণ",
    getAiFirstAid: "আগে AI প্রাথমিক চিকিৎসা দেখুন",
    aiFirstAidTitle: "AI প্রস্তাবিত তাৎক্ষণিক প্রাথমিক চিকিৎসা নির্দেশিকা",
    confirmBooking: "অ্যাপয়েন্টমেন্ট নিশ্চিত করুন (৳",
    reminderNotice: "⏰ রিয়েল-টাইম রিমাইন্ডার সক্রিয়: অ্যাপয়েন্টমেন্টের ১ ঘন্টা আগে আপনাকে জানানো হবে।",
    prescriptionHistoryTitle: "প্রেসক্রিপশন ও চিকিৎসার ইতিহাস",

    // Grooming Page
    groomingTitle: "প্রফেশনাল পেট গ্রুমিং সার্ভিস",
    groomingSub: "গ্রুমিং সেন্টার বুক করুন অথবা আপনার বাসায় সরাসরি হোম গ্রুমিং সার্ভিসের অনুরোধ করুন।",
    centerGrooming: "গ্রুমিং সেন্টার",
    homeGrooming: "বাসায় হোম গ্রুমিং",
    addToCartBtn: "কার্টে যুক্ত করুন",

    // Pet Hotel Page
    hotelTitle: "পেট হোটেল ও বোর্ডিং সুবিধা",
    hotelSub: "আপনি বাইরে গেলে আপনার পোষা প্রাণীর জন্য নিরাপদ এসি রুম, ২৪/৭ সিসিটিভি ও পুষ্টিকর খাবার।",
    bookHotelRoom: "রুম বুক করুন ও অগ্রিম পরিশোধ করুন",
    perDay: "দিন",

    // Pet Store Page
    storeTitle: "পেট সুপারমার্কেট ও অ্যাক্সেসরিজ স্টোর",
    allProducts: "সকল পণ্য",
    foodCategory: "খাদ্য ও পুষ্টি",
    accessoriesCategory: "অ্যাক্সেসরিজ ও বেল্ট",
    toysCategory: "খেলনা ও অ্যাক্টিভিটি",
    groomingCategory: "গ্রুমিং সামগ্রী",
    healthCategory: "স্বাস্থ্য ও ওষুধ",
    inStock: "স্টকে আছে",
    outOfStock: "স্টক শেষ",
    qty: "পরিমাণ",

    // Vaccination Passport Page
    passportTitle: "ডিজিটাল হেলথ ও ভ্যাকসিনেশন পাসপোর্ট",
    upcomingVaccines: "আসন্ন ভ্যাকসিনের রিমাইন্ডার",
    vaccineHistory: "ভ্যাকসিনের পূর্ববর্তী রেকর্ড",
    nextDue: "পরবর্তী ভ্যাকসিনের তারিখ",
    postVaccineTips: "ভ্যাকসিন পরবর্তী যত্ন পরামর্শ",
    bookVaccineAppt: "ভ্যাকসিন অ্যাপয়েন্টমেন্ট বুক করুন",

    // Lost & Found Page
    lostFoundTitle: "AI ম্যাচিং সহ হারানো ও প্রাপ্ত পোষা প্রাণী",
    lostFoundSub: "হারানো প্রাণীর রিপোর্ট বা প্রাপ্ত প্রাণীর ছবি আপলোড করুন। আমাদের AI রঙ, মুখমণ্ডল, চোখের রঙ ও দাগ দেখে মিল খুঁজে বের করবে।",
    reportLostPet: "হারানো প্রাণীর এফআইআর ফাইল করুন",
    reportFoundPet: "প্রাপ্ত প্রাণী রিপোর্ট করুন",
    aiMatchingBtn: "AI বিশ্লেষণ ও ম্যাচিং চালু করুন",
    aiMatchResult: "AI ম্যাচিং ফলাফল",

    // Premium Page
    premiumTitle: "FurCare এক্সট্রা প্রিমিয়াম মেম্বারশিপ",
    premiumSub: "হোম গ্রুমিং, ২৪/৭ ইমার্জেন্সি ডাক্তার হটলাইন, ডগ ওয়াকিং, ব্রিড ম্যাচমেকিং ও পেট ফ্রেন্ডলি প্লেস ম্যাপ আনলক করুন।",
    premiumPrice: "৳৫০০ / মাস",
    premiumBenefits: [
      "অন-ডিমান্ড ডগ ও ক্যাট ওয়াকিং সার্ভিস",
      "২৪/৭ ইমার্জেন্সি ডাক্তার কল ও অ্যাম্বুলেন্স সাপোর্ট",
      "জেনেটিক ব্রিড ম্যাচিং ও ব্রিডিং পরামর্শ",
      "বাংলাদেশের সকল পেট পার্ক, ক্লিনিক ও পেট ক্যাফে ইন্টারেক্টিভ ম্যাপ",
      "পেট শপ ও হোটেলে ফ্ল্যাট ১৫% মূল্যছাড়"
    ],
    subscribePremium: "পেমেন্টে এগিয়ে যান (৳৫০০)",

    // Cart & Checkout Page
    cartTitle: "আপনার শপিং কার্ট ও অর্ডার চেকআউট",
    emptyCart: "আপনার কার্ট বর্তমানে খালি আছে। আমাদের সার্ভিস ও স্টোর দেখুন!",
    itemTotal: "পণ্যের মোট মূল্য",
    deliveryFee: "ডেলিভারি / সার্ভিস চার্জ",
    grandTotal: "সর্বমোট টাকা",
    customerDetails: "গ্রাহকের ঠিকানা ও তথ্য",
    fullName: "পূর্ণ নাম",
    emailAddress: "ইমেইল অ্যাড্রেস (ইনভয়েসের জন্য)",
    phoneNo: "মোবাইল ফোন নম্বর",
    shippingAddress: "ডেলিভারি ঠিকানা (বাসা, রোড, শহর)",
    stripeMockTitle: "স্ট্রাইপ অনলাইন পেমেন্ট গেটওয়ে",
    payNowBtn: "পেমেন্ট করুন ও ইনভয়েস পান (৳",
    invoiceGeneratedTitle: "অফিসিয়াল পেমেন্ট ইনভয়েস ও কনফার্মেশন",
    downloadInvoice: "ইনভয়েস সেভ / প্রিন্ট করুন",

    // Dashboard Page
    dashboardTitle: "পেট ওনার ড্যাশবোর্ড ও মাল্টি-পেট ম্যানেজমেন্ট",
    myPets: "আমার পোষা প্রাণী সমূহ",
    addPetBtn: "নতুন পেট রেজিস্টার করুন",
    petDetailsTitle: "পেট পাসপোর্ট ও প্রোফাইল",
    noPetsYet: "এখনো কোনো পেট রেজিস্টার করা হয়নি। আপনার পোষা প্রাণীর ডিজিটাল পাসপোর্ট তৈরি করতে উপরে ক্লিক করুন!",

    // Language Toggle
    langEn: "English",
    langBn: "বাংলা",
  },
};
export function getTranslation(lang: Language, key: keyof typeof translations["en"]) {
  return translations[lang]?.[key] || translations["en"][key] || key;
}
