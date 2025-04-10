import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parametersService, FIELD_OFFICES } from '@/services/parametersService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Save, Trash } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OverarchingParameter } from '@/types';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

const OverarchingParameters = () => {
  const [isAddParameterOpen, setIsAddParameterOpen] = useState(false);
  const [parameter, setParameter] = useState<Partial<OverarchingParameter>>({
    cspActivityNumber: '',
    fieldOffice: '',
    activityCategory: '',
    operationDuration: 6,
    numberOfSites: 0,
    riskLevel: 1,
    feasibleNumberOfSites: 0
  });

  const queryClient = useQueryClient();

  const { data: parameters = [], isLoading } = useQuery({
    queryKey: ['overarching-parameters'],
    queryFn: parametersService.getOverarchingParameters
  });

  const { data: activityCategoriesList = [] } = useQuery({
    queryKey: ['activity-categories'],
    queryFn: parametersService.getActivityCategories
  });

  const createMutation = useMutation({
    mutationFn: parametersService.createOverarchingParameter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overarching-parameters'] });
      setIsAddParameterOpen(false);
      setParameter({
        cspActivityNumber: '',
        fieldOffice: '',
        activityCategory: '',
        operationDuration: 6,
        numberOfSites: 0,
        riskLevel: 1,
        feasibleNumberOfSites: 0
      });
      toast.success('Paramètre général ajouté avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout du paramètre');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: parametersService.deleteOverarchingParameter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overarching-parameters'] });
      toast.success('Paramètre supprimé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du paramètre');
    }
  });

  const handleInputChange = (field: string, value: string | number) => {
    setParameter(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calculate derived values automatically
      return parametersService.calculateDerivedValues(updated);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!parameter.cspActivityNumber || !parameter.fieldOffice || !parameter.activityCategory) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    createMutation.mutate(parameter as any);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce paramètre?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Paramètres généraux</h2>
          <p className="text-muted-foreground">
            Gérez les paramètres généraux de suivi et d'évaluation pour les activités.
          </p>
        </div>
        
        <Dialog open={isAddParameterOpen} onOpenChange={setIsAddParameterOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un paramètre général
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un paramètre général</DialogTitle>
              <DialogDescription>
                Définissez les paramètres généraux pour une catégorie d'activité spécifique.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cspActivityNumber">Numéro d'activité CSP *</Label>
                  <Input
                    id="cspActivityNumber"
                    value={parameter.cspActivityNumber}
                    onChange={(e) => handleInputChange('cspActivityNumber', e.target.value)}
                    placeholder="ex: CSP-MDG-2023-001"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fieldOffice">Bureau de terrain *</Label>
                  <Select 
                    value={parameter.fieldOffice} 
                    onValueChange={(value) => handleInputChange('fieldOffice', value)}
                  >
                    <SelectTrigger id="fieldOffice">
                      <SelectValue placeholder="Sélectionner un bureau" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_OFFICES.map(office => (
                        <SelectItem key={office} value={office}>{office}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="activityCategory">Catégorie d'activité *</Label>
                  <Select 
                    value={parameter.activityCategory} 
                    onValueChange={(value) => handleInputChange('activityCategory', value)}
                  >
                    <SelectTrigger id="activityCategory">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityCategoriesList.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="operationDuration">Durée de l'opération (mois) *</Label>
                  <Input
                    id="operationDuration"
                    type="number"
                    min="1"
                    value={parameter.operationDuration}
                    onChange={(e) => handleInputChange('operationDuration', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="numberOfSites">Nombre de sites *</Label>
                  <Input
                    id="numberOfSites"
                    type="number"
                    min="1"
                    value={parameter.numberOfSites}
                    onChange={(e) => handleInputChange('numberOfSites', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="riskLevel">Niveau de risque (1-3) *</Label>
                  <Select 
                    value={parameter.riskLevel?.toString()} 
                    onValueChange={(value) => handleInputChange('riskLevel', parseInt(value))}
                  >
                    <SelectTrigger id="riskLevel">
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Faible</SelectItem>
                      <SelectItem value="2">2 - Moyen</SelectItem>
                      <SelectItem value="3">3 - Élevé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feasibleNumberOfSites">Nombre de sites faisables par mois *</Label>
                  <Input
                    id="feasibleNumberOfSites"
                    type="number"
                    min="1"
                    value={parameter.feasibleNumberOfSites}
                    onChange={(e) => handleInputChange('feasibleNumberOfSites', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-muted/20">
                <h3 className="font-medium mb-2">Valeurs calculées</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Intervalle requis minimum</Label>
                    <div className="font-medium">{parameter.minimumRequiredInterval || '-'}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Nombre de sites ciblés</Label>
                    <div className="font-medium">{parameter.targetedNumberOfSites || '-'}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Ratio de faisabilité</Label>
                    <div className="font-medium">{parameter.feasibilityRatio || '-'}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Intervalle requis ajusté</Label>
                    <div className="font-medium">{parameter.adjustedRequiredInterval || '-'}</div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {createMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des paramètres généraux</CardTitle>
          <CardDescription>
            Consultez et gérez les paramètres généraux définis pour chaque activité.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">Chargement des paramètres...</div>
          ) : parameters.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Aucun paramètre général défini. Cliquez sur "Ajouter un paramètre général" pour commencer.
            </div>
          ) : (
            <Table>
              <TableCaption>Liste des paramètres généraux de suivi et d'évaluation</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro CSP</TableHead>
                  <TableHead>Bureau</TableHead>
                  <TableHead>Catégorie d'activité</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Sites</TableHead>
                  <TableHead>Risque</TableHead>
                  <TableHead>Intervalle requis</TableHead>
                  <TableHead>Intervalle ajusté</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parameters.map((param) => (
                  <TableRow key={param.id}>
                    <TableCell>{param.cspActivityNumber}</TableCell>
                    <TableCell>{param.fieldOffice}</TableCell>
                    <TableCell>{param.activityCategory}</TableCell>
                    <TableCell>{param.operationDuration} mois</TableCell>
                    <TableCell>{param.numberOfSites}</TableCell>
                    <TableCell>{param.riskLevel}</TableCell>
                    <TableCell>{param.minimumRequiredInterval}</TableCell>
                    <TableCell>{param.adjustedRequiredInterval}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(param.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverarchingParameters;
