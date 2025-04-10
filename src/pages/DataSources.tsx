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
import { Checkbox } from '@/components/ui/checkbox';

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
  const [isDataSourceCombineModalOpen, setIsDataSourceCombineModalOpen] = useState(false);
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
  const [combinedSourceName, setCombinedSourceName] = useState('');

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
    if (selectedDataSource) {
      toast.success(`Data source "${selectedDataSource.name}" deleted successfully`);
      setIsDeleteDialogOpen(false);
      setSelectedDataSource(null);
    }
  };

  const handleSaveConfiguration = () => {
    toast.success('Configuration saved successfully');
    setIsConfigureDialogOpen(false);
  };

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setTimeout(() => {
      setIsTestingConnection(false);
      toast.success('Connection test successful');
    }, 1500);
  };

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

  const handleCombineDataSources = () => {
    if (selectedDataSources.length < 2) {
      toast.error('Veuillez sélectionner au moins deux sources de données');
      return;
    }

    if (!combinedSourceName.trim()) {
      toast.error('Veuillez donner un nom à la source de données combinée');
      return;
    }

    toast.success(`Sources de données combinées sous le nom "${combinedSourceName}"`);
    setIsDataSourceCombineModalOpen(false);
    setCombinedSourceName('');
    setSelectedDataSources([]);
  };

  const toggleDataSourceSelection = (id: string) => {
    if (selectedDataSources.includes(id)) {
      setSelectedDataSources(selectedDataSources.filter(dsId => dsId !== id));
    } else {
      setSelectedDataSources([...selectedDataSources, id]);
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
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="combine-sources" 
                      checked={newDataSource.config.useCombinedSources || false}
                      onCheckedChange={(checked) => setNewDataSource({
                        ...newDataSource, 
                        config: {
                          ...newDataSource.config, 
                          useCombinedSources: checked,
                          additionalSources: checked ? newDataSource.config.additionalSources || [] : undefined
                        }
                      })}
                    />
                    <Label htmlFor="combine-sources">Combiner avec d'autres sources</Label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Permet de combiner les données de plusieurs instances ODK
                  </p>
                  
                  {newDataSource.config.useCombinedSources && (
                    <div className="mt-2 border rounded-md p-3 bg-gray-50">
                      <Label className="mb-2 block">Sources additionnelles</Label>
                      {(newDataSource.config.additionalSources || []).map((source, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <Input 
                            value={source} 
                            onChange={(e) => {
                              const sources = [...(newDataSource.config.additionalSources || [])];
                              sources[index] = e.target.value;
                              setNewDataSource({
                                ...newDataSource, 
                                config: {...newDataSource.config, additionalSources: sources}
                              });
                            }} 
                            placeholder="Chemin vers l'instance ODK"
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              const sources = [...(newDataSource.config.additionalSources || [])];
                              sources.splice(index, 1);
                              setNewDataSource({
                                ...newDataSource, 
                                config: {...newDataSource.config, additionalSources: sources}
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const sources = [...(newDataSource.config.additionalSources || []), ''];
                          setNewDataSource({
                            ...newDataSource, 
                            config: {...newDataSource.config, additionalSources: sources}
                          });
                        }}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter une source
                      </Button>
                    </div>
                  )}
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
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={() => setIsDataSourceCombineModalOpen(true)}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> 
            Combiner des sources
          </Button>
          <Button 
            className="bg-app-blue hover:bg-app-lightBlue"
            onClick={handleAddDataSource}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> 
            Ajouter une source de données
          </Button>
        </div>
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
                        <span className="font-medium">Port:</span> {dataSource.config.port || '5432'}
                      </div>
                      <div>
                        <span className="font-medium">Database:</span> {dataSource.config.database || 'db'}
                      </div>
                      <div>
                        <span className="font-medium">User:</span> {dataSource.config.username || 'admin'}
                      </div>
                    </div>
                  )}

                  {dataSource.type === 'api' && (
                    <div className="grid grid-cols-1 gap-2 my-3 text-sm">
                      <div>
                        <span className="font-medium">URL:</span> {dataSource.config.url || 'https://api.example.com'}
                      </div>
                      <div>
                        <span className="font-medium">Auth Type:</span> {dataSource.config.authType || 'bearer'}
                      </div>
                    </div>
                  )}

                  {dataSource.type === 'file' && (
                    <div className="grid grid-cols-1 gap-2 my-3 text-sm">
                      <div>
                        <span className="font-medium">Directory:</span> {dataSource.config.directory || '/data'}
                      </div>
                      <div>
                        <span className="font-medium">Pattern:</span> {dataSource.config.filePattern || '*.*'}
                      </div>
                    </div>
                  )}

                  {dataSource.type === 'integration' && (
                    <div className="grid grid-cols-1 gap-2 my-3 text-sm">
                      <div>
                        <span className="font-medium">Integration:</span> ODK Briefcase
                      </div>
                      <div>
                        <span className="font-medium">Form ID:</span> {dataSource.config.formId || 'default-form'}
                      </div>
                    </div>
                  )}

                  {dataSource.schema?.tables && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Tables disponibles:</h4>
                      <div className="space-y-1">
                        {dataSource.schema.tables.map(table => (
                          <div 
                            key={table.name}
                            className="text-xs bg-gray-100 py-1 px-2 rounded flex justify-between items-center cursor-pointer hover:bg-gray-200"
                            onClick={() => handleViewTable(dataSource, table)}
                          >
                            <span className="font-medium">{table.name}</span>
                            <span className="text-gray-500">{table.columns.length} colonnes</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Dialog open={isDataSourceCombineModalOpen} onOpenChange={setIsDataSourceCombineModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Combiner des sources de données</DialogTitle>
            <DialogDescription>
              Sélectionnez les sources à combiner et donnez un nom à la nouvelle source combinée
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="combined-name">Nom de la source combinée</Label>
              <Input
                id="combined-name"
                placeholder="Ex: Sites combinés"
                value={combinedSourceName}
                onChange={(e) => setCombinedSourceName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sources à combiner</Label>
              <div className="border rounded-md p-3 space-y-2 max-h-60 overflow-y-auto">
                {dataSources.map(source => (
                  <div key={source.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`source-${source.id}`}
                      checked={selectedDataSources.includes(source.id)}
                      onCheckedChange={() => toggleDataSourceSelection(source.id)}
                    />
                    <Label htmlFor={`source-${source.id}`} className="flex items-center gap-2 text-sm cursor-pointer">
                      {getDataSourceIcon(source.type)}
                      {source.name}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedDataSources.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {selectedDataSources.length} source(s) sélectionnée(s)
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDataSourceCombineModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCombineDataSources} className="bg-app-blue hover:bg-app-lightBlue">
              Combiner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une source de données</DialogTitle>
            <DialogDescription>
              Configurez les paramètres de la nouvelle source de données
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ds-name">Nom</Label>
              <Input
                id="ds-name"
                placeholder="Ex: Base de données des sites"
                value={newDataSource.name}
                onChange={(e) => setNewDataSource({...newDataSource, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ds-type">Type</Label>
              <Select 
                value={newDataSource.type}
                onValueChange={(value) => setNewDataSource({...newDataSource, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="database">Base de données</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="file">Fichier</SelectItem>
                  <SelectItem value="integration">Intégration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ds-status">Statut</Label>
              <Select 
                value={newDataSource.status}
                onValueChange={(value) => setNewDataSource({...newDataSource, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="border-t pt-4 space-y-4">
              <h4 className="font-medium">Configuration de la connexion</h4>
              {getNewDataSourceConfigFields()}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveNewDataSource} className="bg-app-blue hover:bg-app-lightBlue">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfigureDialogOpen} onOpenChange={setIsConfigureDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurer la source</DialogTitle>
            <DialogDescription>
              {selectedDataSource?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="config-name">Nom</Label>
              <Input
                id="config-name"
                defaultValue={selectedDataSource?.name || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="config-status">Statut</Label>
              <Select defaultValue={selectedDataSource?.status || 'active'}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="border-t pt-4 space-y-4">
              <h4 className="font-medium">Configuration de la connexion</h4>
              {getConnectionConfigFields()}
            </div>
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
              >
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
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigureDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveConfiguration} className="bg-app-blue hover:bg-app-lightBlue">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer la source de données</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{selectedDataSource?.name}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataSourcesPage;
