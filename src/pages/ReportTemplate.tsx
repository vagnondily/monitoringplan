
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileInput, Save, Plus, FileDown, Upload, LayoutTemplate, Trash2, MoveHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const ReportTemplate = () => {
  const templateSections = [
    { id: 1, name: 'En-tête', type: 'header' },
    { id: 2, name: 'Informations générales', type: 'form' },
    { id: 3, name: 'Description du site', type: 'text' },
    { id: 4, name: 'Table des résultats', type: 'table' },
    { id: 5, name: 'Graphique des tendances', type: 'chart' },
    { id: 6, name: 'Recommandations', type: 'text' },
    { id: 7, name: 'Signature', type: 'signature' },
  ];
  
  const handleSaveTemplate = () => {
    toast.success('Modèle de rapport enregistré avec succès');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileInput className="h-8 w-8 text-app-blue" /> 
          Créateur de modèle de rapport
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Upload className="h-4 w-4" /> Importer
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <FileDown className="h-4 w-4" /> Exporter
          </Button>
          <Button onClick={handleSaveTemplate} className="flex items-center gap-1 bg-app-blue hover:bg-app-lightBlue">
            <Save className="h-4 w-4" /> Enregistrer
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Propriétés du rapport</CardTitle>
              <CardDescription>
                Configurez les détails de base du modèle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">Nom du modèle</Label>
                <Input id="report-name" placeholder="ex: Rapport de suivi de site" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-description">Description</Label>
                <Textarea 
                  id="report-description" 
                  placeholder="Décrivez l'objectif de ce modèle de rapport"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-category">Catégorie</Label>
                <Select defaultValue="site">
                  <SelectTrigger id="report-category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="site">Rapport de site</SelectItem>
                    <SelectItem value="project">Rapport de projet</SelectItem>
                    <SelectItem value="activity">Rapport d'activité</SelectItem>
                    <SelectItem value="beneficiary">Rapport de bénéficiaires</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-orientation">Orientation de la page</Label>
                <Select defaultValue="portrait">
                  <SelectTrigger id="report-orientation">
                    <SelectValue placeholder="Sélectionner une orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Paysage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-logo">Inclure le logo</Label>
                <Switch id="include-logo" defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-pagination">Inclure pagination</Label>
                <Switch id="include-pagination" defaultChecked={true} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Éléments disponibles</CardTitle>
              <CardDescription>
                Faites glisser ces éléments dans votre modèle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-2 border rounded-md hover:bg-muted/50 cursor-move flex items-center gap-2">
                  <MoveHorizontal className="h-4 w-4" /> Titre de section
                </div>
                <div className="p-2 border rounded-md hover:bg-muted/50 cursor-move flex items-center gap-2">
                  <MoveHorizontal className="h-4 w-4" /> Champ de texte
                </div>
                <div className="p-2 border rounded-md hover:bg-muted/50 cursor-move flex items-center gap-2">
                  <MoveHorizontal className="h-4 w-4" /> Zone de texte
                </div>
                <div className="p-2 border rounded-md hover:bg-muted/50 cursor-move flex items-center gap-2">
                  <MoveHorizontal className="h-4 w-4" /> Tableau
                </div>
                <div className="p-2 border rounded-md hover:bg-muted/50 cursor-move flex items-center gap-2">
                  <MoveHorizontal className="h-4 w-4" /> Graphique
                </div>
                <div className="p-2 border rounded-md hover:bg-muted/50 cursor-move flex items-center gap-2">
                  <MoveHorizontal className="h-4 w-4" /> Image
                </div>
                <div className="p-2 border rounded-md hover:bg-muted/50 cursor-move flex items-center gap-2">
                  <MoveHorizontal className="h-4 w-4" /> Liste à puces
                </div>
                <div className="p-2 border rounded-md hover:bg-muted/50 cursor-move flex items-center gap-2">
                  <MoveHorizontal className="h-4 w-4" /> Date
                </div>
                <div className="p-2 border rounded-md hover:bg-muted/50 cursor-move flex items-center gap-2">
                  <MoveHorizontal className="h-4 w-4" /> Signature
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Conception du modèle</CardTitle>
                <CardDescription>
                  Organisez les sections de votre modèle de rapport
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Ajouter une section
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="editor">
                <TabsList className="mb-4">
                  <TabsTrigger value="editor">Éditeur</TabsTrigger>
                  <TabsTrigger value="preview">Aperçu</TabsTrigger>
                </TabsList>
                
                <TabsContent value="editor">
                  <div className="border rounded-md min-h-[500px]">
                    <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
                      <h3 className="font-medium">Structure du rapport</h3>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Afficher" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les sections</SelectItem>
                          <SelectItem value="form">Sections de formulaire</SelectItem>
                          <SelectItem value="visual">Sections visuelles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="divide-y">
                      {templateSections.map((section) => (
                        <div key={section.id} className="p-4 hover:bg-muted/30 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <LayoutTemplate className="h-4 w-4" />
                              <span className="font-medium">{section.name}</span>
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {section.type}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoveHorizontal className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview">
                  <div className="border rounded-md p-8 min-h-[500px]">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b">
                      <div className="space-y-1">
                        <h2 className="text-xl font-bold">Rapport de suivi de site</h2>
                        <p className="text-muted-foreground">Généré le 08/04/2025</p>
                      </div>
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                        LOGO
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Informations générales</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Nom du site:</p>
                            <p>Site de démonstration</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Date de visite:</p>
                            <p>01/04/2025</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Responsable:</p>
                            <p>John Doe</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Région:</p>
                            <p>Analamanga</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Description du site</h3>
                        <p className="text-muted-foreground italic">
                          [Le contenu de cette section sera personnalisé par l'utilisateur]
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Table des résultats</h3>
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted">
                              <tr>
                                <th className="p-2 text-left">Indicateur</th>
                                <th className="p-2 text-left">Cible</th>
                                <th className="p-2 text-left">Actuel</th>
                                <th className="p-2 text-left">%</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              <tr>
                                <td className="p-2">Indicateur 1</td>
                                <td className="p-2">100</td>
                                <td className="p-2">85</td>
                                <td className="p-2">85%</td>
                              </tr>
                              <tr>
                                <td className="p-2">Indicateur 2</td>
                                <td className="p-2">50</td>
                                <td className="p-2">42</td>
                                <td className="p-2">84%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Graphique des tendances</h3>
                        <div className="h-48 border rounded-md bg-muted/20 flex items-center justify-center">
                          [Graphique sera généré ici]
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveTemplate} className="w-full bg-app-blue hover:bg-app-lightBlue">
                Enregistrer le modèle
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportTemplate;
