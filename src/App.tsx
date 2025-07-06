
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CoastalU from "./pages/CoastalU";
import Talent from "./pages/Talent";
import Compliance from "./pages/Compliance";
import PartnerRegistration from "./pages/PartnerRegistration";
import Admin from "./pages/Admin";
import AdjusterStates from "./pages/AdjusterStates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/coastal-u" element={<CoastalU />} />
          <Route path="/talent" element={<Talent />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/partner-registration" element={<PartnerRegistration />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/adjuster-states/:adjusterId" element={<AdjusterStates />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
