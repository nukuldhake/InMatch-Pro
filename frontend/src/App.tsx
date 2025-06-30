import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LiveMatchPredictor from "./pages/LiveMatchPredictor";
import PlayerPerformancePredictor from "./pages/PlayerPerformancePredictor";
import PlayerStatsLookup from "./pages/PlayerStatsLookup";
import PlayerClustering from "./pages/PlayerClustering";
import FantasyPointsEstimator from "./pages/FantasyPointsEstimator";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/live-match-predictor" element={<LiveMatchPredictor />} />
            <Route path="/player-performance-predictor" element={<PlayerPerformancePredictor />} />
            <Route path="/player-stats-lookup" element={<PlayerStatsLookup />} />
            <Route path="/player-clustering" element={<PlayerClustering />} />
            <Route path="/fantasy-points-estimator" element={<FantasyPointsEstimator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
