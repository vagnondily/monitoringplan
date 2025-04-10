
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  PlusCircle, 
  Database, 
  RefreshCw, 
  Settings2, 
  Trash2, 
  Check, 
  X,
  TabletSmartphone,
  Table,
  FileJson,
  BarChart4,
  Link as LinkIcon,
  Database as DatabaseIcon
} from 'lucide-react';
import { Integration } from '@/types';

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'ODK Briefcase',
    type: 'odk',
    config: {
      url: 'https://odk.example.org',
      username: 'admin',
      lastSyncDate: '2023-04-05T10:30:00Z'
    },
    status: 'connected',
    lastSync: '2023-04-05T10:30:00Z'
  },
  {
    id: '2',
    name: 'Tableau Server',
    type: 'tableau',
    config: {
      url: 'https://tableau.example.org',
      site: 'default',
      apiVersion: '3.8'
    },
    status: 'connected',
    lastSync: '2023-04-06T14:15:00Z'
  },
  {
    id: '3',
    name: 'External API',
    type: 'api',
    config: {
      url: 'https://api.example.org/v1',
      authMethod: 'bearer'
    },
    status: 'error',
    lastSync: '2023-04-01T09:45:00Z'
  },
  {
    id: '4',
    name: 'Data Warehouse',
    type: 'custom',
    config: {
      connectionString: 'postgresql://user:password@warehouse.example.org:5432/datamart'
    },
    status: 'disconnected'
  }
];

const getIntegrationIcon = (type: string) => {
  switch (type) {
    case 'odk':
      return <TabletSmartphone className="h-6 w-6 text-blue-500" />;
    case 'tableau':
      return <BarChart4 className="h-6 w-6 text-green-500" />;
    case 'api':
      return <FileJson className="h-6 w-6 text-orange-500" />;
    case 'custom':
      return <DatabaseIcon className="h-6 w-6 text-purple-500" />;
    default:
      return <LinkIcon className="h-6 w-6 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'connected':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Connected</Badge>;
    case 'disconnected':
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Disconnected</Badge>;
    case 'error':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const IntegrationsPage = () => {
  const { data: integrations = mockIntegrations } = useQuery({
    queryKey: ['integrations'],
    queryFn: () => Promise.resolve(mockIntegrations)
  });

  const handleAddIntegration = () => {
    toast.info('Add integration dialog would open here');
  };

  const handleSyncIntegration = (id: string) => {
    toast.success(`Synchronizing integration ${id}`);
  };

  const handleConfigureIntegration = (id: string) => {
    toast.info(`Configure integration ${id}`);
  };

  const handleDeleteIntegration = (id: string) => {
    toast.info(`Delete integration ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <LinkIcon className="h-8 w-8 text-app-blue" /> 
          Integrations
        </h1>
        <Button 
          className="bg-app-blue hover:bg-app-lightBlue"
          onClick={handleAddIntegration}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> 
          Add Integration
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="disconnected">Disconnected</TabsTrigger>
          <TabsTrigger value="error">Error</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {integrations.map(integration => (
              <Card key={integration.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getIntegrationIcon(integration.type)}
                      <div>
                        <h3 className="text-lg font-semibold">{integration.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{integration.type} Integration</p>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(integration.status)}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      {integration.lastSync ? (
                        <p>Last synchronized: {new Date(integration.lastSync).toLocaleString()}</p>
                      ) : (
                        <p>Never synchronized</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSyncIntegration(integration.id)}
                        disabled={integration.status !== 'connected'}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" /> Sync
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigureIntegration(integration.id)}
                      >
                        <Settings2 className="h-4 w-4 mr-1" /> Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteIntegration(integration.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="connected" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {integrations.filter(i => i.status === 'connected').map(integration => (
              <Card key={integration.id}>
                {/* Same content as above for connected integrations */}
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getIntegrationIcon(integration.type)}
                      <div>
                        <h3 className="text-lg font-semibold">{integration.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{integration.type} Integration</p>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(integration.status)}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      {integration.lastSync ? (
                        <p>Last synchronized: {new Date(integration.lastSync).toLocaleString()}</p>
                      ) : (
                        <p>Never synchronized</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSyncIntegration(integration.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" /> Sync
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigureIntegration(integration.id)}
                      >
                        <Settings2 className="h-4 w-4 mr-1" /> Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteIntegration(integration.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="disconnected" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {integrations.filter(i => i.status === 'disconnected').map(integration => (
              <Card key={integration.id}>
                {/* Similar content for disconnected integrations */}
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getIntegrationIcon(integration.type)}
                      <div>
                        <h3 className="text-lg font-semibold">{integration.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{integration.type} Integration</p>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(integration.status)}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      Not connected
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigureIntegration(integration.id)}
                      >
                        <Settings2 className="h-4 w-4 mr-1" /> Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteIntegration(integration.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="error" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {integrations.filter(i => i.status === 'error').map(integration => (
              <Card key={integration.id}>
                {/* Similar content for error integrations */}
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getIntegrationIcon(integration.type)}
                      <div>
                        <h3 className="text-lg font-semibold">{integration.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{integration.type} Integration</p>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(integration.status)}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-red-500">
                      Error: Connection failed. Please check configuration.
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigureIntegration(integration.id)}
                      >
                        <Settings2 className="h-4 w-4 mr-1" /> Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteIntegration(integration.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsPage;
