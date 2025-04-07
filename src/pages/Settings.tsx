import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Database, 
  Server, 
  ShieldCheck, 
  Settings as SettingsIcon, 
  RefreshCw as SyncIcon,
  DownloadCloud,
  Globe,
  User,
  Bell,
  Shield,
  Smartphone
} from 'lucide-react';
import { settingsService } from '@/services/dataService';
import { odkService } from '@/services/odkService';
import { ConfigSetting } from '@/types';
import OverarchingParameters from '@/components/settings/OverarchingParameters';

const Settings = () => {
  const queryClient = useQueryClient();
  const [editedSettings, setEditedSettings] = useState<Record<string, ConfigSetting>>({});
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // ODK Briefcase configuration
  const [odkConfig, setOdkConfig] = useState({
    serverUrl: '',
    username: '',
    password: '',
    projectId: '',
    formId: '',
    exportDir: '',
    pullBefore: true,
    includeGeoPoint: true,
    overwriteFiles: false,
    startDate: '',
    endDate: '',
  });

  const { data: settings = [] } = useQuery<ConfigSetting[]>({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings
  });

  const { data: odkProjects = [] } = useQuery({
    queryKey: ['odk-projects'],
    queryFn: odkService.getProjects,
    enabled: !!odkConfig.serverUrl && !!odkConfig.username && !!odkConfig.password
  });

  const { data: odkForms = [] } = useQuery({
    queryKey: ['odk-forms', odkConfig.projectId],
    queryFn: () => odkService.getFormsByProject(odkConfig.projectId),
    enabled: !!odkConfig.projectId
  });

  const updateSettingMutation = useMutation({
    mutationFn: (setting: ConfigSetting) => settingsService.updateSetting(setting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Paramètres mis à jour avec succès');
      setEditedSettings({});
    }
  });

  const saveOdkConfigMutation = useMutation({
    mutationFn: (config: typeof odkConfig) => odkService.saveConfig(config),
    onSuccess: () => {
      toast.success('Configuration ODK Briefcase sauvegardée');
    }
  });

  const syncOdkDataMutation = useMutation({
    mutationFn: () => {
      setIsSyncing(true);
      setSyncProgress(0);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 500);
      
      return odkService.syncData(odkConfig)
        .finally(() => {
          clearInterval(progressInterval);
          setIsSyncing(false);
          setSyncProgress(100);
        });
    },
    onSuccess: () => {
      toast.success('Synchronisation des données ODK terminée avec succès');
      queryClient.invalidateQueries({ queryKey: ['odk-data'] });
      setTimeout(() => setSyncProgress(0), 2000);
    },
    onError: () => {
      toast.error('Erreur lors de la synchronisation des données ODK');
      setTimeout(() => setSyncProgress(0), 2000);
    }
  });

  const handleSettingChange = (setting: ConfigSetting, value: string) => {
    setEditedSettings({
      ...editedSettings,
      [setting.id]: {
        ...setting,
        value
      }
    });
  };

  const saveSettings = () => {
    const updates = Object.values(editedSettings);
    if (updates.length === 0) {
      toast.info('Aucune modification à enregistrer');
      return;
    }

    // Update each modified setting
    updates.forEach(setting => {
      updateSettingMutation.mutate(setting);
    });
  };

  const handleOdkConfigChange = (field: keyof typeof odkConfig, value: string | boolean) => {
    setOdkConfig({
      ...odkConfig,
      [field]: value
    });
  };

  const handleSaveOdkConfig = () => {
    // Required fields validation
    if (!odkConfig.serverUrl || !odkConfig.username || !odkConfig.password || !odkConfig.projectId || !odkConfig.formId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    saveOdkConfigMutation.mutate(odkConfig);
  };

  const handleSyncData = () => {
    syncOdkDataMutation.mutate();
  };

  // Group settings by category
  const settingsByCategory = settings.reduce<Record<string, ConfigSetting[]>>((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {});

  const categories = Object.keys(settingsByCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <Button 
          className="bg-app-blue hover:bg-app-lightBlue"
          onClick={saveSettings}
          disabled={Object.keys(editedSettings).length === 0 || updateSettingMutation.isPending}
        >
          Enregistrer les modifications
        </Button>
      </div>

      <Tabs defaultValue="overarching">
        <TabsList>
          <TabsTrigger value="overarching" className="flex items-center gap-2">
            <SettingsIcon size={16} />
            Paramètres généraux
          </TabsTrigger>
          <TabsTrigger value="odk" className="flex items-center gap-2">
            <Database size={16} />
            Configuration ODK
          </TabsTrigger>
          <TabsTrigger value="server" className="flex items-center gap-2">
            <Server size={16} />
            Serveur
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldCheck size={16} />
            Sécurité
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overarching">
          <OverarchingParameters />
        </TabsContent>

        <TabsContent value="odk">
          <Card>
            <CardHeader>
              <CardTitle>Configuration ODK Briefcase</CardTitle>
              <CardDescription>
                Configurez la connexion avec ODK Central/Aggregate pour synchroniser les données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serverUrl">URL du serveur ODK*</Label>
                  <Input
                    id="serverUrl"
                    placeholder="https://odk.example.org"
                    value={odkConfig.serverUrl}
                    onChange={(e) => handleOdkConfigChange('serverUrl', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">URL complète du serveur ODK Central ou Aggregate</p>
                </div>
                <div className="space-y-2">
                  <Label>Type de serveur</Label>
                  <Select 
                    defaultValue="central" 
                    onValueChange={(value) => {}}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="central">ODK Central</SelectItem>
                      <SelectItem value="aggregate">ODK Aggregate</SelectItem>
                      <SelectItem value="ona">Ona</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur*</Label>
                  <Input
                    id="username"
                    value={odkConfig.username}
                    onChange={(e) => handleOdkConfigChange('username', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe*</Label>
                  <Input
                    id="password"
                    type="password"
                    value={odkConfig.password}
                    onChange={(e) => handleOdkConfigChange('password', e.target.value)}
                  />
                </div>
              </div>

              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectId">Projet*</Label>
                  <Select 
                    value={odkConfig.projectId} 
                    onValueChange={(value) => handleOdkConfigChange('projectId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      {odkProjects.map(project => (
                        <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formId">Formulaire*</Label>
                  <Select 
                    value={odkConfig.formId} 
                    onValueChange={(value) => handleOdkConfigChange('formId', value)}
                    disabled={!odkConfig.projectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un formulaire" />
                    </SelectTrigger>
                    <SelectContent>
                      {odkForms.map(form => (
                        <SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="exportDir">Répertoire d'exportation</Label>
                <div className="flex gap-2">
                  <Input
                    id="exportDir"
                    value={odkConfig.exportDir}
                    onChange={(e) => handleOdkConfigChange('exportDir', e.target.value)}
                    placeholder="/path/to/export/directory"
                  />
                  <Button variant="outline">Parcourir...</Button>
                </div>
                <p className="text-xs text-gray-500">Chemin où les données extraites seront enregistrées</p>
              </div>

              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début (optionnel)</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={odkConfig.startDate}
                    onChange={(e) => handleOdkConfigChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Date de fin (optionnel)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={odkConfig.endDate}
                    onChange={(e) => handleOdkConfigChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              <Separator />
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pullBefore"
                    checked={odkConfig.pullBefore}
                    onCheckedChange={(value) => handleOdkConfigChange('pullBefore', value)}
                  />
                  <Label htmlFor="pullBefore">Extraire avant d'exporter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeGeoPoint"
                    checked={odkConfig.includeGeoPoint}
                    onCheckedChange={(value) => handleOdkConfigChange('includeGeoPoint', value)}
                  />
                  <Label htmlFor="includeGeoPoint">Inclure données géo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="overwriteFiles"
                    checked={odkConfig.overwriteFiles}
                    onCheckedChange={(value) => handleOdkConfigChange('overwriteFiles', value)}
                  />
                  <Label htmlFor="overwriteFiles">Écraser les fichiers existants</Label>
                </div>
              </div>

              {syncProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Progression de la synchronisation</Label>
                    <span className="text-sm">{Math.round(syncProgress)}%</span>
                  </div>
                  <Progress value={syncProgress} />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  onClick={handleSaveOdkConfig}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <DownloadCloud size={16} />
                  Sauvegarder la configuration
                </Button>
                <Button 
                  onClick={handleSyncData}
                  disabled={!odkConfig.serverUrl || !odkConfig.username || isSyncing}
                  className="bg-app-blue hover:bg-app-lightBlue flex items-center gap-2"
                >
                  {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <SyncIcon size={16} />}
                  {isSyncing ? 'Synchronisation en cours...' : 'Synchroniser maintenant'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server">
          <Card>
            <CardHeader>
              <CardTitle>Configuration du serveur</CardTitle>
              <CardDescription>
                Paramètres liés au serveur et à la base de données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dbHost">Hôte de la base de données</Label>
                  <Input id="dbHost" value="localhost" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbPort">Port</Label>
                  <Input id="dbPort" value="5432" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backupSchedule">Planification des sauvegardes</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Toutes les heures</SelectItem>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serverLog">Journaux du serveur</Label>
                <Textarea
                  id="serverLog"
                  readOnly
                  className="font-mono text-xs h-32"
                  value="2023-04-07 10:15:32 INFO  Server started on port 8080
2023-04-07 10:15:40 INFO  Database connection established
2023-04-07 10:16:05 INFO  User admin logged in
2023-04-07 10:20:12 INFO  Data sync completed successfully"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
              <CardDescription>
                Configurez les options de sécurité et d'authentification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
                <Input id="sessionTimeout" type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordPolicy">Politique de mot de passe</Label>
                <Select defaultValue="strong">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basique (min. 8 caractères)</SelectItem>
                    <SelectItem value="medium">Moyenne (lettres + chiffres)</SelectItem>
                    <SelectItem value="strong">Forte (majuscules + caractères spéciaux)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="twoFactor" />
                <Label htmlFor="twoFactor">Activer l'authentification à deux facteurs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="auditLog" defaultChecked />
                <Label htmlFor="auditLog">Activer les journaux d'audit</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle>Paramètres {category}</CardTitle>
                <CardDescription>
                  Configurez les paramètres relatifs à {category.toLowerCase()}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settingsByCategory[category].map(setting => (
                  <div key={setting.id} className="grid grid-cols-4 items-start gap-4">
                    <div className="space-y-1">
                      <Label htmlFor={`setting-${setting.id}`}>{setting.name}</Label>
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    </div>
                    <div className="col-span-3">
                      <Input
                        id={`setting-${setting.id}`}
                        value={editedSettings[setting.id]?.value ?? setting.value}
                        onChange={(e) => handleSettingChange(setting, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>À propos de l'application</CardTitle>
          <CardDescription>
            Informations sur l'application COMET
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Dernière mise à jour:</strong> {new Date().toLocaleDateString()}</p>
            <p className="mt-4 text-sm text-gray-500">
              COMET est un outil de gestion de suivi des sites et de gestion de projet.
              Ce logiciel permet l'intégration avec ODK et Ona pour une synchronisation complète des données.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
