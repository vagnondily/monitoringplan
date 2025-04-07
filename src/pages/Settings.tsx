
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { parametersService } from '@/services/parametersService';
import OverarchingParameters from '@/components/settings/OverarchingParameters';
import OdkDecryptionManager from '@/components/settings/OdkDecryptionManager';
import { Settings as SettingsIcon, Lock, Database, Users, Shield, Workflow } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  const { data: parameters, isLoading: isLoadingParameters } = useQuery({
    queryKey: ["parameters"],
    queryFn: parametersService.getOverarchingParameters
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-app-blue" /> 
          Paramètres
        </h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full md:w-3/4 lg:w-2/3">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <OverarchingParameters 
            parameters={parameters || []} 
            isLoading={isLoadingParameters}
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-app-blue" />
                Sécurité et confidentialité
              </CardTitle>
              <CardDescription>
                Gérez les paramètres de sécurité et de confidentialité de l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OdkDecryptionManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-app-blue" />
                Gestion des données
              </CardTitle>
              <CardDescription>
                Configurez les paramètres liés à la gestion des données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Paramètres de gestion des données à implémenter</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>
                Gérer les comptes utilisateurs et les autorisations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button onClick={() => {
                    toast({
                      title: "Ajouter un utilisateur",
                      description: "Fonction d'ajout d'utilisateur à implémenter",
                    });
                  }}>Ajouter un utilisateur</Button>
                </div>
                
                <div className="border rounded-md divide-y">
                  {/* User 1 */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">Jean Dupont</p>
                        <p className="text-sm text-muted-foreground">Coordinateur de suivi</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          toast({
                            title: "Éditer l'utilisateur",
                            description: "Édition de Jean Dupont",
                          });
                        }}>Éditer</Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => {
                          toast({
                            title: "Confirmation requise",
                            description: "Voulez-vous vraiment supprimer cet utilisateur?",
                            variant: "destructive",
                          });
                        }}>Supprimer</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span>jean.dupont@example.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bureau:</span>
                        <span>Antananarivo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rôle:</span>
                        <span className="font-medium">Administrateur</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Statut:</span>
                        <span className="font-medium text-green-600">Actif</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* User 2 */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">Marie Laurent</p>
                        <p className="text-sm text-muted-foreground">Responsable terrain</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          toast({
                            title: "Éditer l'utilisateur",
                            description: "Édition de Marie Laurent",
                          });
                        }}>Éditer</Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => {
                          toast({
                            title: "Confirmation requise",
                            description: "Voulez-vous vraiment supprimer cet utilisateur?",
                            variant: "destructive",
                          });
                        }}>Supprimer</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span>marie.laurent@example.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bureau:</span>
                        <span>Toamasina</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rôle:</span>
                        <span className="font-medium">Editor</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Statut:</span>
                        <span className="font-medium text-green-600">Actif</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* User 3 */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">Pierre Martin</p>
                        <p className="text-sm text-muted-foreground">Analyste de données</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          toast({
                            title: "Éditer l'utilisateur",
                            description: "Édition de Pierre Martin",
                          });
                        }}>Éditer</Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => {
                          toast({
                            title: "Confirmation requise",
                            description: "Voulez-vous vraiment supprimer cet utilisateur?",
                            variant: "destructive",
                          });
                        }}>Supprimer</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span>pierre.martin@example.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bureau:</span>
                        <span>Antananarivo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rôle:</span>
                        <span className="font-medium">Validator</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Statut:</span>
                        <span className="font-medium text-amber-600">En congé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-app-blue" />
                Configuration du workflow
              </CardTitle>
              <CardDescription>
                Configurez les paramètres du système de workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Paramètres de workflow à implémenter</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
