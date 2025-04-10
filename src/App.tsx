
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import MEReportTemplate from "./pages/MEReportTemplate";
import ReportTemplate from "./pages/ReportTemplate";
import { ThemeProvider } from "./components/ThemeProvider";
import Login from "@/pages/auth/Login";

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
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={
        <AuthRoute>
          <Login />
        </AuthRoute>
      } />
      
      {/* Protected routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sites" element={<Sites />} />
        
        {/* Not implemented pages */}
        <Route path="/planning" element={<NotImplemented />} />
        <Route path="/actual-data" element={<NotImplemented />} />
        <Route path="/data" element={<NotImplemented />} />
        <Route path="/reports" element={<NotImplemented />} />
        <Route path="/tools" element={<NotImplemented />} />
        <Route path="/users" element={<NotImplemented />} />
        <Route path="/settings" element={<NotImplemented />} />
        
        {/* Catch all for non-existent routes */}
        <Route path="*" element={<NotImplemented />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              } 
            />
            <Route 
              path="/sites" 
              element={
                <AppLayout>
                  <Sites />
                </AppLayout>
              } 
            />
            <Route 
              path="/sites/:id" 
              element={
                <AppLayout>
                  <SiteDetails />
                </AppLayout>
              } 
            />
            <Route 
              path="/projects" 
              element={
                <AppLayout>
                  <Projects />
                </AppLayout>
              } 
            />
            <Route 
              path="/import" 
              element={
                <AppLayout>
                  <Import />
                </AppLayout>
              } 
            />
            <Route 
              path="/export" 
              element={
                <AppLayout>
                  <Export />
                </AppLayout>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              } 
            />
            <Route 
              path="/actual-data" 
              element={
                <AppLayout>
                  <ActualData />
                </AppLayout>
              } 
            />
            <Route 
              path="/messaging" 
              element={
                <AppLayout>
                  <Messaging />
                </AppLayout>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <AppLayout>
                  <Notifications />
                </AppLayout>
              } 
            />
            <Route 
              path="/workflow" 
              element={
                <AppLayout>
                  <Workflow />
                </AppLayout>
              } 
            />
            <Route 
              path="/integrations" 
              element={
                <AppLayout>
                  <Integrations />
                </AppLayout>
              } 
            />
            <Route 
              path="/data-sources" 
              element={
                <AppLayout>
                  <DataSources />
                </AppLayout>
              } 
            />
            <Route 
              path="/users" 
              element={
                <AppLayout>
                  <UsersManagement />
                </AppLayout>
              } 
            />
            <Route 
              path="/map-visualization" 
              element={
                <AppLayout>
                  <MapVisualization />
                </AppLayout>
              } 
            />
            <Route 
              path="/me-report-template" 
              element={
                <AppLayout>
                  <MEReportTemplate />
                </AppLayout>
              } 
            />
            <Route 
              path="/report-template" 
              element={
                <AppLayout>
                  <ReportTemplate />
                </AppLayout>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
