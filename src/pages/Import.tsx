
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import FileUploader from '@/components/data/FileUploader';
import { siteService } from '@/services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Import = () => {
  const queryClient = useQueryClient();

  const importSitesMutation = useMutation({
    mutationFn: (file: File) => siteService.importFromExcel(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Importer des données</h1>
      <p className="text-gray-600">
        Importez des données depuis des fichiers Excel pour mettre à jour les informations dans le système.
      </p>

      <Tabs defaultValue="sites">
        <TabsList>
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
              <ul className="list-disc pl-5 space-y-1">
                <li>Nom du site (obligatoire)</li>
                <li>Emplacement (obligatoire)</li>
                <li>Statut (Actif, En maintenance, Inactif)</li>
                <li>Adresse IP</li>
                <li>Responsable</li>
              </ul>
              <div className="mt-4">
                <a 
                  href="#" 
                  className="text-app-blue hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    // Téléchargement d'un modèle (simulé)
                    toast.success('Modèle téléchargé');
                  }}
                >
                  Télécharger un modèle
                </a>
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
            onFileUpload={(file) => {
              // Logique d'importation de projets (simulée)
              setTimeout(() => {
                toast.success('Projets importés avec succès');
              }, 1500);
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
              </ul>
              <div className="mt-4">
                <a 
                  href="#" 
                  className="text-app-blue hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    // Téléchargement d'un modèle (simulé)
                    toast.success('Modèle téléchargé');
                  }}
                >
                  Télécharger un modèle
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations avec ONA et Foundry</CardTitle>
              <CardDescription>
                Configurez les paramètres d'importation depuis ONA et Foundry.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">ONA</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configurez les données à importer depuis ONA.
                  </p>
                  <Button 
                    className="bg-app-blue hover:bg-app-lightBlue"
                    onClick={() => {
                      // Simulation d'importation
                      toast.success('Importation depuis ONA configurée');
                    }}
                  >
                    Configurer l'importation ONA
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Foundry</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configurez les données à importer depuis Foundry.
                  </p>
                  <Button 
                    className="bg-app-blue hover:bg-app-lightBlue"
                    onClick={() => {
                      // Simulation d'importation
                      toast.success('Importation depuis Foundry configurée');
                    }}
                  >
                    Configurer l'importation Foundry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Import;
