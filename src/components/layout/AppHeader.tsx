
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  MessageSquare,
  User,
  Settings,
  LogOut,
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
  Book,
  FileInput,
  LayoutTemplate
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
  const navigate = useNavigate();

  const unreadNotifications = 3;
  const unreadMessages = 2;
  const AppHeader: React.FC = () => {
  const { toggleSidebar, user, isDarkMode, toggleDarkMode } = useAppContext();
    
  return (
    <header className="bg-app-blue text-white border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-white flex items-center space-x-2">
            <span>Monitoring Plan</span>
          </Link>
    <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="text-white hover:bg-navy-800"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
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
                            Paramètres Globaux
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Configurez les paramètres globaux pour le plan de suivi
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
                          Gérer et surveiller les processus des sites
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/distribution-plan"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-100 hover:text-blue-900 focus:bg-blue-100 focus:text-blue-900"
                      >
                        <div className="text-sm font-medium leading-none">Plan de distribution</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Gérer les calendriers et les cibles de distribution
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/outcomes-plan"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-100 hover:text-blue-900 focus:bg-blue-100 focus:text-blue-900"
                      >
                        <div className="text-sm font-medium leading-none">Plan des résultats</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Définir et suivre les résultats attendus
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/staff-leaves"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-100 hover:text-blue-900 focus:bg-blue-100 focus:text-blue-900"
                      >
                        <div className="text-sm font-medium leading-none">Plan des congés du personnel</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Planifier et gérer les congés du personnel
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
                    Données actuelles
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 hidden md:flex">
                <Database className="h-4 w-4 mr-2" /> Données <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/data-sources')}>
                <Database className="h-4 w-4 mr-2" /> Sources de données
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/sites')}>
                <Map className="h-4 w-4 mr-2" /> Liste des sites
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/projects')}>
                <Briefcase className="h-4 w-4 mr-2" /> Liste des projets
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/documentation')}>
                <Book className="h-4 w-4 mr-2" /> Documentation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 hidden md:flex">
                <ListChecks className="h-4 w-4 mr-2" /> Outils <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/workflow')}>
                <ListChecks className="h-4 w-4 mr-2" /> Concepteur de workflow
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/me-report-template')}>
                <LayoutTemplate className="h-4 w-4 mr-2" /> M&E Report Template Creator
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/report-template')}>
                <FileInput className="h-4 w-4 mr-2" /> Report Template Creator
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 hidden md:flex">
                <BarChart className="h-4 w-4 mr-2" /> Rapports <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/outcomes-report')}>
                <FileText className="h-4 w-4 mr-2" /> Résultats
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/process-monitoring-report')}>
                <ListChecks className="h-4 w-4 mr-2" /> Suivi des processus
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/me-report')}>
                <ClipboardList className="h-4 w-4 mr-2" /> Rapport M&E
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/map-visualization')}>
                <Map className="h-4 w-4 mr-2" /> Visualisation cartographique des sites
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
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/about')}>
                <Info className="mr-2 h-4 w-4" />
                <span>À propos</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Aide</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast({ title: 'Déconnecté' })}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
