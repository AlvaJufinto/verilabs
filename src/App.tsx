/** @format */

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuditPage from "@/pages/AuditPage";
import DukcapilPage from "@/pages/DukcapilPage";
import VerificationResultsPage from "@/pages/VerificationResultsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
						{/*<Route path="/" element={<DecisionEnginePage />} />*/}
						{/*<Route path="/blacklist" element={<BlacklistPage />} />*/}
						<Route path="/" element={<VerificationResultsPage />} />
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
