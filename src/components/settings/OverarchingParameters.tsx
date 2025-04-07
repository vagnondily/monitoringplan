
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parametersService, activityCategories } from '@/services/parametersService';
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
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash, Plus, Calculator, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
    minimumRequiredInterval: 0,
    targetedNumberOfSites: 0,
    feasibleNumberOfSites: 0,
    adjustedRequiredInterval: 0,
    feasibilityRatio: 0
  });

  const { data: parameters = [], isLoading } = useQuery<OverarchingParameter[]>({
    queryKey: ['overarching-parameters'],
    queryFn: parametersService.getOverarchingParameters
  });

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ['activity-categories'],
    queryFn: parametersService.getActivityCategories
  });

  // Fonction de calcul automatique des valeurs dérivées
  const calculateDerivedValues = () => {
    const updatedData = parametersService.calculateDerivedValues(formData);
    setFormData(updatedData);
  };

  // Mettre à jour les valeurs dérivées lorsque les valeurs de base changent
  useEffect(() => {
    if (formData.operationDuration && formData.riskLevel && formData.numberOfSites) {
      calculateDerivedValues();
    }
  }, [formData.operationDuration, formData.riskLevel, formData.numberOfSites, formData.feasibleNumberOfSites]);

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
      minimumRequiredInterval: 0,
      targetedNumberOfSites: 0,
      feasibleNumberOfSites: 0,
      adjustedRequiredInterval: 0,
      feasibilityRatio: 0
    });
    setIsAddDialogOpen(false);
    setSelectedParameterId(null);
  };

  const handleAddOrEdit = () => {
    // S'assurer que toutes les valeurs dérivées sont calculées
    const updatedData = parametersService.calculateDerivedValues(formData);

    if (selectedParameterId) {
      // Édition
      updateParameterMutation.mutate({
        ...updatedData,
        id: selectedParameterId
      } as OverarchingParameter);
    } else {
      // Ajout
      createParameterMutation.mutate(updatedData as Omit<OverarchingParameter, 'id'>);
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

  // Composant pour afficher les tooltips d'information
  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Paramètres généraux de suivi</h2>
        <Button 
          className="bg-app-blue hover:bg-app-lightBlue"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Ajouter un paramètre
        </Button>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <p className="mb-2">
            <strong>Légende des calculs automatiques :</strong>
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>
              <strong>Minimum Required Interval</strong>: Operation Duration ÷ Risk Level
            </li>
            <li>
              <strong>Targeted Sites/Month</strong>: Number of Sites ÷ Minimum Required Interval
            </li>
            <li>
              <strong>Adjusted Interval</strong>: Le résultat de Operation Duration ÷ (Minimum Required Frequency × Feasibility Ratio), avec un minimum de 1
            </li>
            <li>
              <strong>Feasibility Ratio</strong>: Feasible Sites ÷ Targeted Sites
            </li>
          </ul>
        </CardContent>
      </Card>

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
                <TableHead>
                  Duration (months)
                  <InfoTooltip content="Durée de l'opération en mois" />
                </TableHead>
                <TableHead>
                  Sites
                  <InfoTooltip content="Nombre total de sites dans cette catégorie d'activité" />
                </TableHead>
                <TableHead>
                  Risk Level
                  <InfoTooltip content="1=Low, 2=Medium, 3=High" />
                </TableHead>
                <TableHead>
                  Min. Interval
                  <InfoTooltip content="Operation Duration ÷ Risk Level" />
                </TableHead>
                <TableHead>
                  Target Sites/Month
                  <InfoTooltip content="Number of Sites ÷ Minimum Required Interval" />
                </TableHead>
                <TableHead>
                  Feasible Sites/Month
                  <InfoTooltip content="Nombre de sites qu'il est réaliste de visiter par mois" />
                </TableHead>
                <TableHead>
                  Adjusted Interval
                  <InfoTooltip content="Intervalle ajusté en fonction de la capacité réelle" />
                </TableHead>
                <TableHead>
                  Feasibility Ratio
                  <InfoTooltip content="Feasible Sites ÷ Targeted Sites" />
                </TableHead>
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
                        parameter.feasibilityRatio >= 0.8 ? 'bg-green-100 text-green-800' :
                        parameter.feasibilityRatio >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedParameterId ? 'Modifier le paramètre' : 'Ajouter un nouveau paramètre'}</DialogTitle>
            <DialogDescription>
              {selectedParameterId 
                ? 'Modifiez les détails du paramètre existant.' 
                : 'Remplissez les informations pour ajouter un nouveau paramètre.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
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
            
            <div className="grid grid-cols-2 items-center gap-4">
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
            
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="activityCategory" className="text-right">
                Activity Category
              </Label>
              <Select
                value={formData.activityCategory || ''}
                onValueChange={(value) => setFormData({ ...formData, activityCategory: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="operationDuration" className="text-right">
                Operation Duration
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="operationDuration"
                  type="number"
                  min="1"
                  value={formData.operationDuration || 0}
                  onChange={(e) => setFormData({ ...formData, operationDuration: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">mois</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="numberOfSites" className="text-right">
                Number of Sites
              </Label>
              <Input
                id="numberOfSites"
                type="number"
                min="0"
                value={formData.numberOfSites || 0}
                onChange={(e) => setFormData({ ...formData, numberOfSites: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
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
            
            {/* Cette section affiche les valeurs calculées */}
            <div className="grid grid-cols-2 items-center gap-4">
              <Label className="text-right font-semibold">
                Min. Required Interval
              </Label>
              <div className="col-span-3 flex items-center">
                <span className="px-3 py-2 border rounded-md bg-gray-50 w-full">
                  {formData.minimumRequiredInterval} mois
                </span>
                <InfoTooltip content="Operation Duration ÷ Risk Level" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <Label className="text-right font-semibold">
                Target Sites/Month
              </Label>
              <div className="col-span-3 flex items-center">
                <span className="px-3 py-2 border rounded-md bg-gray-50 w-full">
                  {formData.targetedNumberOfSites} sites
                </span>
                <InfoTooltip content="Number of Sites ÷ Minimum Required Interval" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="feasibleNumberOfSites" className="text-right">
                Feasible Sites/Month
              </Label>
              <Input
                id="feasibleNumberOfSites"
                type="number"
                min="0"
                value={formData.feasibleNumberOfSites || 0}
                onChange={(e) => setFormData({ ...formData, feasibleNumberOfSites: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <Label className="text-right font-semibold">
                Adjusted Interval
              </Label>
              <div className="col-span-3 flex items-center">
                <span className="px-3 py-2 border rounded-md bg-gray-50 w-full">
                  {formData.adjustedRequiredInterval} mois
                </span>
                <InfoTooltip content="Intervalle ajusté en fonction de la capacité réelle" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <Label className="text-right font-semibold">
                Feasibility Ratio
              </Label>
              <div className="col-span-3 flex items-center">
                <span className={`px-3 py-2 border rounded-md w-full ${
                  formData.feasibilityRatio >= 0.8 ? 'bg-green-50 text-green-700' :
                  formData.feasibilityRatio >= 0.6 ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {formData.feasibilityRatio ? `${(formData.feasibilityRatio * 100).toFixed(0)}%` : '0%'}
                </span>
                <InfoTooltip content="Feasible Sites ÷ Targeted Sites" />
              </div>
            </div>

            <div className="col-span-4 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center gap-2"
                onClick={calculateDerivedValues}
              >
                <Calculator className="h-4 w-4" />
                Recalculer toutes les valeurs
              </Button>
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
