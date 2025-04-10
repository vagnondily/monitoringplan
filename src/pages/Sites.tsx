
import React, { useState } from 'react';
import SitesList from '@/components/sites/SitesList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, MapPin, FileUp } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import LocationCreator from '@/components/locations/LocationCreator';
import { Site } from '@/types';

const Sites = () => {
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  
  // Mock data for sites list that matches the Site interface
  const mockSites: Site[] = [
    { 
      id: '1', 
      name: 'Site 1', 
      location: 'Location 1', 
      status: 'active', 
      lastUpdate: '2025-04-01',
      ipAddress: '192.168.1.1',
      manager: 'John Doe'
    },
    { 
      id: '2', 
      name: 'Site 2', 
      location: 'Location 2', 
      status: 'inactive', 
      lastUpdate: '2025-03-28',
      ipAddress: '192.168.1.2',
      manager: 'Jane Smith'
    },
    { 
      id: '3', 
      name: 'Site 3', 
      location: 'Location 3', 
      status: 'pending', 
      lastUpdate: '2025-04-05',
      ipAddress: '192.168.1.3',
      manager: 'Bob Johnson'
    },
  ];

  const handleEditSite = (site: Site) => {
    console.log(`Editing site with id: ${site.id}`);
  };

  // Changed the function signature to match what SitesList expects
  const handleDeleteSite = (id: string) => {
    console.log(`Deleting site with id: ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
        
        <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Ajouter un site
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau site</DialogTitle>
              <DialogDescription>
                Créez un nouveau site en saisissant les informations manuellement ou en important un fichier Excel.
              </DialogDescription>
            </DialogHeader>
            <LocationCreator />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="list">Liste des sites</TabsTrigger>
          <TabsTrigger value="map">Carte des sites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <SitesList 
            sites={mockSites} 
            onEdit={handleEditSite} 
            onDelete={handleDeleteSite} 
          />
        </TabsContent>
        
        <TabsContent value="map">
          <div className="border rounded-lg p-8 h-[600px] flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Visualisation cartographique</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Visualisez tous vos sites sur une carte interactive. Cliquez sur un marqueur pour voir les détails du site.
              </p>
              <Button variant="outline">Charger la carte</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sites;
