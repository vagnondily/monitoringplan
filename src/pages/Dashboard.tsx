
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building, Clock, DatabaseIcon, Server, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/dashboard/StatsCard';
import QuickLinksSection from '@/components/dashboard/QuickLinksSection';
import TasksOverview from '@/components/dashboard/TasksOverview';
import { siteService, projectService } from '@/services/dataService';
import { notificationService } from '@/services/notificationService';
import { Site, Project } from '@/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const { data: sites = [] } = useQuery<Site[]>({
    queryKey: ['sites'],
    queryFn: siteService.getSites
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: projectService.getProjects
  });

  const { data: notifications = [] } = useQuery({
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord COMET</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="border-app-blue text-app-blue">
            Rafraîchir les données
          </Button>
          <Link to="/reports">
            <Button className="bg-app-blue hover:bg-app-lightBlue">
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
        />
        <StatsCard 
          title="Projets En cours" 
          value={projects.filter(p => p.status === 'En cours').length} 
          icon={<Clock className="h-5 w-5" />}
          description="Projets actuellement en cours"
        />
        <StatsCard 
          title="Couverture Monitoring" 
          value={`${monitoringCoverage}%`} 
          icon={<CheckCircle className="h-5 w-5" />}
          description="Sites visités vs sites à visiter"
        />
        <StatsCard 
          title="Alertes" 
          value={unreadNotifications} 
          icon={<AlertTriangle className="h-5 w-5" />}
          description="Nombre d'alertes requérant attention"
        />
      </div>

      <Tabs defaultValue="charts">
        <TabsList>
          <TabsTrigger value="charts">Aperçu analytique</TabsTrigger>
          <TabsTrigger value="quicklinks">Accès rapides</TabsTrigger>
          <TabsTrigger value="tasks">Tâches à venir</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>État des Sites</CardTitle>
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
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>État des Projets</CardTitle>
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
                      <Tooltip />
                      <Bar dataKey="value" fill="#1e40af" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

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
                    <div className="text-sm text-gray-500">
                      Mis à jour le {site.lastUpdate}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quicklinks">
          <QuickLinksSection />
        </TabsContent>
        
        <TabsContent value="tasks">
          <TasksOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
