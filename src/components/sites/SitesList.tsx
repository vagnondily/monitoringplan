
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
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Site } from '@/types';

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
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => requestSort('name')}>
              Nom du site {sortConfig?.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('location')}>
              Emplacement {sortConfig?.key === 'location' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('status')}>
              Statut {sortConfig?.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('lastUpdate')}>
              Dernière mise à jour {sortConfig?.key === 'lastUpdate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('ipAddress')}>
              Adresse IP {sortConfig?.key === 'ipAddress' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
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
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                Aucun site trouvé
              </TableCell>
            </TableRow>
          ) : (
            sortedSites.map((site) => (
              <TableRow key={site.id}>
                <TableCell className="font-medium">{site.name}</TableCell>
                <TableCell>{site.location}</TableCell>
                <TableCell>{getStatusBadge(site.status)}</TableCell>
                <TableCell>{site.lastUpdate}</TableCell>
                <TableCell>{site.ipAddress}</TableCell>
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
