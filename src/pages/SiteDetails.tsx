
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, Calendar, FileText, BarChart, User, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

// Simulons un service pour les sites (remplacez par le vrai service quand il sera disponible)
const getSite = async (id: string) => {
  // Simuler une requête API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id,
    name: "Site de démonstration",
    location: "Antananarivo",
    region: "Analamanga",
    district: "Antananarivo Renivohitra",
    status: "Actif",
    activeSite: true,
    monitoringPriority: "high",
    lastVisitDate: "2024-03-15",
    visitCount: 4,
    sitesToVisit: 6,
    manager: "Jean Dupont",
    createdAt: "2023-06-10",
    description: "Site de démonstration pour le suivi des activités du projet XYZ.",
    coordinates: { lat: -18.879190, lng: 47.507905 },
    contacts: [
      { name: "Marie Laurent", role: "Coordinatrice locale", phone: "+261 34 567 8901", email: "marie.laurent@example.com" },
      { name: "Pierre Rakoto", role: "Technicien", phone: "+261 33 123 4567", email: "pierre.rakoto@example.com" }
    ],
    visits: [
      { date: "2024-03-15", by: "Jean Dupont", report: "Visite de routine", status: "completed" },
      { date: "2024-02-20", by: "Sophie Martin", report: "Suivi des activités", status: "completed" },
      { date: "2024-01-10", by: "Jean Dupont", report: "Évaluation des besoins", status: "completed" },
      { date: "2023-12-05", by: "Marie Laurent", report: "Formation des agents locaux", status: "completed" }
    ],
    upcomingVisits: [
      { date: "2024-04-20", by: "Jean Dupont", purpose: "Suivi trimestriel", status: "planned" },
      { date: "2024-05-15", by: "Sophie Martin", purpose: "Évaluation d'impact", status: "planned" }
    ],
    activities: [
      { name: "Distribution de semences", startDate: "2024-01-15", endDate: "2024-01-20", status: "completed", progress: 100 },
      { name: "Formation des agriculteurs", startDate: "2024-02-10", endDate: "2024-02-15", status: "completed", progress: 100 },
      { name: "Installation des systèmes d'irrigation", startDate: "2024-03-01", endDate: "2024-04-15", status: "in_progress", progress: 65 },
      { name: "Suivi de la croissance des cultures", startDate: "2024-03-20", endDate: "2024-06-30", status: "in_progress", progress: 30 }
    ],
    metrics: [
      { name: "Surface cultivée (ha)", value: 12.5, target: 15, unit: "ha" },
      { name: "Bénéficiaires", value: 45, target: 50, unit: "personnes" },
      { name: "Rendement moyen", value: 3.2, target: 4.0, unit: "tonnes/ha" },
      { name: "Taux d'adoption des techniques", value: 75, target: 90, unit: "%" }
    ]
  };
};

const SiteDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: site, isLoading } = useQuery({
    queryKey: ['site', id],
    queryFn: () => getSite(id || ''),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Chargement des données du site...</p>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">Site non trouvé</h2>
        <p className="text-muted-foreground mb-4">Le site demandé n'existe pas ou a été supprimé.</p>
        <Button onClick={() => navigate('/sites')}>
          Retour à la liste des sites
        </Button>
      </div>
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'actif':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'en maintenance':
        return <Badge className="bg-yellow-500">En maintenance</Badge>;
      case 'inactif':
        return <Badge className="bg-red-500">Inactif</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/sites')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{site.name}</h1>
          {getStatusBadge(site.status)}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/sites/edit/${id}`)}>
            Modifier
          </Button>
          <Button onClick={() => toast.success("Fonctionnalité à implémenter")}>
            Planifier une visite
          </Button>
        </div>
      </div>
      
      <div className="flex items-center text-muted-foreground">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{site.location}, {site.region}, {site.district}</span>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="visits">Visites</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="metrics">Indicateurs</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  Dernière visite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDate(site.lastVisitDate)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Par {site.visits[0]?.by || "N/A"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-500" />
                  Responsable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {site.manager}
                </div>
                <p className="text-xs text-muted-foreground">
                  Coordinateur de suivi
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  Progression des visites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {site.visitCount}/{site.sitesToVisit}
                </div>
                <Progress 
                  value={(site.visitCount / site.sitesToVisit) * 100} 
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{site.description}</p>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-2 gap-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Date de création:</span>
                </div>
                <div>
                  <span className="text-sm">{formatDate(site.createdAt)}</span>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Priorité de suivi:</span>
                </div>
                <div>
                  <Badge className={
                    site.monitoringPriority === 'high' ? "bg-red-500" :
                    site.monitoringPriority === 'medium' ? "bg-yellow-500" : 
                    "bg-green-500"
                  }>
                    {site.monitoringPriority === 'high' ? "Haute" : 
                     site.monitoringPriority === 'medium' ? "Moyenne" : 
                     "Basse"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activités en cours</CardTitle>
              <CardDescription>Les activités actuellement en cours sur ce site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {site.activities
                  .filter(activity => activity.status === 'in_progress')
                  .map((activity, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{activity.name}</h4>
                        <span className="text-sm">{activity.progress}%</span>
                      </div>
                      <Progress 
                        value={activity.progress} 
                        className={`h-2 ${getProgressColor(activity.progress)}`} 
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Début: {formatDate(activity.startDate)}</span>
                        <span>Fin prévue: {formatDate(activity.endDate)}</span>
                      </div>
                    </div>
                  ))}
                  
                {site.activities.filter(activity => activity.status === 'in_progress').length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune activité en cours actuellement
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="visits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visites planifiées</CardTitle>
              <CardDescription>Prochaines visites prévues pour ce site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {site.upcomingVisits.map((visit, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{formatDate(visit.date)}</div>
                      <div className="text-sm text-muted-foreground">{visit.purpose}</div>
                      <div className="text-xs text-muted-foreground">Par: {visit.by}</div>
                    </div>
                    <Badge className="bg-blue-500">Planifiée</Badge>
                  </div>
                ))}
                
                {site.upcomingVisits.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune visite planifiée
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Historique des visites</CardTitle>
              <CardDescription>Visites précédentes effectuées sur ce site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {site.visits.map((visit, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{formatDate(visit.date)}</div>
                      <div className="text-sm text-muted-foreground">{visit.report}</div>
                      <div className="text-xs text-muted-foreground">Par: {visit.by}</div>
                    </div>
                    <Badge className="bg-green-500">Complétée</Badge>
                  </div>
                ))}
                
                {site.visits.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune visite enregistrée
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les activités</CardTitle>
              <CardDescription>Activités passées, en cours et planifiées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {site.activities.map((activity, index) => (
                  <div key={index} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{activity.name}</h4>
                      <Badge className={
                        activity.status === 'completed' ? "bg-green-500" :
                        activity.status === 'in_progress' ? "bg-blue-500" :
                        "bg-yellow-500"
                      }>
                        {activity.status === 'completed' ? "Terminée" :
                         activity.status === 'in_progress' ? "En cours" :
                         "Planifiée"}
                      </Badge>
                    </div>
                    
                    <Progress 
                      value={activity.progress} 
                      className={`h-2 ${getProgressColor(activity.progress)}`} 
                    />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Début: {formatDate(activity.startDate)}</span>
                      <span>Fin prévue: {formatDate(activity.endDate)}</span>
                    </div>
                    
                    <div className="text-right text-sm">
                      {activity.progress}% complété
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Indicateurs clés</CardTitle>
              <CardDescription>Métriques de performance et objectifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {site.metrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{metric.name}</h4>
                      <span className="text-sm">
                        {metric.value} / {metric.target} {metric.unit}
                      </span>
                    </div>
                    <Progress 
                      value={(metric.value / metric.target) * 100} 
                      className={`h-2 ${getProgressColor((metric.value / metric.target) * 100)}`}
                    />
                    <div className="text-right text-sm">
                      {Math.round((metric.value / metric.target) * 100)}% de l'objectif
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contacts du site</CardTitle>
              <CardDescription>Personnes à contacter pour ce site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {site.contacts.map((contact, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">{contact.role}</div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="text-muted-foreground">Téléphone:</div>
                      <div>{contact.phone}</div>
                      <div className="text-muted-foreground">Email:</div>
                      <div>{contact.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteDetails;
