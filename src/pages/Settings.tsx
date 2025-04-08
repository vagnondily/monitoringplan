
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OdkDecryptionManager from '@/components/settings/OdkDecryptionManager';
import { Settings as SettingsIcon, Sliders, User, LayoutList, Database, Palette, Calculator, FileJson, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { parametersService } from '@/services/parametersService';
import Parameters from '@/components/settings/Parameters';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [organizationName, setOrganizationName] = useState('RBJ Madagascar');
  const [defaultCurrency, setDefaultCurrency] = useState('MGA');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  
  const handleSaveSettings = () => {
    toast.success('Paramètres enregistrés avec succès');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-app-blue" /> 
          Paramètres
        </h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span className="hidden md:inline">Général</span>
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <LayoutList className="h-4 w-4" />
            <span className="hidden md:inline">Configuration</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden md:inline">Apparence</span>
          </TabsTrigger>
          <TabsTrigger value="calculations" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden md:inline">Calculs</span>
          </TabsTrigger>
          <TabsTrigger value="onadata" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden md:inline">Ona Data</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            <span className="hidden md:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Utilisateurs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organization-name">Nom de l'organisation</Label>
                  <Input 
                    id="organization-name" 
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-currency">Devise par défaut</Label>
                  <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                    <SelectTrigger id="default-currency">
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MGA">Ariary malgache (MGA)</SelectItem>
                      <SelectItem value="USD">Dollar américain (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Activer les notifications</Label>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Mode sombre</Label>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-format">Format de date</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Sélectionner un format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="w-full md:w-auto">
                Enregistrer les modifications
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Parameters />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Les paramètres d'apparence seront disponibles prochainement.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calculs</CardTitle>
              <CardDescription>
                Configurez les paramètres de calcul
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Les paramètres de calcul seront disponibles prochainement.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onadata" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ODK Briefcase</CardTitle>
              <CardDescription>
                Configurez les paramètres d'ODK Briefcase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OdkDecryptionManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API</CardTitle>
              <CardDescription>
                Configurez les paramètres d'API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Les paramètres d'API seront disponibles prochainement.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs</CardTitle>
              <CardDescription>
                Gérez les utilisateurs et leurs permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">La gestion des utilisateurs sera disponible prochainement.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
