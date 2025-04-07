
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
  Globe
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

  const { data: dataSources = mockDataSources } = useQuery({
    queryKey: ['dataSources'],
    queryFn: () => Promise.resolve(mockDataSources)
  });

  const filteredDataSources = dataSources.filter(ds => 
    ds.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDataSource = () => {
    toast.info('Add data source dialog would open here');
  };

  const handleRefreshDataSource = (id: string) => {
    toast.success(`Refreshing data source ${id}`);
  };

  const handleConfigureDataSource = (id: string) => {
    toast.info(`Configure data source ${id}`);
  };

  const handleDeleteDataSource = (id: string) => {
    toast.info(`Delete data source ${id}`);
  };

  const handleViewTable = (dataSource: DataSource, table: DataSourceTable) => {
    setSelectedDataSource(dataSource);
    setSelectedTable(table);
  };

  // Mock data preview
  const generateMockTableData = (table: DataSourceTable) => {
    const rows = [];
    for (let i = 0; i < 5; i++) {
      const row: Record<string, any> = {};
      table.columns.forEach(col => {
        if (col.type === 'uuid') row[col.name] = `uuid-${i + 1}`;
        else if (col.type === 'varchar' || col.type === 'string') row[col.name] = `Sample ${col.name} ${i + 1}`;
        else if (col.type === 'timestamp' || col.type === 'date') row[col.name] = new Date().toISOString();
        else if (col.type === 'number') row[col.name] = i * 10 + 5;
        else if (col.type === 'jsonb') row[col.name] = { key: `value-${i}` };
        else if (col.type === 'text') row[col.name] = `This is a sample text for row ${i + 1}`;
      });
      rows.push(row);
    }
    return rows;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Database className="h-8 w-8 text-app-blue" /> 
          Data Sources
        </h1>
        <Button 
          className="bg-app-blue hover:bg-app-lightBlue"
          onClick={handleAddDataSource}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> 
          Add Data Source
        </Button>
      </div>

      {selectedTable && selectedDataSource ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setSelectedTable(null)}>
                Back
              </Button>
              <h2 className="text-xl font-semibold">
                {selectedDataSource.name} / {selectedTable.name}
              </h2>
            </div>
            <Button onClick={() => handleRefreshDataSource(selectedDataSource.id)}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TableIcon className="h-5 w-5" />
                Data Preview
              </CardTitle>
              <CardDescription>
                Showing preview of {selectedTable.name} from {selectedDataSource.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {selectedTable.columns.map(column => (
                        <TableHead key={column.name}>{column.name}</TableHead>
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
          </Card>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search data sources..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="database">Database</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="file">File</TabsTrigger>
                <TabsTrigger value="integration">Integration</TabsTrigger>
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
                      <CardDescription className="capitalize">{dataSource.type} data source</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="flex justify-between mb-4">
                    <Badge variant={dataSource.status === 'active' ? 'default' : 'outline'}>
                      {dataSource.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRefreshDataSource(dataSource.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigureDataSource(dataSource.id)}
                      >
                        <Settings2 className="h-4 w-4 mr-1" /> Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteDataSource(dataSource.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {dataSource.schema?.tables && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Available Tables:</p>
                      <div className="space-y-2">
                        {dataSource.schema.tables.map(table => (
                          <Button 
                            key={table.name} 
                            variant="outline" 
                            size="sm"
                            className="mr-2 mb-2"
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
          </div>
        </>
      )}
    </div>
  );
};

export default DataSourcesPage;
