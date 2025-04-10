
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Sites from "./pages/Sites";
import Projects from "./pages/Projects";
import Import from "./pages/Import";
import Export from "./pages/Export";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sites" element={
            <AppLayout>
              <Sites />
            </AppLayout>
          } />
          <Route path="/projects" element={
            <AppLayout>
              <Projects />
            </AppLayout>
          } />
          <Route path="/import" element={
            <AppLayout>
              <Import />
            </AppLayout>
          } />
          <Route path="/export" element={
            <AppLayout>
              <Export />
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout>
              <Settings />
            </AppLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
