
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
import { LayoutDashboard, ListChecks, DatabaseIcon, Settings, UploadCloud, Download } from 'lucide-react';

const AppSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Tableau de bord",
      path: "/",
      icon: LayoutDashboard
    },
    {
      title: "Sites",
      path: "/sites",
      icon: ListChecks
    },
    {
      title: "Projets",
      path: "/projects",
      icon: DatabaseIcon
    },
    {
      title: "Importer",
      path: "/import",
      icon: UploadCloud
    },
    {
      title: "Exporter",
      path: "/export",
      icon: Download
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
          <span className="text-lg font-semibold text-app-blue">SiteSync Insight</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
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
