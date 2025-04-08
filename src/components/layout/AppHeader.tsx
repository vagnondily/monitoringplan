
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
  ChevronDown,
  Database,
  BarChart,
  FileText,
  Home,
  Info,
  HelpCircle,
  ListChecks,
  Calendar,
  ClipboardList,
  UserPlus,
  FileOutput,
  Map,
  Briefcase,
  Book
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
                <NavigationMenuTrigger className="text-white bg-transparent hover:bg-blue-700">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Planning
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500 to-blue-900 p-6 no-underline outline-none focus:shadow-md"
                          to="/settings"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Overarching Parameters
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Configure global parameters for the monitoring plan
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link
                        to="/sites"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-100 hover:text-blue-900 focus:bg-blue-100 focus:text-blue-900"
                      >
                        <div className="text-sm font-medium leading-none">Sites Process Monitoring Plan</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Manage and monitor site processes
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/distribution-plan"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-100 hover:text-blue-900 focus:bg-blue-100 focus:text-blue-900"
                      >
                        <div className="text-sm font-medium leading-none">Distribution Plan</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Manage distribution schedules and targets
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/outcomes-plan"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-100 hover:text-blue-900 focus:bg-blue-100 focus:text-blue-900"
                      >
                        <div className="text-sm font-medium leading-none">Outcomes Plan</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Define and track expected outcomes
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/staff-leaves"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-100 hover:text-blue-900 focus:bg-blue-100 focus:text-blue-900"
                      >
                        <div className="text-sm font-medium leading-none">Staff Leaves Plan</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Schedule and manage staff leaves
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
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
                <Database className="h-4 w-4 mr-2" /> Data <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/data-sources')}>
                <Database className="h-4 w-4 mr-2" /> Data Sources
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/sites')}>
                <Map className="h-4 w-4 mr-2" /> Liste des sites
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/projects')}>
                <Briefcase className="h-4 w-4 mr-2" /> Liste des projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/documentation')}>
                <Book className="h-4 w-4 mr-2" /> Documentation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Actual Data</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate('/output')}>
                <FileOutput className="h-4 w-4 mr-2" /> Output
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/outcome')}>
                <FileText className="h-4 w-4 mr-2" /> Outcome
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/process-monitoring')}>
                <ListChecks className="h-4 w-4 mr-2" /> Process Monitoring
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 hidden md:flex">
                <ListChecks className="h-4 w-4 mr-2" /> Tools <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/workflow')}>
                <ListChecks className="h-4 w-4 mr-2" /> Workflow Designer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 hidden md:flex">
                <BarChart className="h-4 w-4 mr-2" /> Reports <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/outcomes-report')}>
                <FileText className="h-4 w-4 mr-2" /> Outcomes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/process-monitoring-report')}>
                <ListChecks className="h-4 w-4 mr-2" /> Process Monitoring
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/me-report')}>
                <ClipboardList className="h-4 w-4 mr-2" /> M&E Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/map-visualization')}>
                <Map className="h-4 w-4 mr-2" /> Visualisation cartographiques des sites
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
