
import React, { useState } from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar toggle */}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed bottom-4 right-4 z-50 bg-app-blue text-white rounded-full h-12 w-12 shadow-lg hover:bg-blue-700"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </Button>
        )}
        
        {/* Sidebar */}
        <div className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out' : 'w-64'} 
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          bg-app-blue text-white
        `}>
          <AppSidebar />
        </div>
        
        {/* Main content */}
        <main className={`flex-1 overflow-auto transition-all duration-200 ease-in-out ${isMobile ? 'w-full' : 'ml-0'}`}>
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
