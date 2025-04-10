
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarHeader 
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  ListChecks, 
  Database, 
  Settings, 
  UploadCloud, 
  Download, 
  Calendar, 
  BarChart, 
  FileText, 
  Users, 
  Wrench,
  Layers
} from 'lucide-react';

const AppSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Tableau de bord",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Planning",
      path: "/planning",
      icon: Calendar
    },
    {
      title: "Données actuelles",
      path: "/actual-data",
      icon: BarChart
    },
    {
      title: "Configuration des données",
      path: "/data-config",
      icon: Database
    },
    {
      title: "Rapports",
      path: "/reports",
      icon: FileText
    },
    {
      title: "Outils",
      path: "/tools",
      icon: Wrench
    },
    {
      title: "Sites",
      path: "/sites",
      icon: Layers
    },
    {
      title: "Utilisateurs",
      path: "/users",
      icon: Users
    },
    {
      title: "Paramètres",
      path: "/settings",
      icon: Settings
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center px-4 py-2">
          <span className="text-lg font-semibold text-white">MEMS</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild className={isActive ? "bg-app-gray text-app-blue" : ""}>
                      <Link to={item.path} className="flex items-center gap-3">
                        <item.icon size={20} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
