
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Menu } from 'lucide-react';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';

const AppHeader = () => {
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-app-blue text-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">COMET</span>
          </Link>
        </div>

        <NavigationMenu className="mx-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className="text-white hover:text-blue-200">
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white bg-transparent hover:bg-blue-700 hover:text-white">Planning</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2">
                  <li className="p-2 hover:bg-blue-50 hover:text-blue-900 rounded">
                    <Link to="/sites">Site Planning</Link>
                  </li>
                  <li className="p-2 hover:bg-blue-50 hover:text-blue-900 rounded">
                    <Link to="/projects">Project Planning</Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white bg-transparent hover:bg-blue-700 hover:text-white">Partnership</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4">
                  <li className="p-2 hover:bg-blue-50 hover:text-blue-900 rounded">
                    <Link to="/partnerships">Manage Partnerships</Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/frn">
                <NavigationMenuLink className="text-white hover:text-blue-200">
                  FRN
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white bg-transparent hover:bg-blue-700 hover:text-white">Actual Data</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4">
                  <li className="p-2 hover:bg-blue-50 hover:text-blue-900 rounded">
                    <Link to="/actual-data">ODK/Ona Data</Link>
                  </li>
                  <li className="p-2 hover:bg-blue-50 hover:text-blue-900 rounded">
                    <Link to="/import">Import Data</Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white bg-transparent hover:bg-blue-700 hover:text-white">Ben. Counting</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4">
                  <li className="p-2 hover:bg-blue-50 hover:text-blue-900 rounded">
                    <Link to="/beneficiary-counting">Beneficiary Statistics</Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/reports">
                <NavigationMenuLink className="text-white hover:text-blue-200">
                  Reports
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white bg-transparent hover:bg-blue-700 hover:text-white">Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4">
                  <li className="p-2 hover:bg-blue-50 hover:text-blue-900 rounded">
                    <Link to="/messaging">Task Messaging</Link>
                  </li>
                  <li className="p-2 hover:bg-blue-50 hover:text-blue-900 rounded">
                    <Link to="/export">Data Export</Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-blue-700">
              <Bell size={20} />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full p-0">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700 flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-blue-800">UN</AvatarFallback>
              </Avatar>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
