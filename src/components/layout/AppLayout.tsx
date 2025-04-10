
import * as React from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider defaultOpen={true}>
          <div className="w-64 bg-app-blue text-white">
            <AppSidebar />
          </div>
          
          <main className="flex-1 overflow-auto transition-all duration-200 ease-in-out">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default AppLayout;
