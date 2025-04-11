
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, LineChart, PieChart, AreaChart, Bar, Line, Pie, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  BarChart2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  AreaChart as AreaChartIcon,
  Table as TableIcon,
  FileText,
  Layout,
  Calculator,
  Database,
  FileInput,
  ImageIcon,
  Save,
  Download,
  Plus,
  Trash2,
  Copy,
  Settings,
  ChevronDown,
  EyeIcon,
  LayoutDashboard,
  FormInput,
  ArrowUpDown,
  Sparkles,
  Filter,
  FileSpreadsheet,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';

// Données d'exemple pour les graphiques
const sampleChartData = [
  { month: 'Jan', tonnage: 400, beneficiaries: 2400, fcs: 75 },
  { month: 'Feb', tonnage: 300, beneficiaries: 1398, fcs: 68 },
  { month: 'Mar', tonnage: 200, beneficiaries: 9800, fcs: 80 },
  { month: 'Apr', tonnage: 278, beneficiaries: 3908, fcs: 72 },
  { month: 'May', tonnage: 189, beneficiaries: 4800, fcs: 76 },
  { month: 'Jun', tonnage: 239, beneficiaries: 3800, fcs: 82 }
];

const samplePieData = [
  { name: 'SAVA', value: 400 },
  { name: 'DIANA', value: 300 },
  { name: 'SOFIA', value: 300 },
  { name: 'BOENY', value: 200 }
];

// Configuration par défaut des blocs de rapport
const defaultComponentConfig = {
  chart: { type: 'bar', dataSource: 'foundry', title: 'Distribution par mois' },
  table: { columns: [], dataSource: 'odk', title: 'Données de suivi' },
  text: { content: '', title: 'Section de texte' },
  kpi: { formula: '', title: 'Indicateur clé', format: 'number' }
};

