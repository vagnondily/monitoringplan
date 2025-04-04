
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
import { settingsService } from '@/services/dataService';
import { ConfigSetting } from '@/types';
import { toast } from 'sonner';
import OverarchingParameters from '@/components/settings/OverarchingParameters';

const Settings = () => {
  const queryClient = useQueryClient();
  const [editedSettings, setEditedSettings] = useState<Record<string, ConfigSetting>>({});

  const { data: settings = [] } = useQuery<ConfigSetting[]>({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings
  });

  const updateSettingMutation = useMutation({
    mutationFn: (setting: ConfigSetting) => settingsService.updateSetting(setting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Paramètres mis à jour avec succès');
      setEditedSettings({});
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

    // Mettre à jour chaque paramètre modifié
    updates.forEach(setting => {
      updateSettingMutation.mutate(setting);
    });
  };

  // Regrouper les paramètres par catégorie
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
        <TabsList className="mb-4">
          <TabsTrigger value="overarching">Paramètres généraux</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overarching">
          <OverarchingParameters />
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
            Informations sur l'application SiteSync Insight
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Dernière mise à jour:</strong> {new Date().toLocaleDateString()}</p>
            <p className="mt-4 text-sm text-gray-500">
              SiteSync Insight est un outil de gestion de suivi des sites et de gestion de projet.
              Ce logiciel permet l'intégration avec ONA et Foundry pour une synchronisation complète des données.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
