import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import DecisionEnginePage from "@/pages/DecisionEnginePage";
import BlacklistPage from "@/pages/BlacklistPage";
import DukcapilPage from "@/pages/DukcapilPage";
import AuditPage from "@/pages/AuditPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<DecisionEnginePage />} />
            <Route path="/blacklist" element={<BlacklistPage />} />
            <Route path="/dukcapil" element={<DukcapilPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
