
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut, 
  Search,
  GitBranch,
  Globe,
  Database,
  BarChart,
  FileText,
  Home,
  Info,
  HelpCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const AppHeader = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search",
        description: `Searching for "${searchQuery}"`,
      });
    }
  };

  const unreadNotifications = 3;
  const unreadMessages = 2;

  return (
    <header className="bg-app-blue text-white border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-white flex items-center space-x-2">
            <span>Monitoring Plan</span>
          </Link>

          <NavigationMenu className="ml-6">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={cn("text-white", navigationMenuTriggerStyle(), "bg-transparent hover:bg-blue-700")}>
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={cn("text-white", navigationMenuTriggerStyle(), "bg-transparent hover:bg-blue-700")}>
                  <Link to="/sites">
                    <Globe className="h-4 w-4 mr-2" />
                    Sites
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={cn("text-white", navigationMenuTriggerStyle(), "bg-transparent hover:bg-blue-700")}>
                  <Link to="/actual-data">
                    <BarChart className="h-4 w-4 mr-2" />
                    Actual Data
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2">
          <form onSubmit={handleSearch} className="w-60 hidden md:block">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-white" />
              <Input
                placeholder="Search..."
                className="pl-8 w-full bg-blue-700 border-blue-600 text-white placeholder:text-blue-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 hidden md:flex">
                <Database className="h-4 w-4 mr-2" /> Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/data-sources')}>
                <Database className="h-4 w-4 mr-2" /> Data Sources
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/actual-data')}>
                <FileText className="h-4 w-4 mr-2" /> Actual Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/sites')}>
                <Globe className="h-4 w-4 mr-2" /> Sites
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/projects')}>
                <BarChart className="h-4 w-4 mr-2" /> Projects
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 hidden md:flex">
                <GitBranch className="h-4 w-4 mr-2" /> Tools
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/workflow')}>
                <GitBranch className="h-4 w-4 mr-2" /> Workflow Designer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/integrations')}>
                <Globe className="h-4 w-4 mr-2" /> Integrations
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/import')}>
                <Database className="h-4 w-4 mr-2" /> Import
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/export')}>
                <Database className="h-4 w-4 mr-2" /> Export
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" /> Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:bg-blue-700"
            onClick={() => navigate('/messaging')}
          >
            <MessageSquare className="h-5 w-5" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:bg-blue-700"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-blue-700">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>John Doe</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/about')}>
                <Info className="mr-2 h-4 w-4" />
                <span>About</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast({ title: 'Logged out' })}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
