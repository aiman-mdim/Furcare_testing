import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { ReminderBanner } from "./components/ReminderBanner";
import { NotificationToast } from "./components/NotificationToast";
import { Footer } from "./components/Footer";
import { AiAssistantModal } from "./components/AiAssistantModal";

// Pages
import { HomePage } from "./pages/HomePage";
import { PetAdoptionPage } from "./pages/PetAdoptionPage";
import { VetAppointmentPage } from "./pages/VetAppointmentPage";
import { GroomingPage } from "./pages/GroomingPage";
import { PetHotelPage } from "./pages/PetHotelPage";
import { PetStorePage } from "./pages/PetStorePage";
import { VaccinationPage } from "./pages/VaccinationPage";
import { LostAndFoundPage } from "./pages/LostAndFoundPage";
import { PremiumFeaturesPage } from "./pages/PremiumFeaturesPage";
import { CartCheckoutPage } from "./pages/CartCheckoutPage";
import { UserDashboardPage } from "./pages/UserDashboardPage";
import { LoginSignupPage } from "./pages/LoginSignupPage";

const MainContent: React.FC = () => {
  const { activePage } = useApp();

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <HomePage />;
      case "adoption":
        return <PetAdoptionPage />;
      case "vet":
        return <VetAppointmentPage />;
      case "grooming":
        return <GroomingPage />;
      case "hotel":
        return <PetHotelPage />;
      case "store":
        return <PetStorePage />;
      case "vaccines":
        return <VaccinationPage />;
      case "lostfound":
        return <LostAndFoundPage />;
      case "premium":
        return <PremiumFeaturesPage />;
      case "cart":
        return <CartCheckoutPage />;
      case "dashboard":
        return <UserDashboardPage />;
      case "login":
        return <LoginSignupPage />;
      default:
        return <HomePage />;
    }
  };
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
      <ReminderBanner />
      <NotificationToast />
      <Header />
      
      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer />
      <AiAssistantModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
