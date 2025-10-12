import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { UILanguageProvider } from "./contexts/UILanguageContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ConversationPage from "./pages/ConversationPage";
import PrescriptionPage from "./pages/PrescriptionPage";
import MedicationsPage from "./pages/MedicationsPage";
import NotFound from "./pages/NotFound";
// import Index from "./pages/Index1";
import Index1 from "./pages/Index1";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UILanguageProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/conversation" element={<ConversationPage />} />
              <Route path="/prescription" element={<Index1 />} />
              <Route path="/medications" element={<MedicationsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </UILanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
