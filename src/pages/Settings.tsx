
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OdkDecryptionManager from '@/components/settings/OdkDecryptionManager';
import { Settings as SettingsIcon, Sliders, User, LayoutList, Database, Palette, Calculator, FileJson, Globe, Moon, Sun } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Parameters from '@/components/settings/Parameters';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if dark mode is saved in localStorage or if user prefers dark scheme
    return localStorage.getItem('darkMode') === 'true' || 
           (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [organizationName, setOrganizationName] = useState('RBJ Madagascar');
  const [defaultCurrency, setDefaultCurrency] = useState('MGA');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  
  useEffect(() => {
    // Apply dark mode class when component mounts or when darkMode changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);
  
  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    toast.success(newDarkMode ? 'Mode sombre activé' : 'Mode clair activé');
  };
  
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
        <div className="flex">
          <div className="flex-grow">
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
                      <div className="flex items-center gap-2">
                        <Label htmlFor="dark-mode">Mode sombre</Label>
                        {darkMode ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>}
                      </div>
                      <Switch
                        id="dark-mode"
                        checked={darkMode}
                        onCheckedChange={handleToggleDarkMode}
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
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Couleur primaire</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="primary-color" 
                          type="color" 
                          defaultValue="#1e40af" 
                          className="w-16 h-10 p-1" 
                        />
                        <Input defaultValue="#1e40af" className="flex-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Couleur secondaire</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="secondary-color" 
                          type="color" 
                          defaultValue="#3b82f6" 
                          className="w-16 h-10 p-1" 
                        />
                        <Input defaultValue="#3b82f6" className="flex-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="font-size">Taille de police</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="font-size">
                          <SelectValue placeholder="Sélectionner une taille" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Petite</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="large">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="border-radius">Rayon des bordures</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="border-radius">
                          <SelectValue placeholder="Sélectionner un style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucun</SelectItem>
                          <SelectItem value="small">Petit</SelectItem>
                          <SelectItem value="medium">Moyen</SelectItem>
                          <SelectItem value="large">Grand</SelectItem>
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

            <TabsContent value="calculations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Calculs</CardTitle>
                  <CardDescription>
                    Configurez les paramètres de calcul
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="calculation-method">Méthode de calcul</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger id="calculation-method">
                          <SelectValue placeholder="Sélectionner une méthode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="weighted">Pondéré</SelectItem>
                          <SelectItem value="average">Moyenne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rounding-method">Méthode d'arrondi</Label>
                      <Select defaultValue="nearest">
                        <SelectTrigger id="rounding-method">
                          <SelectValue placeholder="Sélectionner une méthode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nearest">Au plus proche</SelectItem>
                          <SelectItem value="up">Au supérieur</SelectItem>
                          <SelectItem value="down">À l'inférieur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="decimal-places">Nombre de décimales</Label>
                      <Select defaultValue="2">
                        <SelectTrigger id="decimal-places">
                          <SelectValue placeholder="Sélectionner le nombre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
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
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-url">URL de l'API</Label>
                      <Input id="api-url" defaultValue="https://api.example.com/v1" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="api-key">Clé API</Label>
                      <Input id="api-key" type="password" defaultValue="*************" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="api-timeout">Timeout (secondes)</Label>
                      <Input id="api-timeout" type="number" defaultValue="30" min="1" max="120" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="api-cache">Activer le cache</Label>
                      <Switch id="api-cache" defaultChecked={true} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cache-duration">Durée du cache (minutes)</Label>
                      <Input id="cache-duration" type="number" defaultValue="15" min="1" max="1440" />
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

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Utilisateurs</CardTitle>
                  <CardDescription>
                    Gérez les utilisateurs et leurs permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="auth-method">Méthode d'authentification</Label>
                      <Select defaultValue="local">
                        <SelectTrigger id="auth-method">
                          <SelectValue placeholder="Sélectionner une méthode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Base de données locale</SelectItem>
                          <SelectItem value="ldap">LDAP / Active Directory</SelectItem>
                          <SelectItem value="oauth">OAuth 2.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Expiration de session (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="60" min="5" max="1440" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-2fa">Exiger l'authentification à deux facteurs</Label>
                      <Switch id="require-2fa" defaultChecked={false} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allow-registration">Autoriser l'auto-inscription</Label>
                      <Switch id="allow-registration" defaultChecked={false} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="default-role">Rôle par défaut pour les nouveaux utilisateurs</Label>
                      <Select defaultValue="viewer">
                        <SelectTrigger id="default-role">
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="editor">Éditeur</SelectItem>
                          <SelectItem value="viewer">Spectateur</SelectItem>
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
              
              <Card>
                <CardHeader>
                  <CardTitle>Politique de mot de passe</CardTitle>
                  <CardDescription>
                    Configurez les exigences de sécurité des mots de passe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-length">Longueur minimale</Label>
                      <Input id="min-length" type="number" defaultValue="8" min="6" max="30" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-uppercase">Exiger des majuscules</Label>
                      <Switch id="require-uppercase" defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-numbers">Exiger des chiffres</Label>
                      <Switch id="require-numbers" defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-special">Exiger des caractères spéciaux</Label>
                      <Switch id="require-special" defaultChecked={true} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expiration-days">Expiration du mot de passe (jours)</Label>
                      <Input id="expiration-days" type="number" defaultValue="90" min="0" max="365" />
                      <p className="text-sm text-muted-foreground">0 = pas d'expiration</p>
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
          </div>
          
          <div className="ml-6 w-52 flex-shrink-0">
            <TabsList className="flex flex-col h-auto">
              <TabsTrigger value="general" className="flex items-center justify-start gap-2 w-full mb-1">
                <Sliders className="h-4 w-4" />
                <span>Général</span>
              </TabsTrigger>
              <TabsTrigger value="configuration" className="flex items-center justify-start gap-2 w-full mb-1">
                <LayoutList className="h-4 w-4" />
                <span>Configuration</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center justify-start gap-2 w-full mb-1">
                <Palette className="h-4 w-4" />
                <span>Apparence</span>
              </TabsTrigger>
              <TabsTrigger value="calculations" className="flex items-center justify-start gap-2 w-full mb-1">
                <Calculator className="h-4 w-4" />
                <span>Calculs</span>
              </TabsTrigger>
              <TabsTrigger value="onadata" className="flex items-center justify-start gap-2 w-full mb-1">
                <Database className="h-4 w-4" />
                <span>Ona Data</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center justify-start gap-2 w-full mb-1">
                <FileJson className="h-4 w-4" />
                <span>API</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center justify-start gap-2 w-full mb-1">
                <User className="h-4 w-4" />
                <span>Utilisateurs</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;
