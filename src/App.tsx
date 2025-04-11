
import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Sites from "./pages/Sites";
import SiteDetails from "./pages/SiteDetails";
import Projects from "./pages/Projects";
import Import from "./pages/Import";
import Export from "./pages/Export";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ActualData from "./pages/ActualData";
import Messaging from "./pages/Messaging";
import Notifications from "./pages/Notifications";
import Workflow from "./pages/Workflow";
import Integrations from "./pages/Integrations";
import DataSources from "./pages/DataSources";
import UsersManagement from "./pages/UsersManagement";
import MapVisualization from "./pages/MapVisualization";
import ReportTemplate from "./pages/ReportTemplate";
import { ThemeProvider } from "./components/ThemeProvider";
import Login from "@/pages/auth/Login";
import { useAppContext } from "@/context/AppContext";
import Index from "@/pages/Index";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Auth routes component - redirects to dashboard if already logged in
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppContext();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Root route redirects to dashboard or login */}
              <Route path="/" element={<Index />} />
              
              {/* Auth routes */}
              <Route path="/login" element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } />
              
              {/* Protected routes */}
              <Route element={
                <ProtectedRoute>
                  <AppLayout>
                    <Outlet />
                  </AppLayout>
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sites" element={<Sites />} />
                <Route path="/sites/:id" element={<SiteDetails />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/import" element={<Import />} />
                <Route path="/export" element={<Export />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/actual-data" element={<ActualData />} />
                <Route path="/messaging" element={<Messaging />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/workflow" element={<Workflow />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/data-sources" element={<DataSources />} />
                <Route path="/users" element={<UsersManagement />} />
                <Route path="/map-visualization" element={<MapVisualization />} />
                <Route path="/report-template" element={<ReportTemplate />} />
              </Route>
              
              {/* Catch all for non-existent routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
