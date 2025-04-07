
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-app-blue" />
                Utilisateurs et permissions
              </CardTitle>
              <CardDescription>
                Gérez les utilisateurs et leurs permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Paramètres des utilisateurs à implémenter</p>
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
