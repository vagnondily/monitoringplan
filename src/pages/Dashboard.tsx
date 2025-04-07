
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { Building, Clock, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight, RefreshCw, FileBar, Layers, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCard from '@/components/dashboard/StatsCard';
import QuickLinksSection from '@/components/dashboard/QuickLinksSection';
import TasksOverview from '@/components/dashboard/TasksOverview';
import { siteService, projectService } from '@/services/dataService';
import { notificationService } from '@/services/notificationService';
import { Site, Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
  const [period, setPeriod] = useState('month');
  
  const { data: sites = [], isLoading: sitesLoading } = useQuery<Site[]>({
    queryKey: ['sites'],
    queryFn: siteService.getSites
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: projectService.getProjects
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications
  });

  // Preparing data for the charts
  const sitesStatusData = [
    { name: 'Actifs', value: sites.filter(s => s.status === 'Actif').length },
    { name: 'Inactifs', value: sites.filter(s => s.status === 'Inactif').length },
    { name: 'En attente', value: sites.filter(s => s.status === 'En attente').length }
  ];

  const projectStatusData = [
    { name: 'En cours', value: projects.filter(p => p.status === 'En cours').length },
    { name: 'Terminé', value: projects.filter(p => p.status === 'Terminé').length },
    { name: 'En attente', value: projects.filter(p => p.status === 'En attente').length }
  ];

  // Calculate the monitoring coverage
  const sitesToVisit = sites.filter(s => s.priority === 'high' || s.priority === 'medium').length;
  const sitesVisited = sites.filter(s => s.lastVisitDate && new Date(s.lastVisitDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)).length;
  const monitoringCoverage = sitesToVisit ? Math.round((sitesVisited / sitesToVisit) * 100) : 0;

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Monthly site activity data
  const monthlyActivityData = [
    { name: 'Jan', visits: 65, plans: 78, average: 71.5 },
    { name: 'Feb', visits: 59, plans: 85, average: 72 },
    { name: 'Mar', visits: 80, plans: 87, average: 83.5 },
    { name: 'Apr', visits: 81, plans: 76, average: 78.5 },
    { name: 'May', visits: 56, plans: 60, average: 58 },
    { name: 'Jun', visits: 55, plans: 65, average: 60 },
    { name: 'Jul', visits: 40, plans: 70, average: 55 },
    { name: 'Aug', visits: 75, plans: 80, average: 77.5 },
    { name: 'Sep', visits: 65, plans: 68, average: 66.5 },
    { name: 'Oct', visits: 70, plans: 73, average: 71.5 },
    { name: 'Nov', visits: 62, plans: 77, average: 69.5 },
    { name: 'Dec', visits: 85, plans: 90, average: 87.5 }
  ];

  const regionVisitData = [
    { region: 'Analamanga', value: 120 },
    { region: 'Atsinanana', value: 98 },
    { region: 'Haute Matsiatra', value: 86 },
    { region: 'Diana', value: 99 },
    { region: 'Boeny', value: 85 },
    { region: 'Anosy', value: 65 }
  ];

  const siteSpiderData = [
    { subject: 'Security', A: 120, B: 110, fullMark: 150 },
    { subject: 'Access', A: 98, B: 130, fullMark: 150 },
    { subject: 'Resources', A: 86, B: 130, fullMark: 150 },
    { subject: 'Partners', A: 99, B: 100, fullMark: 150 },
    { subject: 'Issues', A: 85, B: 90, fullMark: 150 },
    { subject: 'Follow-up', A: 65, B: 85, fullMark: 150 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Monitoring Plan</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="border-app-blue text-app-blue">
            <RefreshCw className="mr-2 h-4 w-4" />
            Rafraîchir les données
          </Button>
          <Link to="/reports">
            <Button className="bg-app-blue hover:bg-app-lightBlue">
              <FileBar className="mr-2 h-4 w-4" />
              Voir les rapports
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Sites Actifs" 
          value={sites.filter(s => s.status === 'Actif').length} 
          icon={<Building className="h-5 w-5" />} 
          description="Nombre total de sites actifs"
          trend={
            <div className="flex items-center text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+5%</span>
            </div>
          }
        />
        <StatsCard 
          title="Projets En cours" 
          value={projects.filter(p => p.status === 'En cours').length} 
          icon={<Clock className="h-5 w-5" />}
          description="Projets actuellement en cours"
          trend={
            <div className="flex items-center text-yellow-600">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              <span>-2%</span>
            </div>
          }
        />
        <StatsCard 
          title="Couverture Monitoring" 
          value={`${monitoringCoverage}%`} 
          icon={<CheckCircle className="h-5 w-5" />}
          description="Sites visités vs sites à visiter"
          trend={
            <div className="flex items-center text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+8%</span>
            </div>
          }
        />
        <StatsCard 
          title="Alertes" 
          value={unreadNotifications} 
          icon={<AlertTriangle className="h-5 w-5" />}
          description="Nombre d'alertes requérant attention"
          trend={
            <div className="flex items-center text-red-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+3</span>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Activité Mensuelle des Sites</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" 
                className={period === 'month' ? 'bg-app-blue text-white' : ''} 
                onClick={() => setPeriod('month')}>
                Mois
              </Button>
              <Button variant="outline" size="sm" 
                className={period === 'quarter' ? 'bg-app-blue text-white' : ''} 
                onClick={() => setPeriod('quarter')}>
                Trimestre
              </Button>
              <Button variant="outline" size="sm" 
                className={period === 'year' ? 'bg-app-blue text-white' : ''} 
                onClick={() => setPeriod('year')}>
                Année
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyActivityData}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1e40af" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorPlans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area type="monotone" dataKey="visits" stroke="#1e40af" fillOpacity={1} fill="url(#colorVisits)" name="Visites réalisées" />
                  <Area type="monotone" dataKey="plans" stroke="#38bdf8" fillOpacity={1} fill="url(#colorPlans)" name="Visites planifiées" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Visites par Région</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={regionVisitData}
                  margin={{ top: 20, right: 30, left: 75, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="region" />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#1e40af" name="Nombre de visites" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">État des Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sitesStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sitesStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">État des Projets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projectStatusData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#1e40af" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Analyse des Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius={80} data={siteSpiderData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} />
                  <Radar name="Attendu" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Réel" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                  <RechartsTooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="quicklinks">
        <TabsList>
          <TabsTrigger value="quicklinks" className="flex items-center gap-2">
            <Layers className="h-4 w-4" /> Accès rapides
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Tâches à venir
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Map className="h-4 w-4" /> Activité récente
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="quicklinks">
          <QuickLinksSection />
        </TabsContent>
        
        <TabsContent value="tasks">
          <TasksOverview />
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...sites].sort((a, b) => 
                  new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
                ).slice(0, 5).map((site) => (
                  <div key={site.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{site.name}</p>
                      <p className="text-sm text-gray-500">{site.location}</p>
                    </div>
                    <div>
                      <Badge variant={site.status === 'Actif' ? 'default' : 'outline'}>
                        {site.status}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        Mis à jour le {new Date(site.lastUpdate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Voir toutes les activités
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
