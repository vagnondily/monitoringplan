
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileUp, BarChart, PieChart, Download, RefreshCw, Filter, Code, FileCode, Database, FileSpreadsheet, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FileUploader from '@/components/data/FileUploader';
import {
  LineChart, Line, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Données fictives pour l'exemple
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

// Données fictives pour les projets importés
const importedProjects = [
  { id: 'PM001', name: 'Suivi nutritionnel région Nord', type: 'Process Monitoring', lastUpdate: '2025-04-08', records: 1243, status: 'Actif' },
  { id: 'OM002', name: 'Indicateurs agricoles Q1 2025', type: 'Outcomes Monitoring', lastUpdate: '2025-04-05', records: 568, status: 'Actif' },
  { id: 'PM003', name: 'Distribution alimentaire région Sud', type: 'Process Monitoring', lastUpdate: '2025-03-30', records: 892, status: 'Inactif' },
  { id: 'OD004', name: 'Données démographiques 2025', type: 'Other Data', lastUpdate: '2025-04-01', records: 2105, status: 'Actif' },
  { id: 'OM005', name: 'Évaluation éducation Q1 2025', type: 'Outcomes Monitoring', lastUpdate: '2025-03-25', records: 412, status: 'Actif' },
];

// Données fictives pour les scripts R disponibles
const availableScripts = [
  { id: 1, name: 'Analyse de corrélation', description: 'Étudie les relations entre différentes variables', category: 'Statistique' },
  { id: 2, name: 'Clustering des bénéficiaires', description: 'Regroupement des bénéficiaires par profils similaires', category: 'Machine Learning' },
  { id: 3, name: 'Analyse de tendances', description: 'Étude des évolutions temporelles des indicateurs', category: 'Statistique' },
  { id: 4, name: 'Prédiction des besoins futurs', description: 'Modèle prédictif basé sur les données historiques', category: 'Machine Learning' },
];

const ActualData = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastUpdate, setLastUpdate] = useState('2025-04-09T08:30:00Z');
  const [dataCategory, setDataCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScript, setSelectedScript] = useState<number | null>(null);
  const [analysisTab, setAnalysisTab] = useState('data');
  const [isScriptRunning, setIsScriptRunning] = useState(false);

  const handleRefresh = () => {
    setLastUpdate(new Date().toISOString());
  };

  const filteredProjects = importedProjects.filter(project => {
    const matchesCategory = dataCategory === 'all' || project.type === dataCategory;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         project.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRunScript = () => {
    if (selectedScript) {
      setIsScriptRunning(true);
      // Simuler l'exécution d'un script R
      setTimeout(() => {
        setIsScriptRunning(false);
        setAnalysisTab('results');
      }, 3000);
    }
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" /> Tableau de bord
          </TabsTrigger>
          <TabsTrigger value="imported_data" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Données importées
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" /> Analyse des données
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" /> Résultats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-8">
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
              <Tabs defaultValue="dashboard" className="w-full">
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
                title="Importer des données"
                description="Formats acceptés: Excel et CSV. Taille maximale: 10 MB."
                acceptedFileTypes=".xlsx,.xls,.csv"
                maxSize={10}
                onFileUpload={(file) => console.log("File uploaded:", file)}
                templateAvailable={true}
                onTemplateDownload={() => console.log("Template download requested")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imported_data" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Données importées</CardTitle>
                  <CardDescription>
                    Visualisez et gérez les données importées par catégorie
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter la sélection
                  </Button>
                  <Button size="sm">
                    <FileUp className="mr-2 h-4 w-4" />
                    Importer de nouvelles données
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-64">
                    <Select value={dataCategory} onValueChange={setDataCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les catégories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        <SelectItem value="Process Monitoring">Process Monitoring</SelectItem>
                        <SelectItem value="Outcomes Monitoring">Outcomes Monitoring</SelectItem>
                        <SelectItem value="Other Data">Other Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-64">
                    <Input 
                      placeholder="Rechercher par nom ou ID..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtres avancés
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">ID</TableHead>
                      <TableHead>Nom du projet</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Dernière mise à jour</TableHead>
                      <TableHead className="text-right">Enregistrements</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          Aucune donnée trouvée pour cette recherche
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.id}</TableCell>
                          <TableCell>{project.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              project.type === 'Process Monitoring' ? 'bg-blue-50 text-blue-700 border-blue-300' : 
                              project.type === 'Outcomes Monitoring' ? 'bg-green-50 text-green-700 border-green-300' : 
                              'bg-purple-50 text-purple-700 border-purple-300'
                            }>
                              {project.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(project.lastUpdate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">{project.records.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={project.status === 'Actif' ? 'default' : 'secondary'}>
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <FileSpreadsheet className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <BarChart className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <SlidersHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Affichage de {filteredProjects.length} projets sur {importedProjects.length} au total
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Précédent</Button>
                <Button variant="outline" size="sm" disabled>Suivant</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Analyse des données</CardTitle>
                  <CardDescription>
                    Utilisez des scripts R pour analyser vos données importées
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={analysisTab} onValueChange={setAnalysisTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="data">Sélection des données</TabsTrigger>
                  <TabsTrigger value="script">Scripts R</TabsTrigger>
                  <TabsTrigger value="params">Paramètres</TabsTrigger>
                  <TabsTrigger value="results">Résultats</TabsTrigger>
                </TabsList>

                <TabsContent value="data" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Sources de données</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Sélectionner des projets:</label>
                            <div className="space-y-2">
                              {importedProjects.map(project => (
                                <div key={project.id} className="flex items-center space-x-2">
                                  <input type="checkbox" id={`project-${project.id}`} className="h-4 w-4 rounded border-gray-300" />
                                  <label htmlFor={`project-${project.id}`} className="text-sm">
                                    {project.name} <span className="text-muted-foreground">({project.type})</span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Options de fusion</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Méthode de fusion:</label>
                            <Select defaultValue="inner">
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une méthode" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="inner">Inner Join</SelectItem>
                                <SelectItem value="left">Left Join</SelectItem>
                                <SelectItem value="right">Right Join</SelectItem>
                                <SelectItem value="full">Full Join</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Clé de fusion:</label>
                            <Select defaultValue="id">
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une clé" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="id">ID</SelectItem>
                                <SelectItem value="region">Région</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="beneficiary">Bénéficiaire</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => setAnalysisTab('script')}>
                      Continuer
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="script" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Scripts disponibles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {availableScripts.map(script => (
                            <div
                              key={script.id}
                              className={`p-3 border rounded-md cursor-pointer ${selectedScript === script.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : ''}`}
                              onClick={() => setSelectedScript(script.id)}
                            >
                              <div className="flex justify-between">
                                <h4 className="font-medium">{script.name}</h4>
                                <Badge variant="outline">{script.category}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{script.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Détails du script</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedScript ? (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">{availableScripts.find(s => s.id === selectedScript)?.name}</h4>
                              <p className="text-sm">
                                {availableScripts.find(s => s.id === selectedScript)?.description}
                              </p>
                            </div>
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-2">Paramètres requis</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm">Niveau de confiance</label>
                                  <Input type="number" defaultValue="0.95" />
                                </div>
                                <div>
                                  <label className="text-sm">Variables à inclure</label>
                                  <Select defaultValue="all">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionnez les variables" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">Toutes les variables</SelectItem>
                                      <SelectItem value="numeric">Variables numériques uniquement</SelectItem>
                                      <SelectItem value="categorical">Variables catégorielles uniquement</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <Code className="h-10 w-10 mb-2" />
                            <p>Sélectionnez un script pour voir les détails</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAnalysisTab('data')}>
                      Retour
                    </Button>
                    <Button onClick={() => setAnalysisTab('params')} disabled={!selectedScript}>
                      Continuer
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="params" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Paramètres de l'analyse</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Format de sortie:</label>
                            <Select defaultValue="interactive">
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Sélectionnez un format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="interactive">Visualisations interactives</SelectItem>
                                <SelectItem value="static">Graphiques statiques</SelectItem>
                                <SelectItem value="table">Tableaux de données</SelectItem>
                                <SelectItem value="report">Rapport complet</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Niveau de détail:</label>
                            <Select defaultValue="medium">
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Sélectionnez un niveau" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Basique</SelectItem>
                                <SelectItem value="medium">Standard</SelectItem>
                                <SelectItem value="high">Détaillé</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Options avancées:</label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="option1" className="h-4 w-4 rounded border-gray-300" />
                              <label htmlFor="option1" className="text-sm">Inclure des tests statistiques supplémentaires</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="option2" className="h-4 w-4 rounded border-gray-300" />
                              <label htmlFor="option2" className="text-sm">Générer des modèles prédictifs</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="option3" className="h-4 w-4 rounded border-gray-300" />
                              <label htmlFor="option3" className="text-sm">Exporter les résultats bruts</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAnalysisTab('script')}>
                      Retour
                    </Button>
                    <Button onClick={handleRunScript} disabled={!selectedScript}>
                      {isScriptRunning ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Exécution en cours...
                        </>
                      ) : (
                        <>
                          <Code className="mr-2 h-4 w-4" />
                          Exécuter le script
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="results" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Résultats de l'analyse</CardTitle>
                          <CardDescription>
                            Analyse complétée le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Exporter
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Rapport
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Résumé de l'analyse</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <Card className="bg-blue-50 dark:bg-blue-950">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Corrélation moyenne</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">0.72</div>
                              <p className="text-xs text-muted-foreground">
                                Entre les principales variables
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="bg-green-50 dark:bg-green-950">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Niveau de confiance</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">95%</div>
                              <p className="text-xs text-muted-foreground">
                                Pour les résultats obtenus
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="bg-purple-50 dark:bg-purple-950">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Variables analysées</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">42</div>
                              <p className="text-xs text-muted-foreground">
                                Sur un total de 58 variables
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-4">Visualisation des résultats</h3>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Matrice de corrélation</h4>
                            <div className="aspect-square bg-slate-100 rounded-md border flex items-center justify-center">
                              <BarChart className="h-10 w-10 text-muted-foreground" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Distribution des variables principales</h4>
                            <div className="aspect-square bg-slate-100 rounded-md border flex items-center justify-center">
                              <PieChart className="h-10 w-10 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-4">Interprétation des résultats</h3>
                        <div className="space-y-4 text-sm">
                          <p>
                            L'analyse révèle une forte corrélation (r=0.72) entre les variables clés, indiquant une relation
                            significative entre les interventions réalisées et les résultats observés. Les tests statistiques
                            confirment ces résultats avec un niveau de confiance de 95%.
                          </p>
                          <p>
                            Les groupes de bénéficiaires montrent des tendances distinctes, avec les groupes de la région Nord
                            présentant des améliorations plus marquées (p&lt;0.01) par rapport aux autres régions. Les facteurs
                            principaux influençant ces résultats incluent la durée de l'intervention, le niveau de participation
                            communautaire, et l'accès aux services.
                          </p>
                          <p>
                            Les modèles prédictifs suggèrent qu'une augmentation de 10% dans la fréquence des visites de suivi
                            pourrait entraîner une amélioration de 15-20% des indicateurs de résultats, particulièrement dans
                            les domaines de la sécurité alimentaire et de la nutrition.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tableau de bord des résultats</CardTitle>
                  <CardDescription>
                    Visualisez les résultats intégrés de toutes vos analyses
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                  <Button>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Rapport complet
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-4 gap-4">
                <Card className="bg-blue-50 dark:bg-blue-950">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Analyses complétées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">
                      +3 ce mois-ci
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 dark:bg-green-950">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Taux de confiance moyen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">93%</div>
                    <p className="text-xs text-muted-foreground">
                      Pour toutes les analyses
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50 dark:bg-amber-950">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Variables analysées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">158</div>
                    <p className="text-xs text-muted-foreground">
                      Across 18 datasets
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 dark:bg-purple-950">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Tendances identifiées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">28</div>
                    <p className="text-xs text-muted-foreground">
                      15 positives, 13 négatives
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Résultats consolidés</h3>
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Évolution des indicateurs clés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md">
                        <BarChart className="h-10 w-10 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Distribution par région</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md">
                        <PieChart className="h-10 w-10 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Recommandations basées sur les analyses</h3>
                <div className="space-y-4">
                  <div className="border p-4 rounded-md">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <BarChart className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-medium">Amélioration du suivi nutritionnel</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Augmenter la fréquence des visites de suivi nutritionnel à au moins une fois par mois pour les ménages à risque élevé pourrait améliorer les indicateurs de malnutrition de 15-20%.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border p-4 rounded-md">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <PieChart className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-medium">Ciblage des interventions</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Les analyses montrent que concentrer les ressources sur les 3 régions du Nord avec une approche intégrée (combinant sécurité alimentaire, nutrition et éducation) pourrait maximiser l'impact global du programme.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border p-4 rounded-md">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <BarChart className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <h4 className="font-medium">Renforcement des formations</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Les données indiquent qu'étendre les programmes de formation aux pratiques agricoles améliorées à 50% supplémentaires de bénéficiaires pourrait augmenter la production agricole de 30-35% dans les 12 prochains mois.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActualData;
