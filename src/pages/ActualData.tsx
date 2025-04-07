
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, RefreshCw, Filter, Search } from 'lucide-react';
import { odkService } from '@/services/odkService';
import { toast } from 'sonner';

const ActualData = () => {
  const [selectedForm, setSelectedForm] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  const { 
    data: forms = [], 
    isLoading: formsLoading 
  } = useQuery({
    queryKey: ['odk-forms'],
    queryFn: odkService.getForms
  });

  const { 
    data: formData, 
    isLoading: dataLoading,
    refetch
  } = useQuery({
    queryKey: ['odk-data', selectedForm],
    queryFn: () => odkService.getFormData(selectedForm),
    enabled: !!selectedForm,
  });

  const handleRefreshData = async () => {
    try {
      await refetch();
      toast.success('Données actualisées avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation des données');
    }
  };

  const handleFormSelection = (value: string) => {
    setSelectedForm(value);
    setCurrentPage(1);
  };

  const handleDownload = () => {
    if (!formData) return;
    
    try {
      // Create CSV data
      const headers = Object.keys(formData.data[0] || {}).join(',');
      const rows = formData.data.map(row => Object.values(row).join(',')).join('\n');
      const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${selectedForm}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Download it
      link.click();
      document.body.removeChild(link);
      
      toast.success('Téléchargement démarré');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    }
  };

  // Filter data based on search query
  const filteredData = formData?.data.filter(item => {
    if (!searchQuery) return true;
    
    return Object.values(item).some(
      value => String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  // Pagination
  const totalPages = Math.ceil((filteredData.length || 0) / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  
  // Determine columns dynamically
  const columns = paginatedData.length > 0 ? Object.keys(paginatedData[0]) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Données Actuelles (ODK/Ona)</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefreshData} 
            disabled={dataLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} />
            Rafraîchir 
          </Button>
          <Button 
            onClick={handleDownload} 
            disabled={!formData || dataLoading}
            className="bg-app-blue hover:bg-app-lightBlue flex items-center gap-1"
          >
            <Download size={16} />
            Exporter CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visualisation des données collectées</CardTitle>
          <CardDescription>
            Consultez les données collectées depuis ODK Central ou Ona. Sélectionnez un formulaire pour voir les données.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <label className="text-sm font-medium">Sélectionner un formulaire</label>
                <Select 
                  value={selectedForm} 
                  onValueChange={handleFormSelection}
                  disabled={formsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un formulaire" />
                  </SelectTrigger>
                  <SelectContent>
                    {formsLoading ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : (
                      forms.map(form => (
                        <SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-2/3">
                <label className="text-sm font-medium">Rechercher</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher dans les données..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                    disabled={!selectedForm || dataLoading}
                  />
                </div>
              </div>
            </div>

            {!selectedForm ? (
              <div className="text-center p-12 border border-dashed rounded-md">
                <p className="text-gray-500">Veuillez sélectionner un formulaire pour afficher les données</p>
              </div>
            ) : dataLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center p-12 border border-dashed rounded-md">
                <p className="text-gray-500">Aucune donnée trouvée pour ce formulaire</p>
              </div>
            ) : (
              <div>
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {columns.map(column => (
                            <TableHead key={column}>{column}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.map((row, index) => (
                          <TableRow key={index}>
                            {columns.map(column => (
                              <TableCell key={`${index}-${column}`}>
                                {String(row[column] || '')}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Affichage de {Math.min(filteredData.length, 1 + (currentPage - 1) * pageSize)} à {Math.min(filteredData.length, currentPage * pageSize)} sur {filteredData.length} entrées
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    <div className="text-sm">
                      Page {currentPage} sur {totalPages || 1}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActualData;
