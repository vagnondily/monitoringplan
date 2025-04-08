
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Map, Filter, Download, Search, Info, Users, Home, Calendar, ChevronRight } from 'lucide-react';

const MapVisualization = () => {
  const [regionFilter, setRegionFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Données fictives pour la démonstration
  const statistiques = {
    total: 156,
    actifs: 142,
    inactifs: 14,
    parRegion: {
      nord: 42,
      sud: 38,
      est: 45,
      ouest: 31
    },
    parType: {
      écoles: 89,
      centres: 42,
      communautaires: 25
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Map className="h-8 w-8 text-app-blue" /> 
          Visualisation cartographique des sites
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} /> Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-1 md:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filtres</CardTitle>
            <CardDescription>Filtrer les sites affichés sur la carte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Région" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les régions</SelectItem>
                    <SelectItem value="nord">Nord</SelectItem>
                    <SelectItem value="sud">Sud</SelectItem>
                    <SelectItem value="est">Est</SelectItem>
                    <SelectItem value="ouest">Ouest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Projet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les projets</SelectItem>
                    <SelectItem value="alimentation">Alimentation scolaire</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un site..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="bg-app-blue">
                <Filter size={16} className="mr-2" /> Appliquer les filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Statistiques générales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Nombre total de sites:</span>
                <Badge variant="outline" className="text-lg font-bold">{statistiques.total}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sites actifs:</span>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">{statistiques.actifs}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sites inactifs:</span>
                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">{statistiques.inactifs}</Badge>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Dernière synchronisation</h4>
                <p className="text-sm text-muted-foreground">08/04/2025, 10:45:22</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Distribution par région</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Nord
                </span>
                <span className="font-medium">{statistiques.parRegion.nord}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Sud
                </span>
                <span className="font-medium">{statistiques.parRegion.sud}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Est
                </span>
                <span className="font-medium">{statistiques.parRegion.est}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  Ouest
                </span>
                <span className="font-medium">{statistiques.parRegion.ouest}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Distribution par type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Écoles
                </span>
                <span className="font-medium">{statistiques.parType.écoles}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Centres de santé
                </span>
                <span className="font-medium">{statistiques.parType.centres}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Sites communautaires
                </span>
                <span className="font-medium">{statistiques.parType.communautaires}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Légende</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span>Site actif</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span>Site inactif</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                <span>Site en attente de validation</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span>Site visité ce mois</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3 md:row-span-2 h-[500px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Carte</CardTitle>
            <CardDescription>Visualisation géographique des sites</CardDescription>
          </CardHeader>
          <CardContent className="h-full relative">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
              <div className="text-center space-y-2">
                <Map size={64} className="mx-auto text-gray-400" />
                <p className="text-muted-foreground">Carte en cours de chargement...</p>
                <p className="text-sm text-muted-foreground">La carte interactive affichera les emplacements des sites en fonction des filtres sélectionnés.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sites récemment modifiés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <div className="flex justify-between">
                  <h4 className="font-medium">École primaire Ambohipo</h4>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Actif</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Modifié il y a 2 heures</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">Antananarivo</span>
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-3">
                <div className="flex justify-between">
                  <h4 className="font-medium">Centre de santé Toliara</h4>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">En attente</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Modifié il y a 1 jour</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">Toliara</span>
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapVisualization;