const ReportBuilder = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [reportTitle, setReportTitle] = useState('Rapport de mission');
  const [reportComponents, setReportComponents] = useState<any[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState('');
  const [filters, setFilters] = useState({
    missionary: '',
    region: 'SAVA',
    dateFrom: '',
    dateTo: '',
    missionType: ''
  });
  const [currentComponentConfig, setCurrentComponentConfig] = useState<any>(null);
  const [editingComponentIndex, setEditingComponentIndex] = useState<number | null>(null);

  // Ajouter un nouveau composant au rapport
  const handleAddComponent = (type: string) => {
    const newComponent = {
      id: `component-${Date.now()}`,
      type,
      ...defaultComponentConfig[type as keyof typeof defaultComponentConfig]
    };
    setReportComponents([...reportComponents, newComponent]);
    setCurrentComponentConfig(newComponent);
    setEditingComponentIndex(reportComponents.length);
    toast.success(`Nouveau bloc ${type} ajouté au rapport`);
  };

  // Supprimer un composant
  const handleDeleteComponent = (index: number) => {
    const updatedComponents = [...reportComponents];
    updatedComponents.splice(index, 1);
    setReportComponents(updatedComponents);
    setCurrentComponentConfig(null);
    setEditingComponentIndex(null);
    toast.success('Composant supprimé du rapport');
  };

  // Sélectionner un composant pour édition
  const handleSelectComponent = (component: any, index: number) => {
    setCurrentComponentConfig({ ...component });
    setEditingComponentIndex(index);
  };

  // Mettre à jour la configuration d'un composant
  const handleUpdateComponent = () => {
    if (editingComponentIndex !== null && currentComponentConfig) {
      const updatedComponents = [...reportComponents];
      updatedComponents[editingComponentIndex] = { ...currentComponentConfig };
      setReportComponents(updatedComponents);
      toast.success('Configuration du composant mise à jour');
    }
  };

  // Générer le rapport final
  const handleGenerateReport = () => {
    toast.success('Génération du rapport en cours...');
    setTimeout(() => {
      toast.success('Rapport généré avec succès');
    }, 1500);
  };

  // Rendu d'un composant de rapport en fonction de son type
  const renderReportComponent = (component: any) => {
    switch (component.type) {
      case 'chart':
        return renderChartComponent(component);
      case 'table':
        return renderTableComponent(component);
      case 'text':
        return renderTextComponent(component);
      case 'kpi':
        return renderKpiComponent(component);
      default:
        return null;
    }
  };

  // Rendu d'un composant de type graphique
  const renderChartComponent = (component: any) => {
    const ChartType = component.type === 'bar' ? BarChart : 
                    component.type === 'line' ? LineChart :
                    component.type === 'area' ? AreaChart : PieChart;
    
    const DataElement = component.type === 'bar' ? Bar : 
                      component.type === 'line' ? Line :
                      component.type === 'area' ? Area : Pie;

    const data = component.type === 'pie' ? samplePieData : sampleChartData;

    if (component.type === 'pie') {
      return (
        <div className="h-64">
          <h3 className="text-md font-medium mb-2">{component.title}</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <div className="h-64">
        <h3 className="text-md font-medium mb-2">{component.title}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ChartType data={sampleChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {component.type === 'bar' && <Bar dataKey="tonnage" fill="#8884d8" />}
            {component.type === 'line' && <Line type="monotone" dataKey="fcs" stroke="#8884d8" />}
            {component.type === 'area' && <Area type="monotone" dataKey="beneficiaries" fill="#8884d8" stroke="#8884d8" />}
          </ChartType>
        </ResponsiveContainer>
      </div>
    );
  };

  // Rendu d'un composant de type tableau
  const renderTableComponent = (component: any) => {
    return (
      <div>
        <h3 className="text-md font-medium mb-2">{component.title}</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Région</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tonnage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bénéficiaires</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score FCS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/03/2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SAVA</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.floor(Math.random() * 500)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.floor(Math.random() * 5000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.floor(65 + Math.random() * 20)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Rendu d'un composant de type texte
  const renderTextComponent = (component: any) => {
    return (
      <div>
        <h3 className="text-md font-medium mb-2">{component.title}</h3>
        <div className="bg-gray-50 p-4 rounded-md min-h-20">
          {component.content ? (
            <p>{component.content}</p>
          ) : (
            <p className="text-gray-400 italic">Contenu de la section textuelle...</p>
          )}
        </div>
      </div>
    );
  };

  // Rendu d'un composant de type KPI
  const renderKpiComponent = (component: any) => {
    return (
      <div className="bg-white p-4 rounded-md border">
        <h3 className="text-sm font-medium text-gray-500">{component.title}</h3>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-3xl font-bold">
            {component.formula === 'tonnage' ? '1,406' : 
             component.formula === 'beneficiaries' ? '22,306' : 
             component.formula === 'fcs' ? '76.5%' : '84%'}
          </span>
          <span className="text-sm text-green-500 pb-1">+12.3%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ReportBuilder Pro</h1>
          <p className="text-muted-foreground">
            Créez et configurez des rapports dynamiques avec des données en temps réel
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success('Modèle sauvegardé')}>
            <Save className="mr-2 h-4 w-4" /> Sauvegarder
          </Button>
          <Button onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" /> Générer le rapport
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Layout className="h-4 w-4" /> Conception
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Sources de données
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <EyeIcon className="h-4 w-4" /> Aperçu
          </TabsTrigger>
        </TabsList>

        {/* Onglet de conception */}
        <TabsContent value="design" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Panneau de composants */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Composants</CardTitle>
                <CardDescription>
                  Faites glisser ou cliquez pour ajouter des éléments à votre rapport
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium mb-2">Visualisations</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col justify-center px-2"
                    onClick={() => handleAddComponent('chart')}
                  >
                    <BarChart2 className="h-6 w-6 mb-1" />
                    <span className="text-xs">Graphique</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col justify-center px-2"
                    onClick={() => handleAddComponent('table')}
                  >
                    <TableIcon className="h-6 w-6 mb-1" />
                    <span className="text-xs">Tableau</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col justify-center px-2"
                    onClick={() => handleAddComponent('kpi')}
                  >
                    <Calculator className="h-6 w-6 mb-1" />
                    <span className="text-xs">Indicateur</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col justify-center px-2"
                    onClick={() => handleAddComponent('text')}
                  >
                    <FileText className="h-6 w-6 mb-1" />
                    <span className="text-xs">Texte</span>
                  </Button>
                </div>

                <Separator className="my-4" />

                <p className="text-sm font-medium mb-2">Blocs prédéfinis</p>
                <div className="space-y-2">
                  <div 
                    className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      handleAddComponent('chart');
                      toast.success('Bloc prédéfini ajouté');
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <LineChartIcon className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Évolution des FCS</span>
                    </div>
                    <Plus className="h-4 w-4" />
                  </div>
                  <div 
                    className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      handleAddComponent('kpi');
                      toast.success('Bloc prédéfini ajouté');
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Taux de couverture</span>
                    </div>
                    <Plus className="h-4 w-4" />
                  </div>
                  <div 
                    className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      handleAddComponent('table');
                      toast.success('Bloc prédéfini ajouté');
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <TableIcon className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Tableau de suivi</span>
                    </div>
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Zone de conception */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle>Canevas du rapport</CardTitle>
                      <CardDescription>
                        Ajoutez, organisez et configurez les composants de votre rapport
                      </CardDescription>
                    </div>
                    <Input 
                      className="max-w-[200px]" 
                      value={reportTitle} 
                      onChange={(e) => setReportTitle(e.target.value)}
                      placeholder="Titre du rapport"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 min-h-[500px] bg-gray-50 p-4 rounded-md border border-dashed">
                    {reportComponents.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <Layout className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium mb-1">Votre rapport est vide</h3>
                        <p className="text-muted-foreground mb-4 max-w-md">
                          Ajoutez des graphiques, tableaux, indicateurs et sections de texte depuis le panneau des composants.
                        </p>
                        <div className="flex gap-2">
                          <Button onClick={() => handleAddComponent('chart')}>
                            <Plus className="h-4 w-4 mr-2" /> Ajouter un graphique
                          </Button>
                          <Button variant="outline" onClick={() => handleAddComponent('text')}>
                            <Plus className="h-4 w-4 mr-2" /> Ajouter du texte
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reportComponents.map((component, index) => (
                          <div 
                            key={component.id}
                            className={`bg-white p-4 rounded-md border ${editingComponentIndex === index ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                            onClick={() => handleSelectComponent(component, index)}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                {component.type === 'chart' && <BarChart2 className="h-4 w-4" />}
                                {component.type === 'table' && <TableIcon className="h-4 w-4" />}
                                {component.type === 'text' && <FileText className="h-4 w-4" />}
                                {component.type === 'kpi' && <Calculator className="h-4 w-4" />}
                                <span className="font-medium">{component.title}</span>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteComponent(index);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {renderReportComponent(component)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panneau de configuration */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>
                  {currentComponentConfig 
                    ? `Configurer le bloc "${currentComponentConfig.title}"`
                    : 'Sélectionnez un composant pour le configurer'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!currentComponentConfig ? (
                  <div className="text-center py-8">
                    <Settings className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Cliquez sur un composant dans le canevas pour le configurer
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="component-title">Titre du composant</Label>
                      <Input 
                        id="component-title" 
                        value={currentComponentConfig.title || ''}
                        onChange={(e) => setCurrentComponentConfig({
                          ...currentComponentConfig,
                          title: e.target.value
                        })}
                      />
                    </div>

                    {currentComponentConfig.type === 'chart' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="chart-type">Type de graphique</Label>
                          <Select 
                            value={currentComponentConfig.type} 
                            onValueChange={(value) => setCurrentComponentConfig({
                              ...currentComponentConfig,
                              type: value
                            })}
                          >
                            <SelectTrigger id="chart-type">
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bar">Barres</SelectItem>
                              <SelectItem value="line">Lignes</SelectItem>
                              <SelectItem value="area">Aire</SelectItem>
                              <SelectItem value="pie">Camembert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="chart-data">Source de données</Label>
                          <Select 
                            value={currentComponentConfig.dataSource} 
                            onValueChange={(value) => setCurrentComponentConfig({
                              ...currentComponentConfig,
                              dataSource: value
                            })}
                          >
                            <SelectTrigger id="chart-data">
                              <SelectValue placeholder="Sélectionner une source" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="foundry">Foundry</SelectItem>
                              <SelectItem value="odk">ODK Central</SelectItem>
                              <SelectItem value="excel">Fichier Excel</SelectItem>
                              <SelectItem value="api">API externe</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Configuration des axes</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="x-axis" className="text-xs">Axe X</Label>
                              <Select defaultValue="month">
                                <SelectTrigger id="x-axis">
                                  <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="month">Mois</SelectItem>
                                  <SelectItem value="region">Région</SelectItem>
                                  <SelectItem value="date">Date</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="y-axis" className="text-xs">Axe Y</Label>
                              <Select defaultValue="tonnage">
                                <SelectTrigger id="y-axis">
                                  <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="tonnage">Tonnage</SelectItem>
                                  <SelectItem value="beneficiaries">Bénéficiaires</SelectItem>
                                  <SelectItem value="fcs">Score FCS</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {currentComponentConfig.type === 'table' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="table-data">Source de données</Label>
                          <Select 
                            value={currentComponentConfig.dataSource} 
                            onValueChange={(value) => setCurrentComponentConfig({
                              ...currentComponentConfig,
                              dataSource: value
                            })}
                          >
                            <SelectTrigger id="table-data">
                              <SelectValue placeholder="Sélectionner une source" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="foundry">Foundry</SelectItem>
                              <SelectItem value="odk">ODK Central</SelectItem>
                              <SelectItem value="excel">Fichier Excel</SelectItem>
                              <SelectItem value="api">API externe</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Colonnes</Label>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <Plus className="h-3 w-3" /> Ajouter
                            </Button>
                          </div>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {['Date', 'Région', 'Tonnage', 'Bénéficiaires', 'Score FCS'].map((col, i) => (
                              <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                                <span>{col}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {currentComponentConfig.type === 'text' && (
                      <div className="space-y-2">
                        <Label htmlFor="text-content">Contenu</Label>
                        <Textarea 
                          id="text-content" 
                          value={currentComponentConfig.content || ''}
                          onChange={(e) => setCurrentComponentConfig({
                            ...currentComponentConfig,
                            content: e.target.value
                          })}
                          placeholder="Entrez le contenu de la section..."
                          className="min-h-[100px]"
                        />
                      </div>
                    )}

                    {currentComponentConfig.type === 'kpi' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="kpi-formula">Formule de calcul</Label>
                          <Select 
                            value={currentComponentConfig.formula} 
                            onValueChange={(value) => setCurrentComponentConfig({
                              ...currentComponentConfig,
                              formula: value
                            })}
                          >
                            <SelectTrigger id="kpi-formula">
                              <SelectValue placeholder="Sélectionner une formule" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tonnage">Total tonnage</SelectItem>
                              <SelectItem value="beneficiaries">Total bénéficiaires</SelectItem>
                              <SelectItem value="fcs">Moyenne FCS</SelectItem>
                              <SelectItem value="coverage">Taux de couverture</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="kpi-format">Format d'affichage</Label>
                          <Select 
                            value={currentComponentConfig.format || 'number'} 
                            onValueChange={(value) => setCurrentComponentConfig({
                              ...currentComponentConfig,
                              format: value
                            })}
                          >
                            <SelectTrigger id="kpi-format">
                              <SelectValue placeholder="Sélectionner un format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="number">Nombre</SelectItem>
                              <SelectItem value="percentage">Pourcentage</SelectItem>
                              <SelectItem value="currency">Monétaire</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    <Button 
                      className="w-full mt-4" 
                      onClick={handleUpdateComponent}
                    >
                      Appliquer les changements
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet sources de données */}
        <TabsContent value="data" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Sources de données</CardTitle>
                <CardDescription>
                  Configurer les sources de données disponibles pour le rapport
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter une source
                </Button>
                
                <div className="space-y-2">
                  <div className="border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Foundry</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Connecté</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Base de données des distributions alimentaires
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FormInput className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">ODK Central</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Connecté</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Données de suivi et évaluation
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Excel FCS</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Importé</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Données sur les scores de consommation alimentaire
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileInput className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">API DHIS2</span>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Non configuré</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Système d'information sanitaire
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Cartographie des données</CardTitle>
                <CardDescription>
                  Configurez comment les données de différentes sources sont combinées et transformées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Mapping de données</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="mb-2 block">Source</Label>
                        <Select defaultValue="foundry">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="foundry">Foundry</SelectItem>
                            <SelectItem value="odk">ODK Central</SelectItem>
                            <SelectItem value="excel">Excel FCS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Table / Formulaire</Label>
                        <Select defaultValue="distribution">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une table" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="distribution">Distribution</SelectItem>
                            <SelectItem value="beneficiaries">Bénéficiaires</SelectItem>
                            <SelectItem value="stock">Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Clé de jointure</Label>
                        <Select defaultValue="region">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une clé" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="region">Région</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="missionary">Missionnaire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="mb-2 block">Champs disponibles</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['date', 'region', 'district', 'missionary', 'tonnage', 'beneficiaries', 'food_type', 'delivery_status'].map((field, i) => (
                          <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                            <span>{field}</span>
                            <ChevronDown className="h-3 w-3" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Formules personnalisées</Label>
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <Sparkles className="h-3 w-3" /> Créer une formule
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="border rounded p-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Taux de couverture</span>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Formule</span>
                          </div>
                          <code className="text-xs block mt-1 p-2 bg-gray-100 rounded">
                            (SUM(tonnage_delivered) / SUM(tonnage_planned)) * 100
                          </code>
                        </div>
                        
                        <div className="border rounded p-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Indice de satisfaction</span>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Formule</span>
                          </div>
                          <code className="text-xs block mt-1 p-2 bg-gray-100 rounded">
                            AVG(satisfaction_score) WHERE region = ${filters.region}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet d'aperçu */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Aperçu du rapport</CardTitle>
                  <CardDescription>
                    Visualisez le rapport avec les données filtrées
                  </CardDescription>
                </div>
                <Button variant="outline" className="flex items-center gap-1">
                  <Download className="h-4 w-4" /> Exporter en PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 border rounded-md space-y-6">
                {/* Filtres globaux */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
                    <Filter className="h-4 w-4" /> Filtres globaux
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor="missionary-filter" className="text-xs">Missionnaire</Label>
                      <Select 
                        value={filters.missionary} 
                        onValueChange={(value) => setFilters({...filters, missionary: value})}
                      >
                        <SelectTrigger id="missionary-filter">
                          <SelectValue placeholder="Tous" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Tous</SelectItem>
                          <SelectItem value="jean">Jean Rakoto</SelectItem>
                          <SelectItem value="marie">Marie Andriamasy</SelectItem>
                          <SelectItem value="paul">Paul Razafy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="region-filter" className="text-xs">Région</Label>
                      <Select 
                        value={filters.region} 
                        onValueChange={(value) => setFilters({...filters, region: value})}
                      >
                        <SelectTrigger id="region-filter">
                          <SelectValue placeholder="Toutes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAVA">SAVA</SelectItem>
                          <SelectItem value="DIANA">DIANA</SelectItem>
                          <SelectItem value="SOFIA">SOFIA</SelectItem>
                          <SelectItem value="BOENY">BOENY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date-from" className="text-xs">Date début</Label>
                      <Input 
                        id="date-from" 
                        type="date" 
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="date-to" className="text-xs">Date fin</Label>
                      <Input 
                        id="date-to" 
                        type="date" 
                        value={filters.dateTo}
                        onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mission-type" className="text-xs">Type de mission</Label>
                      <Select 
                        value={filters.missionType} 
                        onValueChange={(value) => setFilters({...filters, missionType: value})}
                      >
                        <SelectTrigger id="mission-type">
                          <SelectValue placeholder="Tous" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Tous</SelectItem>
                          <SelectItem value="distribution">Distribution</SelectItem>
                          <SelectItem value="monitoring">Suivi</SelectItem>
                          <SelectItem value="evaluation">Évaluation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* En-tête du rapport */}
                <div className="text-center pb-6 border-b">
                  <h1 className="text-2xl font-bold mb-2">{reportTitle}</h1>
                  <div className="flex justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Région {filters.region || 'Toutes'}
                    </div>
                    <div>
                      Période: {filters.dateFrom ? filters.dateFrom : '01/03/2025'} - {filters.dateTo ? filters.dateTo : '31/03/2025'}
                    </div>
                    <div>
                      Missionnaire: {filters.missionary ? filters.missionary : 'Tous'}
                    </div>
                  </div>
                </div>
                
                {/* Contenu du rapport */}
                <div className="space-y-8">
                  {/* Résumé exécutif */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Résumé exécutif</h2>
                    <p className="text-gray-700 mb-4">
                      Ce rapport présente les activités et résultats des distributions alimentaires dans la région {filters.region || 'sélectionnée'} 
                      pour la période de mars 2025. Les interventions ont ciblé principalement les ménages vulnérables
                      et ont permis d'atteindre un total de 22,306 bénéficiaires avec 1,406 tonnes de vivres distribués.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-white p-4 rounded-md border">
                        <h3 className="text-sm font-medium text-gray-500">Total tonnage</h3>
                        <div className="mt-2 flex items-end gap-2">
                          <span className="text-3xl font-bold">1,406</span>
                          <span className="text-sm text-green-500 pb-1">+12.3%</span>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <h3 className="text-sm font-medium text-gray-500">Bénéficiaires</h3>
                        <div className="mt-2 flex items-end gap-2">
                          <span className="text-3xl font-bold">22,306</span>
                          <span className="text-sm text-green-500 pb-1">+8.5%</span>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <h3 className="text-sm font-medium text-gray-500">Score FCS moyen</h3>
                        <div className="mt-2 flex items-end gap-2">
                          <span className="text-3xl font-bold">76.5</span>
                          <span className="text-sm text-green-500 pb-1">+4.2%</span>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <h3 className="text-sm font-medium text-gray-500">Taux de couverture</h3>
                        <div className="mt-2 flex items-end gap-2">
                          <span className="text-3xl font-bold">84%</span>
                          <span className="text-sm text-red-500 pb-1">-2.1%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section graphiques */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Analyse des distributions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-md border">
                        <h3 className="text-md font-medium mb-2">Distribution par région</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={samplePieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                              />
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <h3 className="text-md font-medium mb-2">Évolution du score FCS</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sampleChartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="fcs" stroke="#8884d8" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section tableau */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Données détaillées</h2>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Région</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tonnage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bénéficiaires</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score FCS</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {[1, 2, 3, 4, 5].map((row) => (
                            <tr key={row} className={filters.region && Math.random() > 0.5 ? "bg-blue-50" : ""}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {`0${row}/03/2025`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {row % 2 === 0 ? filters.region || "SAVA" : row % 3 === 0 ? "DIANA" : "SOFIA"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {Math.floor(Math.random() * 500)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {Math.floor(Math.random() * 5000)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {Math.floor(65 + Math.random() * 20)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Section commentaires */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Observations et recommandations</h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-700 mb-4">
                        Les distributions dans la région {filters.region || 'SAVA'} se sont généralement bien déroulées, avec un taux de couverture de 84%. 
                        Les scores FCS montrent une amélioration graduelle, indiquant un impact positif des interventions sur la sécurité alimentaire des ménages.
                      </p>
                      <p className="text-gray-700">
                        <strong>Recommandations:</strong>
                      </p>
                      <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li>Augmenter la fréquence des distributions dans les zones à faible score FCS</li>
                        <li>Améliorer la coordination avec les autorités locales pour optimiser la logistique</li>
                        <li>Renforcer le suivi post-distribution pour mieux évaluer l'impact</li>
                      </ul>
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

export default ReportBuilder;
