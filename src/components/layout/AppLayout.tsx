
import React from 'react';
import AppHeader from './AppHeader';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-gray-50">
      <AppHeader />
      <main className="flex-1 container mx-auto p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
