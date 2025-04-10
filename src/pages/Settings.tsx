
import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Parameters from '@/components/settings/Parameters';
import OdkDecryptionManager from '@/components/settings/OdkDecryptionManager';
import OverarchingParameters from '@/components/settings/OverarchingParameters';
import UsersManagementSettings from '@/components/settings/UsersManagementSettings';
import { useAppContext } from '@/context/AppContext';
import { Check, MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Settings = () => {
  const { isDarkMode, toggleDarkMode, language, setLanguage, user } = useAppContext();
  const [activeTab, setActiveTab] = React.useState('general');
  const appVersion = "1.0.0";

  // Check if user is admin to allow users management
  const isAdmin = user?.role === 'administrator' || user?.role === 'super_user' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de l'application et vos préférences personnelles.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="parameters">Paramètres système</TabsTrigger>
          <TabsTrigger value="overarching">Paramètres généraux</TabsTrigger>
          <TabsTrigger value="odkDecryption">Décryptage ODK</TabsTrigger>
          {isAdmin && <TabsTrigger value="users">Utilisateurs</TabsTrigger>}
          <TabsTrigger value="about">À propos</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Préférences d'interface</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode">Mode sombre</Label>
                  <p className="text-sm text-muted-foreground">Activer le thème sombre pour l'interface</p>
                </div>
                <div className="flex items-center space-x-2">
                  <SunIcon className="h-4 w-4 text-muted-foreground" />
                  <Switch 
                    id="darkMode" 
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                  <MoonIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="border-t pt-6">
                <Label htmlFor="language" className="mb-2 block">Langue</Label>
                <RadioGroup 
                  id="language" 
                  value={language}
                  onValueChange={(value) => setLanguage(value as 'en' | 'fr')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fr" id="lang-fr" />
                    <Label htmlFor="lang-fr">Français</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="en" id="lang-en" />
                    <Label htmlFor="lang-en">English</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-2">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailNotifications" className="cursor-pointer">Notifications par e-mail</Label>
                    <Switch id="emailNotifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="appNotifications" className="cursor-pointer">Notifications dans l'application</Label>
                    <Switch id="appNotifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reportNotifications" className="cursor-pointer">Rapports hebdomadaires</Label>
                    <Switch id="reportNotifications" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="parameters">
          <Parameters />
        </TabsContent>

        <TabsContent value="overarching">
          <OverarchingParameters />
        </TabsContent>

        <TabsContent value="odkDecryption">
          <OdkDecryptionManager />
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="users">
            <UsersManagementSettings />
          </TabsContent>
        )}
        
        <TabsContent value="about">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">À propos de l'application</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Système de Suivi et d'Évaluation</h3>
                <p className="text-muted-foreground">
                  Application de gestion des activités de suivi et d'évaluation pour les programmes humanitaires.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Version</h4>
                  <p>{appVersion}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date de déploiement</h4>
                  <p>9 Avril 2025</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Environnement</h4>
                  <p>Production</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Serveur</h4>
                  <p>Windows Server 2022</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Support technique</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Pour toute assistance ou signalement de bug, contactez l'équipe technique :
                </p>
                <p className="text-sm">support@example.com</p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Licences</h3>
                <p className="text-sm text-muted-foreground">
                  © 2025 Tous droits réservés. Cette application est concédée sous une licence propriétaire.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
