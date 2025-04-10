
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Download, Upload, Filter, Table, LayoutGrid } from 'lucide-react';
import SitesList from '@/components/sites/SitesList';
import { siteService } from '@/services/dataService';
import { parametersService } from '@/services/parametersService';
import { Site, OverarchingParameter } from '@/types';
import FileUploader from '@/components/data/FileUploader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const Sites = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    monitoringPriority: '',
    requiredFrequency: '',
    fieldOffice: '',
    district: '',
    commune: ''
  });
  
  const [formData, setFormData] = useState<Partial<Site>>({
    name: '',
    location: '',
    status: 'Actif',
    ipAddress: '',
    manager: '',
    activeSite: true,
    priority: 'Normal',
    monitoringPriority: 'Medium'
  });
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const { data: sites = [], isLoading } = useQuery<Site[]>({
    queryKey: ['sites'],
    queryFn: siteService.getSites
  });

  const { data: parameters = [] } = useQuery<OverarchingParameter[]>({
    queryKey: ['overarching-parameters'],
    queryFn: parametersService.getOverarchingParameters
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

  const updateMonthlyPlanMutation = useMutation({
    mutationFn: ({ siteId, month, data }: { siteId: string, month: string, data: any }) => {
      // Trouver le site à mettre à jour
      const site = sites.find(s => s.id === siteId);
      if (!site) return Promise.reject("Site non trouvé");
      
      // Créer une copie du site avec les activités mensuelles mises à jour
      const updatedSite = { 
        ...site,
        monthlyActivities: {
          ...(site.monthlyActivities || {}),
          [month]: data
        }
      };
      
      // Mettre à jour le site
      return siteService.updateSite(updatedSite);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Planification mise à jour');
    }
  });

  const resetFormAndCloseDialog = () => {
    setFormData({
      name: '',
      location: '',
      status: 'Actif',
      ipAddress: '',
      manager: '',
      activeSite: true,
      priority: 'Normal',
      monitoringPriority: 'Medium'
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

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      priority: '',
      status: '',
      monitoringPriority: '',
      requiredFrequency: '',
      fieldOffice: '',
      district: '',
      commune: ''
    });
  };

  const handleUpdateMonthlyPlan = (siteId: string, month: string, data: any) => {
    updateMonthlyPlanMutation.mutate({ siteId, month, data });
  };

  // Extraire les valeurs uniques pour les filtres
  const fieldOffices = [...new Set(sites.map(site => site.subOfficeName).filter(Boolean))];
  const districts = [...new Set(sites.map(site => site.district).filter(Boolean))];
  const communes = [...new Set(sites.map(site => site.commune).filter(Boolean))];

  const filteredSites = sites.filter(site => {
    // Filtre par texte de recherche
    const matchesSearch = 
      (site.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.commune?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.manager?.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtre par onglet actif
    let matchesTab = true;
    if (activeTab === 'active') {
      matchesTab = site.activeSite === true;
    } else if (activeTab === 'toVisit') {
      matchesTab = !!site.sitesToVisit && site.sitesToVisit > 0;
    } else if (activeTab === 'visited') {
      matchesTab = !!site.visitCount && site.visitCount > 0;
    }

    // Filtres avancés
    const matchesAdvancedFilters = 
      (filters.priority === '' || site.priority === filters.priority) &&
      (filters.status === '' || site.status === filters.status) &&
      (filters.monitoringPriority === '' || site.monitoringPriority === filters.monitoringPriority) &&
      (filters.requiredFrequency === '' || site.requiredFrequency === filters.requiredFrequency) &&
      (filters.fieldOffice === '' || site.subOfficeName === filters.fieldOffice) &&
      (filters.district === '' || site.district === filters.district) &&
      (filters.commune === '' || site.commune === filters.commune);

    return matchesSearch && matchesTab && matchesAdvancedFilters;
  });

  const getSiteStats = () => {
    const activeCount = sites.filter(site => site.activeSite === true).length;
    const toVisitCount = sites.filter(site => !!site.sitesToVisit && site.sitesToVisit > 0).length;
    const visitedCount = sites.filter(site => !!site.visitCount && site.visitCount > 0).length;
    const completionPercentage = sites.length > 0 ? Math.round((visitedCount / sites.length) * 100) : 0;
    
    return {
      activeCount,
      toVisitCount,
      visitedCount,
      total: sites.length,
      completionPercentage
    };
  };

  const stats = getSiteStats();

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Total des sites</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Sites actifs</div>
          <div className="text-2xl font-bold text-green-600">{stats.activeCount}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Sites à visiter</div>
          <div className="text-2xl font-bold text-amber-600">{stats.toVisitCount}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Suivi effectué</div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-blue-600">{stats.visitedCount}</div>
            <Progress value={stats.completionPercentage} className="h-2 mt-2" />
            <div className="text-xs text-right mt-1">{stats.completionPercentage}%</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsFilterDialogOpen(true)}
          className="flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" /> Filtres avancés
          {Object.values(filters).some(v => v !== '') && (
            <Badge className="ml-2 bg-app-blue">{Object.values(filters).filter(v => v !== '').length}</Badge>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">Tous les sites</TabsTrigger>
          <TabsTrigger value="active">Sites actifs</TabsTrigger>
          <TabsTrigger value="toVisit">À visiter</TabsTrigger>
          <TabsTrigger value="visited">Déjà visités</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0 pt-6">
          {isLoading ? (
            <div className="text-center py-10">Chargement des sites...</div>
          ) : (
            <SitesList 
              sites={filteredSites} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onUpdateMonthlyPlan={handleUpdateMonthlyPlan}
            />
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-0 pt-6">
          {isLoading ? (
            <div className="text-center py-10">Chargement des sites...</div>
          ) : (
            <SitesList 
              sites={filteredSites} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onUpdateMonthlyPlan={handleUpdateMonthlyPlan}
            />
          )}
        </TabsContent>
        <TabsContent value="toVisit" className="mt-0 pt-6">
          {isLoading ? (
            <div className="text-center py-10">Chargement des sites...</div>
          ) : (
            <SitesList 
              sites={filteredSites} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onUpdateMonthlyPlan={handleUpdateMonthlyPlan}
            />
          )}
        </TabsContent>
        <TabsContent value="visited" className="mt-0 pt-6">
          {isLoading ? (
            <div className="text-center py-10">Chargement des sites...</div>
          ) : (
            <SitesList 
              sites={filteredSites} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onUpdateMonthlyPlan={handleUpdateMonthlyPlan}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog pour ajouter ou modifier un site */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSiteId ? 'Modifier le site' : 'Ajouter un nouveau site'}</DialogTitle>
            <DialogDescription>
              {selectedSiteId 
                ? 'Modifiez les détails du site existant.' 
                : 'Remplissez les informations pour ajouter un nouveau site.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Tabs defaultValue="general">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="general">Informations générales</TabsTrigger>
                <TabsTrigger value="details">Détails additionnels</TabsTrigger>
                <TabsTrigger value="monitoring">Suivi et planification</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nom du site
                      </Label>
                      <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="subOfficeName" className="text-right">
                        Bureau
                      </Label>
                      <Input
                        id="subOfficeName"
                        value={formData.subOfficeName || ''}
                        onChange={(e) => setFormData({ ...formData, subOfficeName: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="antenne" className="text-right">
                        Antenne
                      </Label>
                      <Input
                        id="antenne"
                        value={formData.antenne || ''}
                        onChange={(e) => setFormData({ ...formData, antenne: e.target.value })}
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
                      <Label htmlFor="region" className="text-right">
                        Région
                      </Label>
                      <Input
                        id="region"
                        value={formData.region || ''}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="district" className="text-right">
                        District
                      </Label>
                      <Input
                        id="district"
                        value={formData.district || ''}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="commune" className="text-right">
                        Commune
                      </Label>
                      <Input
                        id="commune"
                        value={formData.commune || ''}
                        onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fokontany" className="text-right">
                        Fokontany
                      </Label>
                      <Input
                        id="fokontany"
                        value={formData.fokontany || ''}
                        onChange={(e) => setFormData({ ...formData, fokontany: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="gpsLatitude" className="text-right">
                        GPS Latitude
                      </Label>
                      <Input
                        id="gpsLatitude"
                        value={formData.gpsLatitude || ''}
                        onChange={(e) => setFormData({ ...formData, gpsLatitude: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="gpsLongitude" className="text-right">
                        GPS Longitude
                      </Label>
                      <Input
                        id="gpsLongitude"
                        value={formData.gpsLongitude || ''}
                        onChange={(e) => setFormData({ ...formData, gpsLongitude: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Statut
                      </Label>
                      <Select
                        value={formData.status || 'Actif'}
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
                      <Label htmlFor="activeSite" className="text-right">
                        Site actif
                      </Label>
                      <Select
                        value={formData.activeSite ? "true" : "false"}
                        onValueChange={(value) => setFormData({ ...formData, activeSite: value === "true" })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Site actif?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Oui</SelectItem>
                          <SelectItem value="false">Non</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="activityCategory" className="text-right">
                        Catégorie d'activité
                      </Label>
                      <Input
                        id="activityCategory"
                        value={formData.activityCategory || ''}
                        onChange={(e) => setFormData({ ...formData, activityCategory: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="programArea" className="text-right">
                        Zone de programme
                      </Label>
                      <Input
                        id="programArea"
                        value={formData.programArea || ''}
                        onChange={(e) => setFormData({ ...formData, programArea: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="modalityType" className="text-right">
                        Type de modalité
                      </Label>
                      <Select
                        value={formData.modalityType || ''}
                        onValueChange={(value) => setFormData({ ...formData, modalityType: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Type de modalité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Voucher">Voucher</SelectItem>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Capacity Strengthening">Capacity Strengthening</SelectItem>
                          <SelectItem value="Mix">Mix</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="beneficiaryNumber" className="text-right">
                        Nombre de bénéficiaires
                      </Label>
                      <Input
                        id="beneficiaryNumber"
                        type="number"
                        value={formData.beneficiaryNumber || ''}
                        onChange={(e) => setFormData({ ...formData, beneficiaryNumber: parseInt(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="securitySituation" className="text-right">
                        Situation sécuritaire
                      </Label>
                      <Select
                        value={String(formData.securitySituation || 0)}
                        onValueChange={(value) => setFormData({ ...formData, securitySituation: parseInt(value) })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Situation sécuritaire" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Pas de restriction</SelectItem>
                          <SelectItem value="1">1 - Restriction modérée</SelectItem>
                          <SelectItem value="3">3 - Restriction stricte</SelectItem>
                          <SelectItem value="99">99 - Zone interdite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="programmeSynergies" className="text-right">
                        Synergies de programme
                      </Label>
                      <Select
                        value={String(formData.programmeSynergies || 0)}
                        onValueChange={(value) => setFormData({ ...formData, programmeSynergies: parseInt(value) })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Synergies de programme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Une seule activité</SelectItem>
                          <SelectItem value="1">1 - Plus d'une activité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="newPartner" className="text-right">
                        Nouveau partenaire
                      </Label>
                      <Select
                        value={String(formData.newPartner || 0)}
                        onValueChange={(value) => setFormData({ ...formData, newPartner: parseInt(value) })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Nouveau partenaire" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Partenaire avec expérience</SelectItem>
                          <SelectItem value="1">1 - Nouveau partenaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="experiencedPartner" className="text-right">
                        Partenaire expérimenté
                      </Label>
                      <Select
                        value={String(formData.experiencedPartner || 0)}
                        onValueChange={(value) => setFormData({ ...formData, experiencedPartner: parseInt(value) })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Partenaire expérimenté" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Bonne expérience</SelectItem>
                          <SelectItem value="1">1 - Expérience moyenne</SelectItem>
                          <SelectItem value="2">2 - Expérience problématique</SelectItem>
                        </SelectContent>
                      </Select>
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
                </div>
              </TabsContent>
              
              <TabsContent value="monitoring">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="lastVisitDate" className="text-right">
                        Dernière visite
                      </Label>
                      <Input
                        id="lastVisitDate"
                        type="date"
                        value={formData.lastVisitDate || ''}
                        onChange={(e) => setFormData({ ...formData, lastVisitDate: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="monitoringPriority" className="text-right">
                        Priorité de suivi
                      </Label>
                      <Select
                        value={formData.monitoringPriority || 'Medium'}
                        onValueChange={(value) => setFormData({ ...formData, monitoringPriority: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Priorité de suivi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">Haute</SelectItem>
                          <SelectItem value="Medium">Moyenne</SelectItem>
                          <SelectItem value="Low">Basse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="requiredVisitInterval" className="text-right">
                        Intervalle requis (mois)
                      </Label>
                      <Input
                        id="requiredVisitInterval"
                        type="number"
                        value={formData.requiredVisitInterval || ''}
                        onChange={(e) => setFormData({ ...formData, requiredVisitInterval: parseInt(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="requiredFrequency" className="text-right">
                        Fréquence requise
                      </Label>
                      <Select
                        value={formData.requiredFrequency || ''}
                        onValueChange={(value) => setFormData({ ...formData, requiredFrequency: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Fréquence requise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly">Mensuelle</SelectItem>
                          <SelectItem value="Quarterly">Trimestrielle</SelectItem>
                          <SelectItem value="Biannual">Semestrielle</SelectItem>
                          <SelectItem value="Annual">Annuelle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="visitCount" className="text-right">
                        Nombre de visites
                      </Label>
                      <Input
                        id="visitCount"
                        type="number"
                        value={formData.visitCount || ''}
                        onChange={(e) => setFormData({ ...formData, visitCount: parseInt(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sitesToVisit" className="text-right">
                        Sites à visiter
                      </Label>
                      <Input
                        id="sitesToVisit"
                        type="number"
                        value={formData.sitesToVisit || ''}
                        onChange={(e) => setFormData({ ...formData, sitesToVisit: parseInt(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="finalScore" className="text-right">
                        Score final
                      </Label>
                      <Select
                        value={String(formData.finalScore || 0)}
                        onValueChange={(value) => setFormData({ ...formData, finalScore: parseInt(value) })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Score final" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Faible priorité</SelectItem>
                          <SelectItem value="1">1 - Priorité moyenne</SelectItem>
                          <SelectItem value="2">2 - Haute priorité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">
                        Priorité
                      </Label>
                      <Select
                        value={formData.priority || 'Normal'}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Priorité du site" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">Haute</SelectItem>
                          <SelectItem value="Normal">Normale</SelectItem>
                          <SelectItem value="Low">Basse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
      
      {/* Dialog pour les filtres avancés */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtres avancés</DialogTitle>
            <DialogDescription>
              Filtrez les sites selon des critères spécifiques
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filterStatus" className="text-right">
                Statut
              </Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="En maintenance">En maintenance</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filterPriority" className="text-right">
                Priorité
              </Label>
              <Select
                value={filters.priority}
                onValueChange={(value) => handleFilterChange('priority', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Toutes les priorités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes</SelectItem>
                  <SelectItem value="High">Haute</SelectItem>
                  <SelectItem value="Normal">Normale</SelectItem>
                  <SelectItem value="Low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filterMonitoringPriority" className="text-right">
                Priorité de suivi
              </Label>
              <Select
                value={filters.monitoringPriority}
                onValueChange={(value) => handleFilterChange('monitoringPriority', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Toutes les priorités de suivi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes</SelectItem>
                  <SelectItem value="High">Haute</SelectItem>
                  <SelectItem value="Medium">Moyenne</SelectItem>
                  <SelectItem value="Low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filterRequiredFrequency" className="text-right">
                Fréquence requise
              </Label>
              <Select
                value={filters.requiredFrequency}
                onValueChange={(value) => handleFilterChange('requiredFrequency', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Toutes les fréquences" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes</SelectItem>
                  <SelectItem value="Monthly">Mensuelle</SelectItem>
                  <SelectItem value="Quarterly">Trimestrielle</SelectItem>
                  <SelectItem value="Biannual">Semestrielle</SelectItem>
                  <SelectItem value="Annual">Annuelle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filterFieldOffice" className="text-right">
                Bureau
              </Label>
              <Select
                value={filters.fieldOffice}
                onValueChange={(value) => handleFilterChange('fieldOffice', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Tous les bureaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  {fieldOffices.map(office => (
                    <SelectItem key={office} value={office}>{office}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filterDistrict" className="text-right">
                District
              </Label>
              <Select
                value={filters.district}
                onValueChange={(value) => handleFilterChange('district', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Tous les districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filterCommune" className="text-right">
                Commune
              </Label>
              <Select
                value={filters.commune}
                onValueChange={(value) => handleFilterChange('commune', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Toutes les communes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes</SelectItem>
                  {communes.map(commune => (
                    <SelectItem key={commune} value={commune}>{commune}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser
            </Button>
            <Button 
              className="bg-app-blue hover:bg-app-lightBlue"
              onClick={() => setIsFilterDialogOpen(false)}
            >
              Appliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sites;
