import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import authService from "./services/authService";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useAppContext();
  
  React.useEffect(() => {
    const checkAuth = () => {
      const isUserAuthenticated = authService.isAuthenticated();
      setIsAuthenticated(isUserAuthenticated);
      
      if (isUserAuthenticated) {
        const userData = authService.getCurrentUser();
        if (userData) {
          const processedUser = {
            ...userData,
            role: userData.role as any
          };
          setUser(processedUser);
        }
      }
    };
    
    checkAuth();
  }, [setIsAuthenticated, setUser]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppContext();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service worker registered successfully:', registration);
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
};

const App = () => {
  const { isAuthenticated } = useAppContext();
  
  React.useEffect(() => {
    registerServiceWorker();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="app-theme">
          <TooltipProvider>
            <Routes>
              <Route path="/login" element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } />
              
              <Route path="/" element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Navigate to="/login" replace />
              } />
              
              <Route element={
                <ProtectedRoute>
                  <AppLayout>
                    <Outlet />
                  </AppLayout>
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/planning" element={<div>Planning Component</div>} />
                <Route path="/sites" element={<Sites />} />
                <Route path="/sites/:id" element={<SiteDetails />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/actual-data" element={<ActualData />} />
                <Route path="/data-config" element={<div>Data Configuration Component</div>} />
                <Route path="/reports" element={<div>Reports Component</div>} />
                <Route path="/tools" element={<div>Tools Component</div>} />
                <Route path="/tools/workflow" element={<Workflow />} />
                <Route path="/tools/report-template" element={<ReportTemplate />} />
                <Route path="/import" element={<Import />} />
                <Route path="/export" element={<Export />} />
                <Route path="/users" element={<UsersManagement />} />
                <Route path="/messaging" element={<Messaging />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/data-sources" element={<DataSources />} />
                <Route path="/map-visualization" element={<MapVisualization />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
