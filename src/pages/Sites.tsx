
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Download, Upload } from 'lucide-react';
import SitesList from '@/components/sites/SitesList';
import { siteService } from '@/services/dataService';
import { Site } from '@/types';
import FileUploader from '@/components/data/FileUploader';

const Sites = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Site>>({
    name: '',
    location: '',
    status: 'Actif',
    ipAddress: '',
    manager: ''
  });
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const { data: sites = [], isLoading } = useQuery<Site[]>({
    queryKey: ['sites'],
    queryFn: siteService.getSites
  });

  const createSiteMutation = useMutation({
    mutationFn: (newSite: Omit<Site, 'id' | 'lastUpdate'>) => 
      siteService.createSite(newSite as Omit<Site, 'id'>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      resetFormAndCloseDialog();
    }
  });

  const updateSiteMutation = useMutation({
    mutationFn: (site: Site) => siteService.updateSite(site),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      resetFormAndCloseDialog();
    }
  });

  const deleteSiteMutation = useMutation({
    mutationFn: (id: string) => siteService.deleteSite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      setIsDeleteDialogOpen(false);
    }
  });

  const exportToExcelMutation = useMutation({
    mutationFn: siteService.exportToExcel
  });

  const importFromExcelMutation = useMutation({
    mutationFn: (file: File) => siteService.importFromExcel(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      setIsImportDialogOpen(false);
    }
  });

  const resetFormAndCloseDialog = () => {
    setFormData({
      name: '',
      location: '',
      status: 'Actif',
      ipAddress: '',
      manager: ''
    });
    setIsAddDialogOpen(false);
    setSelectedSiteId(null);
  };

  const handleAddOrEdit = () => {
    if (selectedSiteId) {
      // Édition
      updateSiteMutation.mutate({
        ...formData,
        id: selectedSiteId,
        lastUpdate: new Date().toISOString().split('T')[0]
      } as Site);
    } else {
      // Ajout
      createSiteMutation.mutate(formData as Omit<Site, 'id' | 'lastUpdate'>);
    }
  };

  const handleEdit = (site: Site) => {
    setFormData(site);
    setSelectedSiteId(site.id);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedSiteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSiteId) {
      deleteSiteMutation.mutate(selectedSiteId);
    }
  };

  const handleExportToExcel = () => {
    exportToExcelMutation.mutate();
  };

  const handleImportFromExcel = (file: File) => {
    importFromExcelMutation.mutate(file);
  };

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Sites</h1>
        <div className="flex gap-2">
          <Button 
            className="bg-app-blue hover:bg-app-lightBlue"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Ajouter un site
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportToExcel}
            disabled={exportToExcelMutation.isPending}
          >
            <Download className="h-4 w-4 mr-2" /> Exporter
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsImportDialogOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" /> Importer
          </Button>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <Input
            placeholder="Rechercher un site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-10">Chargement des sites...</div>
        ) : (
          <SitesList 
            sites={filteredSites} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
      </div>

      {/* Dialog pour ajouter ou modifier un site */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSiteId ? 'Modifier le site' : 'Ajouter un nouveau site'}</DialogTitle>
            <DialogDescription>
              {selectedSiteId 
                ? 'Modifiez les détails du site existant.' 
                : 'Remplissez les informations pour ajouter un nouveau site.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Emplacement
              </Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="En maintenance">En maintenance</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ipAddress" className="text-right">
                Adresse IP
              </Label>
              <Input
                id="ipAddress"
                value={formData.ipAddress || ''}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manager" className="text-right">
                Responsable
              </Label>
              <Input
                id="manager"
                value={formData.manager || ''}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetFormAndCloseDialog}>
              Annuler
            </Button>
            <Button 
              className="bg-app-blue hover:bg-app-lightBlue"
              onClick={handleAddOrEdit}
              disabled={createSiteMutation.isPending || updateSiteMutation.isPending}
            >
              {selectedSiteId ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation pour la suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce site?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le site
              de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog pour l'importation de fichier Excel */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer des sites depuis Excel</DialogTitle>
            <DialogDescription>
              Téléchargez un fichier Excel contenant les données des sites à importer.
            </DialogDescription>
          </DialogHeader>
          <FileUploader
            title="Importer des sites"
            description="Formats acceptés: .xlsx, .xls"
            acceptedFileTypes=".xlsx,.xls"
            onFileUpload={handleImportFromExcel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sites;
