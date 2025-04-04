
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parametersService } from '@/services/parametersService';
import { OverarchingParameter } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Trash, Plus } from 'lucide-react';
import { toast } from 'sonner';

const OverarchingParameters = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedParameterId, setSelectedParameterId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<OverarchingParameter>>({
    cspActivityNumber: '',
    fieldOffice: '',
    activityCategory: '',
    operationDuration: 12,
    numberOfSites: 0,
    riskLevel: 1,
    minimumRequiredInterval: 3,
    targetedNumberOfSites: 0,
    feasibleNumberOfSites: 0,
    adjustedRequiredInterval: 0,
    feasibilityRatio: 0
  });

  const { data: parameters = [], isLoading } = useQuery<OverarchingParameter[]>({
    queryKey: ['overarching-parameters'],
    queryFn: parametersService.getOverarchingParameters
  });

  const createParameterMutation = useMutation({
    mutationFn: (newParameter: Omit<OverarchingParameter, 'id'>) => 
      parametersService.createOverarchingParameter(newParameter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overarching-parameters'] });
      resetFormAndCloseDialog();
      toast.success('Paramètre ajouté avec succès');
    }
  });

  const updateParameterMutation = useMutation({
    mutationFn: (parameter: OverarchingParameter) => 
      parametersService.updateOverarchingParameter(parameter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overarching-parameters'] });
      resetFormAndCloseDialog();
      toast.success('Paramètre mis à jour avec succès');
    }
  });

  const deleteParameterMutation = useMutation({
    mutationFn: (id: string) => 
      parametersService.deleteOverarchingParameter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overarching-parameters'] });
      setIsDeleteDialogOpen(false);
      toast.success('Paramètre supprimé avec succès');
    }
  });

  const resetFormAndCloseDialog = () => {
    setFormData({
      cspActivityNumber: '',
      fieldOffice: '',
      activityCategory: '',
      operationDuration: 12,
      numberOfSites: 0,
      riskLevel: 1,
      minimumRequiredInterval: 3,
      targetedNumberOfSites: 0,
      feasibleNumberOfSites: 0,
      adjustedRequiredInterval: 0,
      feasibilityRatio: 0
    });
    setIsAddDialogOpen(false);
    setSelectedParameterId(null);
  };

  const handleAddOrEdit = () => {
    // Calcul automatique du ratio de faisabilité
    const feasibilityRatio = formData.targetedNumberOfSites && formData.feasibleNumberOfSites 
      ? parseFloat((formData.feasibleNumberOfSites / formData.targetedNumberOfSites).toFixed(2))
      : 0;

    if (selectedParameterId) {
      // Édition
      updateParameterMutation.mutate({
        ...formData,
        id: selectedParameterId,
        feasibilityRatio
      } as OverarchingParameter);
    } else {
      // Ajout
      createParameterMutation.mutate({
        ...formData,
        feasibilityRatio
      } as Omit<OverarchingParameter, 'id'>);
    }
  };

  const handleEdit = (parameter: OverarchingParameter) => {
    setFormData(parameter);
    setSelectedParameterId(parameter.id);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedParameterId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedParameterId) {
      deleteParameterMutation.mutate(selectedParameterId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Paramètres généraux de suivi</h2>
        <Button 
          className="bg-app-blue hover:bg-app-lightBlue"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Ajouter un paramètre
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Chargement des paramètres...</div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CSP Activity Number</TableHead>
                <TableHead>Field Office</TableHead>
                <TableHead>Activity Category</TableHead>
                <TableHead>Duration (months)</TableHead>
                <TableHead>Sites</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Min. Interval</TableHead>
                <TableHead>Target Sites/Month</TableHead>
                <TableHead>Feasible Sites/Month</TableHead>
                <TableHead>Adjusted Interval</TableHead>
                <TableHead>Feasibility Ratio</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parameters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-6 text-gray-500">
                    Aucun paramètre trouvé
                  </TableCell>
                </TableRow>
              ) : (
                parameters.map((parameter) => (
                  <TableRow key={parameter.id}>
                    <TableCell>{parameter.cspActivityNumber}</TableCell>
                    <TableCell>{parameter.fieldOffice}</TableCell>
                    <TableCell>{parameter.activityCategory}</TableCell>
                    <TableCell>{parameter.operationDuration}</TableCell>
                    <TableCell>{parameter.numberOfSites}</TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 rounded-full text-center text-xs font-medium ${
                        parameter.riskLevel === 1 ? 'bg-green-100 text-green-800' :
                        parameter.riskLevel === 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {parameter.riskLevel === 1 ? 'Low' :
                         parameter.riskLevel === 2 ? 'Medium' : 'High'}
                      </div>
                    </TableCell>
                    <TableCell>{parameter.minimumRequiredInterval}</TableCell>
                    <TableCell>{parameter.targetedNumberOfSites}</TableCell>
                    <TableCell>{parameter.feasibleNumberOfSites}</TableCell>
                    <TableCell>{parameter.adjustedRequiredInterval}</TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 rounded-full text-center text-xs font-medium ${
                        parameter.feasibilityRatio >= 0.9 ? 'bg-green-100 text-green-800' :
                        parameter.feasibilityRatio >= 0.7 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {(parameter.feasibilityRatio * 100).toFixed(0)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(parameter)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(parameter.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog pour ajouter ou modifier un paramètre */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedParameterId ? 'Modifier le paramètre' : 'Ajouter un nouveau paramètre'}</DialogTitle>
            <DialogDescription>
              {selectedParameterId 
                ? 'Modifiez les détails du paramètre existant.' 
                : 'Remplissez les informations pour ajouter un nouveau paramètre.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cspActivityNumber" className="text-right">
                CSP Activity Number
              </Label>
              <Input
                id="cspActivityNumber"
                value={formData.cspActivityNumber || ''}
                onChange={(e) => setFormData({ ...formData, cspActivityNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fieldOffice" className="text-right">
                Field Office
              </Label>
              <Input
                id="fieldOffice"
                value={formData.fieldOffice || ''}
                onChange={(e) => setFormData({ ...formData, fieldOffice: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activityCategory" className="text-right">
                Activity Category
              </Label>
              <Input
                id="activityCategory"
                value={formData.activityCategory || ''}
                onChange={(e) => setFormData({ ...formData, activityCategory: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="operationDuration" className="text-right">
                Operation Duration (months)
              </Label>
              <Input
                id="operationDuration"
                type="number"
                value={formData.operationDuration || 0}
                onChange={(e) => setFormData({ ...formData, operationDuration: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numberOfSites" className="text-right">
                Number of Sites
              </Label>
              <Input
                id="numberOfSites"
                type="number"
                value={formData.numberOfSites || 0}
                onChange={(e) => setFormData({ ...formData, numberOfSites: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="riskLevel" className="text-right">
                Risk Level
              </Label>
              <Select
                value={String(formData.riskLevel || 1)}
                onValueChange={(value) => setFormData({ ...formData, riskLevel: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Niveau de risque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Low (1)</SelectItem>
                  <SelectItem value="2">Medium (2)</SelectItem>
                  <SelectItem value="3">High (3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minimumRequiredInterval" className="text-right">
                Min. Required Interval (months)
              </Label>
              <Input
                id="minimumRequiredInterval"
                type="number"
                value={formData.minimumRequiredInterval || 0}
                onChange={(e) => setFormData({ ...formData, minimumRequiredInterval: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetedNumberOfSites" className="text-right">
                Targeted Sites/Month
              </Label>
              <Input
                id="targetedNumberOfSites"
                type="number"
                value={formData.targetedNumberOfSites || 0}
                onChange={(e) => setFormData({ ...formData, targetedNumberOfSites: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="feasibleNumberOfSites" className="text-right">
                Feasible Sites/Month
              </Label>
              <Input
                id="feasibleNumberOfSites"
                type="number"
                value={formData.feasibleNumberOfSites || 0}
                onChange={(e) => setFormData({ ...formData, feasibleNumberOfSites: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adjustedRequiredInterval" className="text-right">
                Adjusted Required Interval
              </Label>
              <Input
                id="adjustedRequiredInterval"
                type="number"
                value={formData.adjustedRequiredInterval || 0}
                onChange={(e) => setFormData({ ...formData, adjustedRequiredInterval: parseInt(e.target.value) })}
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
              disabled={createParameterMutation.isPending || updateParameterMutation.isPending}
            >
              {selectedParameterId ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation pour la suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce paramètre?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le paramètre
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
    </div>
  );
};

export default OverarchingParameters;
