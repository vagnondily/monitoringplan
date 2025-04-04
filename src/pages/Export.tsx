
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { siteService, projectService } from '@/services/dataService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DownloadCloud, FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const Export = () => {
  const exportSitesMutation = useMutation({
    mutationFn: siteService.exportToExcel
  });

  const handleExportSites = () => {
    exportSitesMutation.mutate();
  };

  const handleExportProjects = () => {
    // Simulation d'exportation
    toast.success('Projets exportés avec succès');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Exporter des données</h1>
      <p className="text-gray-600">
        Exportez des données au format Excel pour les utiliser hors ligne ou dans d'autres applications.
      </p>

      <Tabs defaultValue="sites">
        <TabsList>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="projects">Projets</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sites" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Exporter la liste des sites</CardTitle>
              <CardDescription>
                Exportez la liste complète des sites au format Excel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Options d'exportation</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sitesAll" checked />
                      <label
                        htmlFor="sitesAll"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Exporter tous les sites
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sitesActive" />
                      <label
                        htmlFor="sitesActive"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Exporter uniquement les sites actifs
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sitesWithProjects" />
                      <label
                        htmlFor="sitesWithProjects"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Inclure les projets associés
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exportFormat">Format d'exportation</Label>
                  <Select defaultValue="xlsx">
                    <SelectTrigger id="exportFormat">
                      <SelectValue placeholder="Sélectionner un format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="xls">Excel 97-2003 (XLS)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="bg-app-blue hover:bg-app-lightBlue mt-4 w-full sm:w-auto"
                  onClick={handleExportSites}
                  disabled={exportSitesMutation.isPending}
                >
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  {exportSitesMutation.isPending ? 'Exportation en cours...' : 'Exporter les sites'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Exporter les projets</CardTitle>
              <CardDescription>
                Exportez la liste des projets au format Excel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Filtrer par statut</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="projectsAll" checked />
                      <label
                        htmlFor="projectsAll"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Tous les projets
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="projectsInProgress" />
                      <label
                        htmlFor="projectsInProgress"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Projets en cours
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="projectsCompleted" />
                      <label
                        htmlFor="projectsCompleted"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Projets terminés
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectExportFormat">Format d'exportation</Label>
                  <Select defaultValue="xlsx">
                    <SelectTrigger id="projectExportFormat">
                      <SelectValue placeholder="Sélectionner un format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="xls">Excel 97-2003 (XLS)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="bg-app-blue hover:bg-app-lightBlue mt-4 w-full sm:w-auto"
                  onClick={handleExportProjects}
                >
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Exporter les projets
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Générer des rapports</CardTitle>
              <CardDescription>
                Créez et exportez des rapports personnalisés.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Type de rapport</Label>
                  <Select defaultValue="summary">
                    <SelectTrigger id="reportType">
                      <SelectValue placeholder="Sélectionner un type de rapport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Résumé des activités</SelectItem>
                      <SelectItem value="detailed">Rapport détaillé</SelectItem>
                      <SelectItem value="performance">Performance des sites</SelectItem>
                      <SelectItem value="custom">Rapport personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportFormat">Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger id="reportFormat">
                        <SelectValue placeholder="Sélectionner un format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="xlsx">Excel</SelectItem>
                        <SelectItem value="docx">Word</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reportPeriod">Période</Label>
                    <Select defaultValue="month">
                      <SelectTrigger id="reportPeriod">
                        <SelectValue placeholder="Sélectionner une période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Semaine en cours</SelectItem>
                        <SelectItem value="month">Mois en cours</SelectItem>
                        <SelectItem value="quarter">Trimestre en cours</SelectItem>
                        <SelectItem value="year">Année en cours</SelectItem>
                        <SelectItem value="custom">Période personnalisée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  className="bg-app-blue hover:bg-app-lightBlue mt-4 w-full sm:w-auto"
                  onClick={() => {
                    // Simulation de génération de rapport
                    toast.success('Rapport généré avec succès');
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Générer le rapport
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Rapports programmés</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Configurez des rapports à générer automatiquement selon un calendrier prédéfini.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Simulation de configuration de rapport programmé
                    toast.success('Rapport programmé configuré');
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Configurer un rapport programmé
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Export;
