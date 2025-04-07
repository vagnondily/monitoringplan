
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Database, 
  Globe, 
  User, 
  Shield, 
  Bell, 
  MessageSquare, 
  RefreshCw,
  Save
} from 'lucide-react';
import OverarchingParameters from '@/components/settings/OverarchingParameters';

const Settings = () => {
  const { toast: toastNotification } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState({
    organizationName: 'UNOCHA Madagascar',
    timeZone: 'Africa/Antananarivo',
    language: 'fr',
    dataRetentionDays: 365,
    enableNotifications: true,
    enableEmailNotifications: true,
    autoRefreshInterval: 30,
  });

  const [odkSettings, setOdkSettings] = useState({
    odkAggregateUrl: 'https://odk-aggregate.example.org',
    odkUsername: 'admin',
    odkPassword: '********',
    odkBriefcaseJarPath: '/opt/odk/ODK-Briefcase-v1.18.0.jar',
    autoSyncInterval: 60,
    defaultFormId: 'site_monitoring_form',
    storageDirectory: '/data/odk_forms',
    enableAutoSync: true,
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    enableTableau: true,
    tableauSiteId: 'monitoringplan',
    tableauApiKey: '********',
    enableKoboToolbox: false,
    koboUrl: '',
    koboApiToken: '',
    enableCustomApi: false,
    customApiUrl: '',
    customApiKey: '',
  });

  const handleSaveGeneral = () => {
    toast.success('General settings saved successfully');
  };

  const handleSaveOdk = () => {
    toast.success('ODK settings saved successfully');
  };

  const handleSaveIntegration = () => {
    toast.success('Integration settings saved successfully');
  };

  const handleTestOdkConnection = () => {
    toast.success('ODK connection test successful');
  };

  const handleTestIntegrationConnection = (type: string) => {
    toast.success(`${type} connection test successful`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Paramètres généraux</h1>
        <Button className="bg-app-blue hover:bg-app-lightBlue">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer tous les paramètres
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" /> Général
          </TabsTrigger>
          <TabsTrigger value="odk" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Configuration ODK
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> Intégrations
          </TabsTrigger>
          <TabsTrigger value="parameters" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Paramètres du système
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de l'application</CardTitle>
              <CardDescription>
                Configuration globale de l'application de monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Nom de l'organisation</Label>
                  <Input 
                    id="organizationName" 
                    value={generalSettings.organizationName}
                    onChange={(e) => setGeneralSettings({...generalSettings, organizationName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeZone">Fuseau horaire</Label>
                  <select 
                    id="timeZone"
                    className="w-full p-2 border rounded-md"
                    value={generalSettings.timeZone}
                    onChange={(e) => setGeneralSettings({...generalSettings, timeZone: e.target.value})}
                  >
                    <option value="Africa/Antananarivo">Africa/Antananarivo</option>
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <select 
                    id="language"
                    className="w-full p-2 border rounded-md"
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="mg">Malagasy</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataRetentionDays">Conservation des données (jours)</Label>
                  <Input 
                    id="dataRetentionDays" 
                    type="number"
                    min="30"
                    max="1825"
                    value={generalSettings.dataRetentionDays}
                    onChange={(e) => setGeneralSettings({...generalSettings, dataRetentionDays: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-6 border-t pt-6">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableNotifications">Activer les notifications</Label>
                      <p className="text-sm text-gray-500">Recevoir des notifications dans l'application</p>
                    </div>
                    <Switch 
                      id="enableNotifications" 
                      checked={generalSettings.enableNotifications}
                      onCheckedChange={(checked) => setGeneralSettings({...generalSettings, enableNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableEmailNotifications">Notifications par email</Label>
                      <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                    </div>
                    <Switch 
                      id="enableEmailNotifications" 
                      checked={generalSettings.enableEmailNotifications}
                      onCheckedChange={(checked) => setGeneralSettings({...generalSettings, enableEmailNotifications: checked})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6 border-t pt-6">
                <h3 className="text-lg font-medium">Rafraîchissement des données</h3>
                <div className="space-y-2">
                  <Label htmlFor="autoRefreshInterval">Intervalle de rafraîchissement automatique (minutes)</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="autoRefreshInterval" 
                      type="number"
                      min="1"
                      max="120"
                      value={generalSettings.autoRefreshInterval}
                      onChange={(e) => setGeneralSettings({...generalSettings, autoRefreshInterval: parseInt(e.target.value)})}
                      className="max-w-[100px]"
                    />
                    <Button variant="outline" onClick={() => toastNotification({ title: 'Données rafraîchies', description: 'Les données ont été rafraîchies manuellement' })}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Rafraîchir maintenant
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral} className="bg-app-blue hover:bg-app-lightBlue">
                  Enregistrer les paramètres généraux
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="odk">
          <Card>
            <CardHeader>
              <CardTitle>Configuration ODK Briefcase</CardTitle>
              <CardDescription>
                Paramètres pour la synchronisation avec ODK Briefcase et ODK Aggregate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="odkAggregateUrl">URL du serveur ODK Aggregate</Label>
                  <Input 
                    id="odkAggregateUrl" 
                    value={odkSettings.odkAggregateUrl}
                    onChange={(e) => setOdkSettings({...odkSettings, odkAggregateUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="odkUsername">Nom d'utilisateur ODK</Label>
                  <Input 
                    id="odkUsername" 
                    value={odkSettings.odkUsername}
                    onChange={(e) => setOdkSettings({...odkSettings, odkUsername: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="odkPassword">Mot de passe ODK</Label>
                  <Input 
                    id="odkPassword" 
                    type="password"
                    value={odkSettings.odkPassword}
                    onChange={(e) => setOdkSettings({...odkSettings, odkPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="odkBriefcaseJarPath">Chemin vers ODK Briefcase JAR</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="odkBriefcaseJarPath" 
                      value={odkSettings.odkBriefcaseJarPath}
                      onChange={(e) => setOdkSettings({...odkSettings, odkBriefcaseJarPath: e.target.value})}
                    />
                    <Button variant="outline">Parcourir</Button>
                  </div>
                  <p className="text-xs text-gray-500">Chemin vers le fichier JAR d'ODK Briefcase sur le serveur</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storageDirectory">Répertoire de stockage des formulaires</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="storageDirectory" 
                      value={odkSettings.storageDirectory}
                      onChange={(e) => setOdkSettings({...odkSettings, storageDirectory: e.target.value})}
                    />
                    <Button variant="outline">Parcourir</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultFormId">ID de formulaire par défaut</Label>
                  <Input 
                    id="defaultFormId" 
                    value={odkSettings.defaultFormId}
                    onChange={(e) => setOdkSettings({...odkSettings, defaultFormId: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-6 border-t pt-6">
                <h3 className="text-lg font-medium">Synchronisation</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableAutoSync">Activer la synchronisation automatique</Label>
                    <p className="text-sm text-gray-500">Synchroniser automatiquement les données depuis ODK</p>
                  </div>
                  <Switch 
                    id="enableAutoSync" 
                    checked={odkSettings.enableAutoSync}
                    onCheckedChange={(checked) => setOdkSettings({...odkSettings, enableAutoSync: checked})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="autoSyncInterval">Intervalle de synchronisation (minutes)</Label>
                  <Input 
                    id="autoSyncInterval" 
                    type="number"
                    min="5"
                    max="1440"
                    value={odkSettings.autoSyncInterval}
                    onChange={(e) => setOdkSettings({...odkSettings, autoSyncInterval: parseInt(e.target.value)})}
                    className="max-w-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={handleTestOdkConnection} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tester la connexion
                </Button>
                <Button onClick={handleSaveOdk} className="bg-app-blue hover:bg-app-lightBlue">
                  Enregistrer la configuration ODK
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations externes</CardTitle>
              <CardDescription>
                Configurer les connexions avec des services externes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6 border-b pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableTableau">Tableau</Label>
                    <p className="text-sm text-gray-500">Intégration avec Tableau pour les visualisations avancées</p>
                  </div>
                  <Switch 
                    id="enableTableau" 
                    checked={integrationSettings.enableTableau}
                    onCheckedChange={(checked) => setIntegrationSettings({...integrationSettings, enableTableau: checked})}
                  />
                </div>
                
                {integrationSettings.enableTableau && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-gray-200">
                    <div className="space-y-2">
                      <Label htmlFor="tableauSiteId">ID du site Tableau</Label>
                      <Input 
                        id="tableauSiteId" 
                        value={integrationSettings.tableauSiteId}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, tableauSiteId: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tableauApiKey">Clé API Tableau</Label>
                      <Input 
                        id="tableauApiKey" 
                        type="password"
                        value={integrationSettings.tableauApiKey}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, tableauApiKey: e.target.value})}
                      />
                    </div>
                    <div className="col-span-full">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTestIntegrationConnection('Tableau')}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Tester la connexion Tableau
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6 border-b pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableKoboToolbox">KoboToolbox</Label>
                    <p className="text-sm text-gray-500">Intégration avec KoboToolbox pour la collecte de données</p>
                  </div>
                  <Switch 
                    id="enableKoboToolbox" 
                    checked={integrationSettings.enableKoboToolbox}
                    onCheckedChange={(checked) => setIntegrationSettings({...integrationSettings, enableKoboToolbox: checked})}
                  />
                </div>
                
                {integrationSettings.enableKoboToolbox && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-gray-200">
                    <div className="space-y-2">
                      <Label htmlFor="koboUrl">URL de KoboToolbox</Label>
                      <Input 
                        id="koboUrl" 
                        value={integrationSettings.koboUrl}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, koboUrl: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="koboApiToken">Token API KoboToolbox</Label>
                      <Input 
                        id="koboApiToken" 
                        type="password"
                        value={integrationSettings.koboApiToken}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, koboApiToken: e.target.value})}
                      />
                    </div>
                    <div className="col-span-full">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTestIntegrationConnection('KoboToolbox')}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Tester la connexion KoboToolbox
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableCustomApi">API personnalisée</Label>
                    <p className="text-sm text-gray-500">Intégration avec une API personnalisée</p>
                  </div>
                  <Switch 
                    id="enableCustomApi" 
                    checked={integrationSettings.enableCustomApi}
                    onCheckedChange={(checked) => setIntegrationSettings({...integrationSettings, enableCustomApi: checked})}
                  />
                </div>
                
                {integrationSettings.enableCustomApi && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-gray-200">
                    <div className="space-y-2">
                      <Label htmlFor="customApiUrl">URL de l'API</Label>
                      <Input 
                        id="customApiUrl" 
                        value={integrationSettings.customApiUrl}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, customApiUrl: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customApiKey">Clé API</Label>
                      <Input 
                        id="customApiKey" 
                        type="password"
                        value={integrationSettings.customApiKey}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, customApiKey: e.target.value})}
                      />
                    </div>
                    <div className="col-span-full">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTestIntegrationConnection('Custom API')}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Tester la connexion API
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveIntegration} className="bg-app-blue hover:bg-app-lightBlue">
                  Enregistrer les configurations d'intégration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters">
          <OverarchingParameters />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
