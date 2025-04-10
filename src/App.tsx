
import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./components/ThemeProvider";
import Login from "@/pages/auth/Login";
import { useAppContext } from "@/context/AppContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  const { isAuthenticated } = useAppContext();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="app-theme">
          <TooltipProvider>
            <Routes>
              <Route path="/login" element={
                !isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />
              } />
              
              <Route path="/" element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Navigate to="/login" replace />
              } />
              
              <Route path="/dashboard" element={
                isAuthenticated ? 
                <AppLayout>
                  <Dashboard />
                </AppLayout> : 
                <Navigate to="/login" replace />
              } />
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
