
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Key, FileKey, Lock, PlusCircle, Trash2, Edit, CheckCircle, Shield } from 'lucide-react';
import { OdkDecryptionKey, OdkForm } from '@/types/odk';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { odkService } from '@/services/odkService';

const OdkDecryptionManager = () => {
  const [isAddKeyDialogOpen, setIsAddKeyDialogOpen] = useState(false);
  const [newKey, setNewKey] = useState<Partial<OdkDecryptionKey>>({});
  const [selectedForm, setSelectedForm] = useState<OdkForm | null>(null);
  const queryClient = useQueryClient();

  // Charger les formulaires cryptés
  const { 
    data: encryptedForms = [], 
    isLoading: isLoadingForms,
    error: formsError
  } = useQuery({
    queryKey: ['encryptedForms'],
    queryFn: odkService.getEncryptedForms
  });

  // Charger les clés de déchiffrement
  const { 
    data: decryptionKeys = [], 
    isLoading: isLoadingKeys,
    error: keysError
  } = useQuery({
    queryKey: ['decryptionKeys'],
    queryFn: odkService.getDecryptionKeys
  });

  // Mutation pour ajouter une clé
  const addKeyMutation = useMutation({
    mutationFn: (key: Omit<OdkDecryptionKey, 'id' | 'createdAt'>) => 
      odkService.saveDecryptionKey(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decryptionKeys'] });
      toast.success('Clé de déchiffrement ajoutée avec succès');
      setIsAddKeyDialogOpen(false);
      setNewKey({});
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'ajout de la clé: ${error.message}`);
    }
  });

  // Mutation pour supprimer une clé
  const deleteKeyMutation = useMutation({
    mutationFn: (keyId: string) => odkService.deleteDecryptionKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decryptionKeys'] });
      toast.success('Clé de déchiffrement supprimée');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression de la clé: ${error.message}`);
    }
  });

  const handleAddKey = () => {
    if (!newKey.name || !newKey.formId || !newKey.key) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    addKeyMutation.mutate({
      name: newKey.name,
      formId: newKey.formId,
      key: newKey.key
    });
  };

  const handleDeleteKey = (keyId: string) => {
    deleteKeyMutation.mutate(keyId);
  };

  const handleOpenAddKeyDialog = (form?: OdkForm) => {
    if (form) {
      setSelectedForm(form);
      setNewKey({ formId: form.id });
    } else {
      setSelectedForm(null);
      setNewKey({});
    }
    setIsAddKeyDialogOpen(true);
  };

  // Afficher les erreurs de chargement
  useEffect(() => {
    if (formsError) {
      toast.error(`Erreur lors du chargement des formulaires: ${formsError instanceof Error ? formsError.message : 'Erreur inconnue'}`);
    }
    if (keysError) {
      toast.error(`Erreur lors du chargement des clés: ${keysError instanceof Error ? keysError.message : 'Erreur inconnue'}`);
    }
  }, [formsError, keysError]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-app-blue" />
            Gestionnaire de déchiffrement ODK
          </CardTitle>
          <CardDescription>
            Gérez les clés de déchiffrement pour les formulaires ODK cryptés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Formulaires cryptés</h3>
              <Button onClick={() => handleOpenAddKeyDialog()} variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter une clé
              </Button>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du formulaire</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Soumissions</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingForms ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Chargement des formulaires...
                      </TableCell>
                    </TableRow>
                  ) : encryptedForms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Aucun formulaire crypté trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    encryptedForms.map(form => {
                      const hasKey = decryptionKeys.some(key => key.formId === form.id);
                      return (
                        <TableRow key={form.id}>
                          <TableCell className="font-medium">{form.name}</TableCell>
                          <TableCell>{form.version}</TableCell>
                          <TableCell>{form.submissionCount}</TableCell>
                          <TableCell>
                            {hasKey ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="mr-1 h-4 w-4" />
                                <span>Déchiffrable</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-amber-600">
                                <Lock className="mr-1 h-4 w-4" />
                                <span>Clé requise</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleOpenAddKeyDialog(form)}
                              disabled={hasKey}
                            >
                              <Key className="h-4 w-4 mr-1" />
                              {hasKey ? 'Clé configurée' : 'Ajouter une clé'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-medium">Clés de déchiffrement enregistrées</h3>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Formulaire</TableHead>
                      <TableHead>Date d'ajout</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingKeys ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          Chargement des clés...
                        </TableCell>
                      </TableRow>
                    ) : decryptionKeys.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          Aucune clé de déchiffrement enregistrée
                        </TableCell>
                      </TableRow>
                    ) : (
                      decryptionKeys.map(key => {
                        const formName = encryptedForms.find(f => f.id === key.formId)?.name || key.formId;
                        return (
                          <TableRow key={key.id}>
                            <TableCell className="font-medium">{key.name}</TableCell>
                            <TableCell>{formName}</TableCell>
                            <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteKey(key.id)}
                                disabled={deleteKeyMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t px-6 py-3">
          <div className="text-sm text-muted-foreground">
            <p>Les clés de déchiffrement sont stockées de manière sécurisée. Elles sont utilisées pour déchiffrer les données des formulaires ODK avant leur importation.</p>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isAddKeyDialogOpen} onOpenChange={setIsAddKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une clé de déchiffrement</DialogTitle>
            <DialogDescription>
              {selectedForm 
                ? `Configurez la clé pour "${selectedForm.name}"`
                : "Entrez les détails de la clé de déchiffrement pour un formulaire crypté"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="key-name">Nom de la clé</Label>
              <Input 
                id="key-name" 
                placeholder="Ex: Clé du formulaire de visites"
                value={newKey.name || ''}
                onChange={(e) => setNewKey({...newKey, name: e.target.value})}
              />
            </div>
            
            {!selectedForm && (
              <div className="space-y-2">
                <Label htmlFor="form-id">Formulaire</Label>
                <select 
                  id="form-id"
                  className="w-full p-2 border rounded-md"
                  value={newKey.formId || ''}
                  onChange={(e) => setNewKey({...newKey, formId: e.target.value})}
                >
                  <option value="">Sélectionnez un formulaire</option>
                  {encryptedForms
                    .filter(form => !decryptionKeys.some(key => key.formId === form.id))
                    .map(form => (
                      <option key={form.id} value={form.id}>{form.name}</option>
                    ))}
                </select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="decryption-key">Clé de déchiffrement (format PEM)</Label>
              <Textarea 
                id="decryption-key" 
                placeholder="-----BEGIN PRIVATE KEY-----&#10;MIIEvgIBADANBgkqhkiG9w0BAQEFAASCB...&#10;-----END PRIVATE KEY-----"
                className="font-mono text-xs h-32"
                value={newKey.key || ''}
                onChange={(e) => setNewKey({...newKey, key: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                Collez la clé privée au format PEM qui correspond à la clé publique utilisée pour chiffrer le formulaire
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddKeyDialogOpen(false)} disabled={addKeyMutation.isPending}>
              Annuler
            </Button>
            <Button 
              onClick={handleAddKey} 
              className="bg-app-blue hover:bg-app-lightBlue"
              disabled={addKeyMutation.isPending}
            >
              {addKeyMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Enregistrement...
                </>
              ) : (
                <>
                  <FileKey className="mr-2 h-4 w-4" />
                  Enregistrer la clé
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OdkDecryptionManager;
