
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import OverarchingParameters from '@/components/settings/OverarchingParameters';
import OdkDecryptionManager from '@/components/settings/OdkDecryptionManager';
import { Settings as SettingsIcon, Info } from 'lucide-react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const handleSaveSettings = () => {
    toast.success('Paramètres enregistrés avec succès');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-app-blue" /> 
          Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">In-app Notifications</Label>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-alerts">Email Alerts</Label>
              </div>
              <Switch
                id="email-alerts"
                checked={emailAlerts}
                onCheckedChange={setEmailAlerts}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-refresh">Auto-refresh Dashboard Data</Label>
              </div>
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Preferences</CardTitle>
            <CardDescription>
              Configure which charts appear in your dashboard and how they are organized.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4 flex gap-2">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                For row-based chart organization, use the Dashboard Settings panel on the main dashboard.
              </p>
            </div>
            
            <Button variant="outline" onClick={() => toast.success("Navigation vers les paramètres du dashboard")}>
              Go to Dashboard Settings
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Overarching Parameters</CardTitle>
          <CardDescription>
            Configure global parameters that affect the entire monitoring plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OverarchingParameters />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>ODK Decryption Manager</CardTitle>
          <CardDescription>
            Configure ODK Briefcase decryption settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OdkDecryptionManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
