
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileUp, BarChart, PieChart, Download, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FileUploader from '@/components/data/FileUploader';
import {
  LineChart, Line, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';

// Mock data for charts
const activityData = [
  { month: 'Jan', planned: 45, completed: 38 },
  { month: 'Feb', planned: 52, completed: 48 },
  { month: 'Mar', planned: 48, completed: 45 },
  { month: 'Apr', planned: 56, completed: 51 },
  { month: 'May', planned: 62, completed: 55 },
  { month: 'Jun', planned: 58, completed: 49 },
];

const outcomeData = [
  { name: 'Food Security', value: 68 },
  { name: 'Nutrition', value: 72 },
  { name: 'Resilience', value: 55 },
  { name: 'Education', value: 83 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const beneficiaryData = [
  { category: 'Enfants', hommes: 1200, femmes: 1350 },
  { category: 'Adultes', hommes: 2800, femmes: 3100 },
  { category: 'Personnes âgées', hommes: 750, femmes: 920 },
];

const ActualData = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastUpdate, setLastUpdate] = useState('2025-04-09T08:30:00Z');

  const handleRefresh = () => {
    setLastUpdate(new Date().toISOString());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Données actuelles</h1>
          <p className="text-muted-foreground">
            Consultez et analysez les données actuelles des activités de terrain
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <FileUp className="mr-2 h-4 w-4" />
            Importer des données
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sites actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <p className="text-xs text-muted-foreground">
              +12% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Activités planifiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62</div>
            <p className="text-xs text-muted-foreground">
              Pour le mois en cours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Activités complétées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">49</div>
            <p className="text-xs text-muted-foreground">
              79% du plan mensuel
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bénéficiaires atteints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,873</div>
            <p className="text-xs text-muted-foreground">
              +5% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-t-4 border-t-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aperçu des données actuelles</CardTitle>
              <CardDescription>
                Dernière mise à jour : {new Date(lastUpdate).toLocaleString()}
              </CardDescription>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              Avril 2025
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-8">
              <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
              <TabsTrigger value="activities">Activités</TabsTrigger>
              <TabsTrigger value="outcomes">Résultats</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Progression des activités</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="planned" stroke="#8884d8" name="Activités planifiées" />
                    <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Activités complétées" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Résultats par secteur</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={outcomeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {outcomeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Bénéficiaires par catégorie</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ReBarChart data={beneficiaryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hommes" fill="#8884d8" name="Hommes" />
                      <Bar dataKey="femmes" fill="#82ca9d" name="Femmes" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activities">
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <Card className="bg-blue-50 dark:bg-blue-950">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Taux d'achèvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">79%</div>
                      <p className="text-xs text-muted-foreground">
                        Objectif: 85%
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 dark:bg-green-950">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Respect du calendrier</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-xs text-muted-foreground">
                        Objectif: 90%
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50 dark:bg-amber-950">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Problèmes signalés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">7</div>
                      <p className="text-xs text-muted-foreground">
                        -3 depuis le mois dernier
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="text-lg font-medium mb-4">Activités par région</h3>
                <div className="h-[400px] border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center justify-center h-full">
                    <BarChart className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Carte des activités à implémenter</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="outcomes">
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Indicateurs de résultats</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <Card className="bg-green-50 dark:bg-green-950">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Sécurité alimentaire</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">68%</div>
                      <p className="text-xs text-muted-foreground">
                        +8% par rapport à la base de référence
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50 dark:bg-amber-950">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Nutrition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">72%</div>
                      <p className="text-xs text-muted-foreground">
                        +12% par rapport à la base de référence
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 dark:bg-blue-950">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Résilience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">55%</div>
                      <p className="text-xs text-muted-foreground">
                        +5% par rapport à la base de référence
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 dark:bg-purple-950">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Éducation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">83%</div>
                      <p className="text-xs text-muted-foreground">
                        +15% par rapport à la base de référence
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="text-lg font-medium mb-4">Analyse des résultats</h3>
                <div className="border rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Principales réalisations</h4>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        <li>Augmentation de 12% de l'accès à la nourriture dans les zones cibles</li>
                        <li>Réduction de 8% de la malnutrition chez les enfants de moins de 5 ans</li>
                        <li>Amélioration de 15% des taux de scolarisation dans les communautés cibles</li>
                        <li>Formation de 1,243 bénéficiaires aux pratiques agricoles améliorées</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium">Défis et contraintes</h4>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        <li>Instabilité sécuritaire dans certaines zones d'intervention</li>
                        <li>Retards dans la livraison des intrants pour certaines activités</li>
                        <li>Faible participation communautaire dans la région sud</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Importer des données actuelles</CardTitle>
          <CardDescription>
            Téléversez des fichiers Excel ou CSV contenant les données actuelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader
            acceptedFileTypes=".xlsx,.xls,.csv"
            maxFileSizeMB={10}
            description="Formats acceptés: Excel et CSV. Taille maximale: 10 MB."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ActualData;
