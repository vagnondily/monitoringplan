
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  PlusCircle, 
  Database, 
  RefreshCw, 
  Settings2, 
  Trash2, 
  Search,
  Table as TableIcon,
  FileSpreadsheet,
  FileJson,
  Globe,
  CheckCircle,
  AlertTriangle,
  HardDrive,
  Loader2,
  Save,
  Terminal,
  FileCog
} from 'lucide-react';
import { DataSource, DataSourceTable } from '@/types';

const mockDataSources: DataSource[] = [
  {
    id: '1',
    name: 'Sites Database',
    type: 'database',
    config: {
      host: 'localhost',
      port: 5432,
      database: 'sitesdb',
      username: 'admin'
    },
    schema: {
      tables: [
        {
          name: 'sites',
          columns: [
            { name: 'id', type: 'uuid', nullable: false },
            { name: 'name', type: 'varchar', nullable: false },
            { name: 'location', type: 'varchar', nullable: true },
            { name: 'status', type: 'varchar', nullable: false },
            { name: 'lastUpdate', type: 'timestamp', nullable: true }
          ]
        },
        {
          name: 'visits',
          columns: [
            { name: 'id', type: 'uuid', nullable: false },
            { name: 'siteId', type: 'uuid', nullable: false },
            { name: 'visitDate', type: 'date', nullable: false },
            { name: 'notes', type: 'text', nullable: true }
          ]
        }
      ]
    },
    status: 'active'
  },
  {
    id: '2',
    name: 'Monitoring API',
    type: 'api',
    config: {
      url: 'https://api.monitoring.org/v1',
      authType: 'bearer'
    },
    schema: {
      tables: [
        {
          name: 'metrics',
          columns: [
            { name: 'timestamp', type: 'timestamp', nullable: false },
            { name: 'siteId', type: 'string', nullable: false },
            { name: 'metric', type: 'string', nullable: false },
            { name: 'value', type: 'number', nullable: false }
          ]
        }
      ]
    },
    status: 'active'
  },
  {
    id: '3',
    name: 'Excel Reports',
    type: 'file',
    config: {
      directory: '/reports',
      filePattern: '*.xlsx'
    },
    status: 'inactive'
  },
  {
    id: '4',
    name: 'ODK Data',
    type: 'integration',
    config: {
      integrationId: '1',
      formId: 'site-monitoring'
    },
    schema: {
      tables: [
        {
          name: 'submissions',
          columns: [
            { name: 'id', type: 'string', nullable: false },
            { name: 'submissionDate', type: 'timestamp', nullable: false },
            { name: 'siteId', type: 'string', nullable: false },
            { name: 'data', type: 'jsonb', nullable: false }
          ]
        }
      ]
    },
    status: 'active'
  }
];

const getDataSourceIcon = (type: string) => {
  switch (type) {
    case 'database':
      return <Database className="h-6 w-6 text-blue-500" />;
    case 'api':
      return <Globe className="h-6 w-6 text-green-500" />;
    case 'file':
      return <FileSpreadsheet className="h-6 w-6 text-orange-500" />;
    case 'integration':
      return <FileJson className="h-6 w-6 text-purple-500" />;
    default:
      return <Database className="h-6 w-6 text-gray-500" />;
  }
};

const DataSourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<DataSourceTable | null>(null);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConfigureDialogOpen, setIsConfigureDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const [newDataSource, setNewDataSource] = useState<{
    name: string;
    type: string;
    status: string;
    config: Record<string, any>;
  }>({
    name: '',
    type: 'database',
    status: 'active',
    config: {
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
    }
  });

  const { data: dataSources = mockDataSources } = useQuery({
    queryKey: ['dataSources'],
    queryFn: () => Promise.resolve(mockDataSources)
  });

  const filteredDataSources = activeTab === 'all' 
    ? dataSources.filter(ds => ds.name.toLowerCase().includes(searchTerm.toLowerCase())) 
    : dataSources.filter(ds => 
        ds.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        ds.type === activeTab
      );

  const handleAddDataSource = () => {
    setIsAddDialogOpen(true);
  };

  const handleRefreshDataSource = (id: string) => {
    toast.success(`Refreshing data source ${id}`);
  };

  const handleConfigureDataSource = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    setIsConfigureDialogOpen(true);
  };

  const handleDeleteDataSource = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    setIsDeleteDialogOpen(true);
  };

  const handleViewTable = (dataSource: DataSource, table: DataSourceTable) => {
    setSelectedDataSource(dataSource);
    setSelectedTable(table);
  };

  const handleSaveNewDataSource = () => {
    // Implement API call in real app
    toast.success(`Data source "${newDataSource.name}" added successfully`);
    setIsAddDialogOpen(false);
    setNewDataSource({
      name: '',
      type: 'database',
      status: 'active',
      config: {
        host: '',
        port: '',
        database: '',
        username: '',
        password: '',
      }
    });
  };

  const handleConfirmDelete = () => {
    // Implement API call in real app
    if (selectedDataSource) {
      toast.success(`Data source "${selectedDataSource.name}" deleted successfully`);
      setIsDeleteDialogOpen(false);
      setSelectedDataSource(null);
    }
  };

  const handleSaveConfiguration = () => {
    // Implement API call in real app
    toast.success('Configuration saved successfully');
    setIsConfigureDialogOpen(false);
  };

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    // Simulate API call
    setTimeout(() => {
      setIsTestingConnection(false);
      toast.success('Connection test successful');
    }, 1500);
  };

  // Mock data preview
  const generateMockTableData = (table: DataSourceTable) => {
    const rows = [];
    for (let i = 0; i < 5; i++) {
      const row: Record<string, any> = {};
      table.columns.forEach(col => {
        if (col.type === 'uuid') row[col.name] = `uuid-${i + 1}`;
        else if (col.type === 'varchar' || col.type === 'string') row[col.name] = `Sample ${col.name} ${i + 1}`;
        else if (col.type === 'timestamp' || col.type === 'date') row[col.name] = new Date().toISOString().split('T')[0];
        else if (col.type === 'number') row[col.name] = i * 10 + 5;
        else if (col.type === 'jsonb') row[col.name] = { key: `value-${i}` };
        else if (col.type === 'text') row[col.name] = `This is a sample text for row ${i + 1}`;
      });
      rows.push(row);
    }
    return rows;
  };

  const getConnectionConfigFields = () => {
    if (!selectedDataSource) return null;

    switch(selectedDataSource.type) {
      case 'database':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Host</Label>
                <Input defaultValue={selectedDataSource.config.host || ''} />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input defaultValue={selectedDataSource.config.port || ''} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Database Name</Label>
              <Input defaultValue={selectedDataSource.config.database || ''} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input defaultValue={selectedDataSource.config.username || ''} />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" defaultValue={selectedDataSource.config.password || ''} />
              </div>
            </div>
          </>
        );
      case 'api':
        return (
          <>
            <div className="space-y-2">
              <Label>API URL</Label>
              <Input defaultValue={selectedDataSource.config.url || ''} />
            </div>
            <div className="space-y-2">
              <Label>Authentication Type</Label>
              <Select defaultValue={selectedDataSource.config.authType || 'bearer'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select auth type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                  <SelectItem value="api_key">API Key</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>API Token/Key</Label>
              <Input type="password" defaultValue="********" />
            </div>
          </>
        );
      case 'file':
        return (
          <>
            <div className="space-y-2">
              <Label>Directory Path</Label>
              <Input defaultValue={selectedDataSource.config.directory || ''} />
            </div>
            <div className="space-y-2">
              <Label>File Pattern</Label>
              <Input defaultValue={selectedDataSource.config.filePattern || ''} />
            </div>
            <div className="space-y-2">
              <Label>Import Schedule</Label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'integration':
        return (
          <>
            <div className="space-y-2">
              <Label>Integration Type</Label>
              <Select defaultValue="odk">
                <SelectTrigger>
                  <SelectValue placeholder="Select integration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="odk">ODK Briefcase</SelectItem>
                  <SelectItem value="kobo">KoboToolbox</SelectItem>
                  <SelectItem value="tableau">Tableau</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Form ID</Label>
              <Input defaultValue={selectedDataSource.config.formId || ''} />
            </div>
            <div className="space-y-2">
              <Label>Sync Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="auto-import" defaultChecked />
              <Label htmlFor="auto-import">Enable auto import</Label>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getNewDataSourceConfigFields = () => {
    switch(newDataSource.type) {
      case 'database':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Host</Label>
                <Input 
                  value={newDataSource.config.host || ''} 
                  onChange={(e) => setNewDataSource({
                    ...newDataSource, 
                    config: {...newDataSource.config, host: e.target.value}
                  })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input 
                  value={newDataSource.config.port || ''} 
                  onChange={(e) => setNewDataSource({
                    ...newDataSource, 
                    config: {...newDataSource.config, port: e.target.value}
                  })} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Database Name</Label>
              <Input 
                value={newDataSource.config.database || ''} 
                onChange={(e) => setNewDataSource({
                  ...newDataSource, 
                  config: {...newDataSource.config, database: e.target.value}
                })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input 
                  value={newDataSource.config.username || ''} 
                  onChange={(e) => setNewDataSource({
                    ...newDataSource, 
                    config: {...newDataSource.config, username: e.target.value}
                  })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input 
                  type="password" 
                  value={newDataSource.config.password || ''} 
                  onChange={(e) => setNewDataSource({
                    ...newDataSource, 
                    config: {...newDataSource.config, password: e.target.value}
                  })} 
                />
              </div>
            </div>
          </>
        );
      case 'api':
        return (
          <>
            <div className="space-y-2">
              <Label>API URL</Label>
              <Input 
                value={newDataSource.config.url || ''} 
                onChange={(e) => setNewDataSource({
                  ...newDataSource, 
                  config: {...newDataSource.config, url: e.target.value}
                })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Authentication Type</Label>
              <Select 
                value={newDataSource.config.authType || 'bearer'}
                onValueChange={(value) => setNewDataSource({
                  ...newDataSource, 
                  config: {...newDataSource.config, authType: value}
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select auth type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                  <SelectItem value="api_key">API Key</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>API Token/Key</Label>
              <Input 
                type="password" 
                value={newDataSource.config.token || ''} 
                onChange={(e) => setNewDataSource({
                  ...newDataSource, 
                  config: {...newDataSource.config, token: e.target.value}
                })} 
              />
            </div>
          </>
        );
      case 'file':
        return (
          <>
            <div className="space-y-2">
              <Label>Directory Path</Label>
              <Input 
                value={newDataSource.config.directory || ''} 
                onChange={(e) => setNewDataSource({
                  ...newDataSource, 
                  config: {...newDataSource.config, directory: e.target.value}
                })} 
              />
            </div>
            <div className="space-y-2">
              <Label>File Pattern</Label>
              <Input 
                value={newDataSource.config.filePattern || ''} 
                onChange={(e) => setNewDataSource({
                  ...newDataSource, 
                  config: {...newDataSource.config, filePattern: e.target.value}
                })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Import Schedule</Label>
              <Select 
                value={newDataSource.config.schedule || 'daily'}
                onValueChange={(value) => setNewDataSource({
                  ...newDataSource, 
                  config: {...newDataSource.config, schedule: value}
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'integration':
        return (
          <>
            <div className="space-y-2">
              <Label>Integration Type</Label>
              <Select 
                value={newDataSource.config.integrationType || 'odk'}
                onValueChange={(value) => setNewDataSource({
                  ...newDataSource, 
                  config: {...newDataSource.config, integrationType: value}
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select integration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="odk">ODK Briefcase</SelectItem>
                  <SelectItem value="kobo">KoboToolbox</SelectItem>
                  <SelectItem value="tableau">Tableau</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newDataSource.config.integrationType === 'odk' && (
              <>
                <div className="space-y-2">
                  <Label>ODK Briefcase Path</Label>
                  <Input 
                    value={newDataSource.config.briefcasePath || ''} 
                    onChange={(e) => setNewDataSource({
                      ...newDataSource, 
                      config: {...newDataSource.config, briefcasePath: e.target.value}
                    })} 
                  />
                  <p className="text-xs text-gray-500">Path to ODK Briefcase JAR file</p>
                </div>
                <div className="space-y-2">
                  <Label>Form ID</Label>
                  <Input 
                    value={newDataSource.config.formId || ''} 
                    onChange={(e) => setNewDataSource({
                      ...newDataSource, 
                      config: {...newDataSource.config, formId: e.target.value}
                    })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Storage Directory</Label>
                  <Input 
                    value={newDataSource.config.storageDir || ''} 
                    onChange={(e) => setNewDataSource({
                      ...newDataSource, 
                      config: {...newDataSource.config, storageDir: e.target.value}
                    })} 
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label>Sync Frequency</Label>
              <Select 
                value={newDataSource.config.syncFrequency || 'daily'}
                onValueChange={(value) => setNewDataSource({
                  ...newDataSource, 
                  config: {...newDataSource.config, syncFrequency: value}
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="auto-import-new" 
                checked={newDataSource.config.autoImport || false}
                onCheckedChange={(checked) => setNewDataSource({
                  ...newDataSource, 
                  config: {...newDataSource.config, autoImport: checked}
                })}
              />
              <Label htmlFor="auto-import-new">Enable auto import</Label>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Database className="h-8 w-8 text-app-blue" /> 
          Sources de données
        </h1>
        <Button 
          className="bg-app-blue hover:bg-app-lightBlue"
          onClick={handleAddDataSource}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> 
          Ajouter une source de données
        </Button>
      </div>

      {selectedTable && selectedDataSource ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setSelectedTable(null)}>
                Retour
              </Button>
              <h2 className="text-xl font-semibold">
                {selectedDataSource.name} / {selectedTable.name}
              </h2>
            </div>
            <Button onClick={() => handleRefreshDataSource(selectedDataSource.id)} className="bg-app-blue hover:bg-app-lightBlue">
              <RefreshCw className="mr-2 h-4 w-4" /> Rafraîchir
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TableIcon className="h-5 w-5" />
                Aperçu des données
              </CardTitle>
              <CardDescription>
                Aperçu de la table {selectedTable.name} de {selectedDataSource.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {selectedTable.columns.map(column => (
                        <TableHead key={column.name}>
                          <div className="flex items-center gap-1">
                            {column.name}
                            <span className="text-xs text-gray-500">({column.type})</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generateMockTableData(selectedTable).map((row, index) => (
                      <TableRow key={index}>
                        {selectedTable.columns.map(column => (
                          <TableCell key={column.name}>
                            {column.type === 'jsonb' 
                              ? JSON.stringify(row[column.name]).substring(0, 30) + '...' 
                              : String(row[column.name])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">
                Affichage de 5 enregistrements sur {Math.floor(Math.random() * 100) + 20}
              </div>
              <Button variant="outline">
                <FileCog className="mr-2 h-4 w-4" /> Configurer la vue
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des sources..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Tout</TabsTrigger>
                <TabsTrigger value="database">Base de données</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="file">Fichier</TabsTrigger>
                <TabsTrigger value="integration">Intégration</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredDataSources.map(dataSource => (
              <Card key={dataSource.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {getDataSourceIcon(dataSource.type)}
                    <div>
                      <CardTitle>{dataSource.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {dataSource.type === 'database' && 'Base de données'}
                        {dataSource.type === 'api' && 'API externe'}
                        {dataSource.type === 'file' && 'Fichier de données'}
                        {dataSource.type === 'integration' && 'Intégration'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="flex justify-between mb-4">
                    <Badge variant={dataSource.status === 'active' ? 'default' : 'outline'} className={dataSource.status === 'active' ? 'bg-green-600' : ''}>
                      {dataSource.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRefreshDataSource(dataSource.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" /> Rafraîchir
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigureDataSource(dataSource)}
                      >
                        <Settings2 className="h-4 w-4 mr-1" /> Configurer
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteDataSource(dataSource)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {dataSource.type === 'database' && (
                    <div className="grid grid-cols-2 gap-2 my-3 text-sm">
                      <div>
                        <span className="font-medium">Host:</span> {dataSource.config.host || 'localhost'}
                      </div>
                      <div>
                        <span className="font-medium">Database:</span> {dataSource.config.database || 'n/a'}
                      </div>
                    </div>
                  )}
                  
                  {dataSource.type === 'api' && (
                    <div className="my-3 text-sm">
                      <div>
                        <span className="font-medium">URL:</span> {dataSource.config.url || 'n/a'}
                      </div>
                      <div>
                        <span className="font-medium">Auth:</span> {dataSource.config.authType || 'Bearer'}
                      </div>
                    </div>
                  )}
                  
                  {dataSource.type === 'file' && (
                    <div className="my-3 text-sm">
                      <div>
                        <span className="font-medium">Directory:</span> {dataSource.config.directory || 'n/a'}
                      </div>
                      <div>
                        <span className="font-medium">Pattern:</span> {dataSource.config.filePattern || '*.*'}
                      </div>
                    </div>
                  )}
                  
                  {dataSource.type === 'integration' && (
                    <div className="my-3 text-sm">
                      <div>
                        <span className="font-medium">Integration ID:</span> {dataSource.config.integrationId || 'n/a'}
                      </div>
                      <div>
                        <span className="font-medium">Form ID:</span> {dataSource.config.formId || 'n/a'}
                      </div>
                    </div>
                  )}

                  {dataSource.schema?.tables && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Tables disponibles:</p>
                      <div className="flex flex-wrap gap-2">
                        {dataSource.schema.tables.map(table => (
                          <Button 
                            key={table.name} 
                            variant="outline" 
                            size="sm"
                            className="mb-2"
                            onClick={() => handleViewTable(dataSource, table)}
                          >
                            <TableIcon className="h-4 w-4 mr-1" /> {table.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {filteredDataSources.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <HardDrive className="h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune source de données trouvée</h3>
                <p className="text-gray-500 mb-4 max-w-md">
                  {searchTerm 
                    ? `Aucun résultat pour "${searchTerm}". Essayez avec un autre terme.` 
                    : "Ajoutez une source de données pour commencer à importer et analyser vos données."}
                </p>
                <Button onClick={handleAddDataSource} className="bg-app-blue hover:bg-app-lightBlue">
                  <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une source de données
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Data Source Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une source de données</DialogTitle>
            <DialogDescription>
              Configurez une nouvelle source de données pour l'application
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ds-name">Nom</Label>
              <Input 
                id="ds-name" 
                placeholder="My Database" 
                value={newDataSource.name}
                onChange={(e) => setNewDataSource({...newDataSource, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ds-type">Type</Label>
              <Select 
                value={newDataSource.type}
                onValueChange={(value) => setNewDataSource({
                  ...newDataSource, 
                  type: value,
                  config: {} // Reset config when type changes
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="database">Base de données</SelectItem>
                  <SelectItem value="api">API externe</SelectItem>
                  <SelectItem value="file">Fichier de données</SelectItem>
                  <SelectItem value="integration">Intégration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="ds-status" 
                  checked={newDataSource.status === 'active'}
                  onCheckedChange={(checked) => setNewDataSource({
                    ...newDataSource, 
                    status: checked ? 'active' : 'inactive'
                  })}
                />
                <Label htmlFor="ds-status">Active</Label>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3">Configuration de la connexion</h4>
              {getNewDataSourceConfigFields()}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button className="bg-app-blue hover:bg-app-lightBlue" onClick={handleSaveNewDataSource}>
              <Save className="mr-2 h-4 w-4" /> Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configure Data Source Dialog */}
      <Dialog open={isConfigureDialogOpen} onOpenChange={setIsConfigureDialogOpen}>
        {selectedDataSource && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Configurer {selectedDataSource.name}</DialogTitle>
              <DialogDescription>
                Modifier les paramètres de connexion
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <Label>Statut</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="config-status" 
                    defaultChecked={selectedDataSource.status === 'active'}
                  />
                  <Label htmlFor="config-status">{selectedDataSource.status === 'active' ? 'Actif' : 'Inactif'}</Label>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Paramètres de connexion</h4>
                {getConnectionConfigFields()}
              </div>
            </div>
            
            <DialogFooter>
              <div className="flex items-center justify-between w-full">
                <Button variant="outline" onClick={handleTestConnection} disabled={isTestingConnection}>
                  {isTestingConnection ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Test en cours...
                    </>
                  ) : (
                    <>
                      <Terminal className="mr-2 h-4 w-4" /> 
                      Tester la connexion
                    </>
                  )}
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsConfigureDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button className="bg-app-blue hover:bg-app-lightBlue" onClick={handleSaveConfiguration}>
                    <Save className="mr-2 h-4 w-4" /> Enregistrer
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        {selectedDataSource && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Supprimer la source de données</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer "{selectedDataSource.name}"? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center p-4 mb-4 rounded-md bg-red-50 text-red-900">
              <AlertTriangle className="h-5 w-5 mr-3 text-red-600" />
              <div>
                <p className="font-medium">Attention</p>
                <p className="text-sm text-red-800">
                  La suppression de cette source de données peut affecter les tableaux de bord et les rapports qui l'utilisent.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer définitivement
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default DataSourcesPage;
