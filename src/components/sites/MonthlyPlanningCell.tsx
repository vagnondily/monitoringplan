
import React, { useState } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Check, X } from 'lucide-react';
import { Site } from '@/types';

interface MonthlyPlanningCellProps {
  site: Site;
  month: string;
  onUpdate: (siteId: string, month: string, data: any) => void;
}

const monthNames = {
  'janvier': 'Janvier',
  'février': 'Février',
  'mars': 'Mars',
  'avril': 'Avril',
  'mai': 'Mai',
  'juin': 'Juin',
  'juillet': 'Juillet',
  'août': 'Août',
  'septembre': 'Septembre',
  'octobre': 'Octobre',
  'novembre': 'Novembre',
  'décembre': 'Décembre'
};

const MonthlyPlanningCell = ({ site, month, onUpdate }: MonthlyPlanningCellProps) => {
  const monthData = site.monthlyActivities && site.monthlyActivities[month.toLowerCase()];
  const isActive = monthData?.active || false;
  const isPlanned = monthData?.planned || false;
  const isActual = monthData?.actual || false;

  const [formData, setFormData] = useState({
    active: isActive,
    cpName: monthData?.cpName || '',
    planned: isPlanned,
    actual: isActual,
    missionReport: monthData?.missionReport || '',
    modaReport: monthData?.modaReport || '',
    missionary: monthData?.missionary || ''
  });

  const handleUpdate = () => {
    onUpdate(site.id, month.toLowerCase(), formData);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className={`w-full h-8 p-0 flex justify-center items-center ${
            isActive 
              ? (isPlanned 
                ? (isActual ? 'bg-green-100' : 'bg-yellow-100') 
                : 'bg-gray-100') 
              : 'bg-gray-50'
          }`}
        >
          {isActive && (
            <>
              {isPlanned && (
                isActual 
                  ? <Check className="h-4 w-4 text-green-600" /> 
                  : <span className="h-4 w-4 rounded-full border-2 border-yellow-400" />
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">{monthNames[month.toLowerCase()] || month} - {site.name}</h4>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id={`active-${site.id}-${month}`} 
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
            <Label htmlFor={`active-${site.id}-${month}`}>Site actif ce mois</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`cp-${site.id}-${month}`}>Nom du CP</Label>
            <Input 
              id={`cp-${site.id}-${month}`} 
              value={formData.cpName} 
              onChange={(e) => setFormData({ ...formData, cpName: e.target.value })}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id={`planned-${site.id}-${month}`} 
              checked={formData.planned}
              onCheckedChange={(checked) => setFormData({ ...formData, planned: checked })}
            />
            <Label htmlFor={`planned-${site.id}-${month}`}>Visite planifiée</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id={`actual-${site.id}-${month}`} 
              checked={formData.actual}
              onCheckedChange={(checked) => setFormData({ ...formData, actual: checked })}
            />
            <Label htmlFor={`actual-${site.id}-${month}`}>Visite effectuée</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`missionary-${site.id}-${month}`}>Missionnaire</Label>
            <Input 
              id={`missionary-${site.id}-${month}`} 
              value={formData.missionary} 
              onChange={(e) => setFormData({ ...formData, missionary: e.target.value })}
            />
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" /> Annuler
            </Button>
            <Button size="sm" onClick={handleUpdate}>
              <Check className="h-4 w-4 mr-2" /> Enregistrer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MonthlyPlanningCell;
