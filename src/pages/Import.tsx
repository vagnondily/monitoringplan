
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import FileUploader from '@/components/data/FileUploader';
import { siteService, projectService } from '@/services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Download, Disc, Database } from 'lucide-react';

const Import = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("sites");

  const importSitesMutation = useMutation({
    mutationFn: (file: File) => siteService.importFromExcel(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    }
  });

  const importProjectsMutation = useMutation({
    mutationFn: (file: File) => {
      // Simulation d'importation de projets
      return new Promise((resolve) => {
        setTimeout(() => {
          toast.success('Projets importés avec succès');
          resolve([]);
        }, 1500);
      });
    }
  });

  const handleDownloadTemplate = (type: 'sites' | 'projects') => {
    if (type === 'sites') {
      // Simulation du téléchargement du modèle
      const anchor = document.createElement('a');
      anchor.href = '/template-sites.xlsx'; // Remplacer par URL réelle
      anchor.download = 'modele-sites.xlsx';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      toast.success('Modèle de sites téléchargé');
    } else {
      toast.success('Modèle de projets téléchargé');
    }
  };

  const handleConfigureONA = () => {
    toast.success('Configuration ONA initiée');
  };

  const handleConfigureFoundry = () => {
    toast.success('Configuration Foundry initiée');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Importer des données</h1>
      <p className="text-gray-600">
        Importez des données depuis des fichiers Excel pour mettre à jour les informations dans le système.
      </p>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700">Information</AlertTitle>
        <AlertDescription className="text-blue-600">
          Les données importées doivent respecter le format requis. Téléchargez un modèle pour vous assurer de la compatibilité.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="sites" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="projects">Projets</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sites" className="mt-4">
          <FileUploader
            title="Importer des sites"
            description="Téléchargez un fichier Excel contenant la liste des sites à importer ou mettre à jour."
            acceptedFileTypes=".xlsx,.xls"
            maxSize={10}
            templateAvailable={true}
            onTemplateDownload={() => handleDownloadTemplate('sites')}
            onFileUpload={(file) => importSitesMutation.mutate(file)}
          />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Format du fichier</CardTitle>
              <CardDescription>
                Le fichier Excel doit avoir les colonnes suivantes:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2 text-gray-800">Informations de base</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Sub-Office name</li>
                    <li>Antenne</li>
                    <li>Site name (obligatoire)</li>
                    <li>Region</li>
                    <li>District</li>
                    <li>Communes</li>
                    <li>Fokontany</li>
                    <li>ID Sites</li>
                    <li>GPS-Latitude</li>
                    <li>GPS-Longitude</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-gray-800">Détails des activités</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Activity Category</li>
                    <li>Programme Area</li>
                    <li>Activity Tags</li>
                    <li>Security situation (0-99)</li>
                    <li>Programme synergies (0-1)</li>
                    <li>Modality type</li>
                    <li>Beneficiary number</li>
                    <li>Et autres statuts...</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-2 text-gray-800">Suivi mensuel</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Le fichier contient également des colonnes pour chaque mois avec les informations suivantes:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Active (Oui/Non)</li>
                  <li>CP Name (Nom du partenaire)</li>
                  <li>Prévu (Oui/Non)</li>
                  <li>Actual (Oui/Non)</li>
                  <li>Rapport de Mission</li>
                  <li>Rapport MoDa</li>
                  <li>Missionnaire</li>
                </ul>
              </div>
              <div className="mt-4 flex justify-center">
                <Button 
                  variant="outline"
                  className="text-app-blue border-app-blue hover:bg-blue-50"
                  onClick={() => handleDownloadTemplate('sites')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger un modèle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="mt-4">
          <FileUploader
            title="Importer des projets"
            description="Téléchargez un fichier Excel contenant la liste des projets à importer ou mettre à jour."
            acceptedFileTypes=".xlsx,.xls"
            maxSize={10}
            templateAvailable={true}
            onTemplateDownload={() => handleDownloadTemplate('projects')}
            onFileUpload={(file) => {
              importProjectsMutation.mutate(file);
            }}
          />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Format du fichier</CardTitle>
              <CardDescription>
                Le fichier Excel doit avoir les colonnes suivantes:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>Nom du projet (obligatoire)</li>
                <li>Description</li>
                <li>Date de début (format: YYYY-MM-DD)</li>
                <li>Date de fin (format: YYYY-MM-DD)</li>
                <li>Statut (En cours, Terminé, En attente)</li>
                <li>ID du site (obligatoire) - doit correspondre à un site existant</li>
                <li>Progression (0-100)</li>
                <li>Catégorie d'activité</li>
                <li>Zone de programme</li>
                <li>Responsable du projet</li>
              </ul>
              <div className="mt-4 flex justify-center">
                <Button 
                  variant="outline"
                  className="text-app-blue border-app-blue hover:bg-blue-50"
                  onClick={() => handleDownloadTemplate('projects')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger un modèle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Disc className="h-5 w-5 text-blue-600" />
                  Intégration ONA
                </CardTitle>
                <CardDescription>
                  Configurez l'importation des données depuis ONA.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    ONA est une plateforme de collecte de données sur le terrain. Configurez les paramètres pour synchroniser les données avec votre système.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-medium text-gray-800">Fonctionnalités disponibles:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                      <li>Importation des données de sites</li>
                      <li>Synchronisation des rapports de visite</li>
                      <li>Mise à jour des statuts d'activité</li>
                    </ul>
                  </div>
                  <Button 
                    className="w-full bg-app-blue hover:bg-app-lightBlue"
                    onClick={handleConfigureONA}
                  >
                    Configurer l'importation ONA
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Intégration Foundry
                </CardTitle>
                <CardDescription>
                  Configurez l'importation des données depuis Foundry.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Foundry est une plateforme d'analyse de données. Intégrez les données Foundry pour enrichir les informations de vos sites et projets.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <p className="font-medium text-gray-800">Fonctionnalités disponibles:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                      <li>Importation des données contextuelles</li>
                      <li>Intégration des indicateurs clés</li>
                      <li>Synchronisation des rapports d'analyse</li>
                    </ul>
                  </div>
                  <Button 
                    className="w-full bg-app-blue hover:bg-app-lightBlue"
                    onClick={handleConfigureFoundry}
                  >
                    Configurer l'importation Foundry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Import;
