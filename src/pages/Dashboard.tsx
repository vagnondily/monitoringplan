
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/dashboard/StatsCard';
import { siteService, projectService } from '@/services/dataService';
import { Site, Project } from '@/types';
import { Building, Clock, Database, Server } from 'lucide-react';

const Dashboard = () => {
  const { data: sites = [] } = useQuery<Site[]>({
    queryKey: ['sites'],
    queryFn: siteService.getSites
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: projectService.getProjects
  });

  // Préparer les données pour le graphique
  const projectStatusData = [
    { name: 'En cours', count: projects.filter(p => p.status === 'En cours').length },
    { name: 'Terminé', count: projects.filter(p => p.status === 'Terminé').length },
    { name: 'En attente', count: projects.filter(p => p.status === 'En attente').length }
  ];

  // Calculer la progression moyenne des projets
  const averageProgress = projects.length 
    ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Sites Totaux" 
          value={sites.length} 
          icon={<Building className="h-5 w-5" />} 
          description="Nombre total de sites gérés"
        />
        <StatsCard 
          title="Projets Actifs" 
          value={projects.filter(p => p.status === 'En cours').length} 
          icon={<Clock className="h-5 w-5" />}
          description="Projets actuellement en cours"
        />
        <StatsCard 
          title="Progression Moyenne" 
          value={`${averageProgress}%`} 
          icon={<Database className="h-5 w-5" />}
          description="Progression moyenne des projets"
        />
        <StatsCard 
          title="Sites Actifs" 
          value={sites.filter(s => s.status === 'Actif').length} 
          icon={<Server className="h-5 w-5" />}
          description="Sites actuellement actifs"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statut des Projets</CardTitle>
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
                  <Bar dataKey="count" fill="#1e40af" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
};

export default Dashboard;
