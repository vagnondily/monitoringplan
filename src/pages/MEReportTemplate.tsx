
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutTemplate, Save, Plus, Trash2, FileDown, FileUp, Eye } from 'lucide-react';
import { toast } from 'sonner';

const MEReportTemplate = () => {
  const [templateName, setTemplateName] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  
  const handleSaveTemplate = () => {
    toast.success('Modèle de rapport M&E enregistré avec succès');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <LayoutTemplate className="h-8 w-8 text-app-blue" /> 
          Créateur de modèle de rapport M&E
        </h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-7">
        <div className="space-y-6 md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Détails du modèle</CardTitle>
              <CardDescription>
                Configurez les détails de base du modèle de rapport
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Nom du modèle</Label>
                  <Input 
                    id="template-name" 
                    placeholder="ex: Rapport trimestriel M&E" 
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-type">Type de rapport</Label>
                  <Select defaultValue="quarterly">
                    <SelectTrigger id="template-type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="quarterly">Trimestriel</SelectItem>
                      <SelectItem value="annual">Annuel</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Input 
                    id="template-description" 
                    placeholder="Description du modèle de rapport" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Structure du rapport</CardTitle>
              <CardDescription>
                Définissez les sections et le contenu du modèle de rapport
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="sections">
                <TabsList className="mb-4">
                  <TabsTrigger value="sections">Sections</TabsTrigger>
                  <TabsTrigger value="indicators">Indicateurs</TabsTrigger>
                  <TabsTrigger value="visualizations">Visualisations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sections" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Sections du rapport</h3>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" /> Ajouter une section
                    </Button>
                  </div>
                  
                  <div className="border rounded-md divide-y">
                    {['Résumé exécutif', 'Contexte du projet', 'Méthodologie', 'Résultats et analyse', 'Conclusions et recommandations', 'Annexes'].map((section, index) => (
                      <div key={index} className="p-3 flex justify-between items-center hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedSection(section)}>
                        <span>{section}</span>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="indicators" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Indicateurs du rapport</h3>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" /> Ajouter un indicateur
                    </Button>
                  </div>
                  
                  <div className="border rounded-md divide-y">
                    {['Nombre de bénéficiaires', 'Taux de couverture', 'Progression des activités', 'Performance des résultats', 'Utilisation des ressources'].map((indicator, index) => (
                      <div key={index} className="p-3 flex justify-between items-center hover:bg-muted/50">
                        <span>{indicator}</span>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="visualizations" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Visualisations du rapport</h3>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" /> Ajouter une visualisation
                    </Button>
                  </div>
                  
                  <div className="border rounded-md divide-y">
                    {['Évolution des indicateurs clés', 'Répartition géographique', 'Comparaison des résultats', 'Tendances trimestrielles', 'Distribution par catégorie'].map((visual, index) => (
                      <div key={index} className="p-3 flex justify-between items-center hover:bg-muted/50">
                        <span>{visual}</span>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-1">
                <FileUp className="h-4 w-4" /> Importer
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <FileDown className="h-4 w-4" /> Exporter
              </Button>
              <Button onClick={handleSaveTemplate} className="flex items-center gap-1">
                <Save className="h-4 w-4" /> Enregistrer
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modèles sauvegardés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Rapport mensuel M&E', 'Rapport trimestriel MEAL', 'Rapport annuel d\'impact', 'Rapport de progression'].map((template, index) => (
                <div key={index} className="p-2 border rounded-md hover:bg-muted/50 cursor-pointer">
                  {template}
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Propriétés de la section</CardTitle>
              <CardDescription>
                {selectedSection ? `Configuration de la section "${selectedSection}"` : 'Sélectionnez une section pour la modifier'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSection ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="section-title">Titre</Label>
                    <Input id="section-title" defaultValue={selectedSection} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section-order">Ordre</Label>
                    <Input id="section-order" type="number" defaultValue="1" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section-content-type">Type de contenu</Label>
                    <Select defaultValue="text">
                      <SelectTrigger id="section-content-type">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texte</SelectItem>
                        <SelectItem value="table">Tableau</SelectItem>
                        <SelectItem value="chart">Graphique</SelectItem>
                        <SelectItem value="mixed">Mixte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section-template">Contenu par défaut</Label>
                    <Input id="section-template" placeholder="Modèle de contenu" />
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Cliquez sur une section dans la liste pour afficher et modifier ses propriétés
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MEReportTemplate;
