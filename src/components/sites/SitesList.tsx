
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Edit, MoreHorizontal, Trash, MapPin, Check, AlertCircle } from 'lucide-react';
import { Site } from '@/types';
import { Progress } from '@/components/ui/progress';

interface SitesListProps {
  sites: Site[];
  onEdit: (site: Site) => void;
  onDelete: (id: string) => void;
}

const SitesList = ({ sites, onEdit, onDelete }: SitesListProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Site;
    direction: 'ascending' | 'descending';
  } | null>(null);

  const sortedSites = React.useMemo(() => {
    let sortableSites = [...sites];
    if (sortConfig !== null) {
      sortableSites.sort((a, b) => {
        // Gestion spéciale pour les booléens
        if (typeof a[sortConfig.key] === 'boolean' && typeof b[sortConfig.key] === 'boolean') {
          const aValue = a[sortConfig.key] as boolean;
          const bValue = b[sortConfig.key] as boolean;
          return sortConfig.direction === 'ascending' 
            ? (aValue === bValue ? 0 : aValue ? -1 : 1)
            : (aValue === bValue ? 0 : aValue ? 1 : -1);
        }
        
        // Gestion des valeurs non définies
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableSites;
  }, [sites, sortConfig]);

  const requestSort = (key: keyof Site) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'actif':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'en maintenance':
        return <Badge className="bg-yellow-500">En maintenance</Badge>;
      case 'inactif':
        return <Badge className="bg-red-500">Inactif</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    switch(priority.toLowerCase()) {
      case 'high':
        return <Badge className="bg-red-500">Haute</Badge>;
      case 'normal':
      case 'medium':
        return <Badge className="bg-yellow-500">Moyenne</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Basse</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getActiveStatusIcon = (active?: boolean) => {
    if (active === undefined) return null;
    
    return active 
      ? <Check className="h-5 w-5 text-green-500" /> 
      : <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
  };

  const getVisitProgress = (site: Site) => {
    const toVisit = site.sitesToVisit || 0;
    const visited = site.visitCount || 0;
    
    if (toVisit === 0) return null;
    
    const percentage = Math.min(Math.round((visited / toVisit) * 100), 100);
    
    return (
      <div className="w-full">
        <Progress value={percentage} className="h-2" />
        <div className="text-xs text-right mt-1">{visited}/{toVisit} ({percentage}%)</div>
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-center">
              <div className="cursor-pointer" onClick={() => requestSort('activeSite')}>
                Actif {sortConfig?.key === 'activeSite' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('name')}>
              Nom du site {sortConfig?.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('location')}>
              Emplacement {sortConfig?.key === 'location' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('status')}>
              Statut {sortConfig?.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('monitoringPriority')}>
              Priorité de suivi {sortConfig?.key === 'monitoringPriority' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('lastVisitDate')}>
              Dernière visite {sortConfig?.key === 'lastVisitDate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('visitCount')}>
              Suivi {sortConfig?.key === 'visitCount' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('manager')}>
              Responsable {sortConfig?.key === 'manager' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSites.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                Aucun site trouvé
              </TableCell>
            </TableRow>
          ) : (
            sortedSites.map((site) => (
              <TableRow key={site.id}>
                <TableCell className="text-center">{getActiveStatusIcon(site.activeSite)}</TableCell>
                <TableCell className="font-medium">{site.name}</TableCell>
                <TableCell>
                  <div className="flex items-start gap-1">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" /> 
                    <div>
                      <div>{site.location}</div>
                      {site.region && <div className="text-xs text-gray-500">{site.region}, {site.district}</div>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(site.status)}</TableCell>
                <TableCell>{getPriorityBadge(site.monitoringPriority)}</TableCell>
                <TableCell>{site.lastVisitDate || 'Jamais'}</TableCell>
                <TableCell>{getVisitProgress(site)}</TableCell>
                <TableCell>{site.manager}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(site)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(site.id)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SitesList;
