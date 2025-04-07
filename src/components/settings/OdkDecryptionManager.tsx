
import React, { useState } from 'react';
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

// Mock data pour les formulaires cryptés
const mockEncryptedForms: OdkForm[] = [
  { id: 'form-1', name: 'Monitoring Visit Form', version: '1.2.1', isEncrypted: true, submissionCount: 45, lastSubmission: '2025-03-15T10:30:00Z' },
  { id: 'form-2', name: 'Health Assessment', version: '2.0.0', isEncrypted: true, submissionCount: 23, lastSubmission: '2025-04-01T14:45:00Z' },
  { id: 'form-3', name: 'Water Quality Test', version: '1.0.5', isEncrypted: true, submissionCount: 12 }
];

// Mock data pour les clés de déchiffrement
const mockDecryptionKeys: OdkDecryptionKey[] = [
  { id: 'key-1', name: 'Monitoring Visit Key', formId: 'form-1', key: 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgw...', createdAt: '2025-01-10T09:00:00Z' }
];

const OdkDecryptionManager = () => {
  const [decryptionKeys, setDecryptionKeys] = useState<OdkDecryptionKey[]>(mockDecryptionKeys);
  const [encryptedForms] = useState<OdkForm[]>(mockEncryptedForms);
  const [isAddKeyDialogOpen, setIsAddKeyDialogOpen] = useState(false);
  const [newKey, setNewKey] = useState<Partial<OdkDecryptionKey>>({});
  const [selectedForm, setSelectedForm] = useState<OdkForm | null>(null);

  const handleAddKey = () => {
    if (!newKey.name || !newKey.formId || !newKey.key) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const keyToAdd: OdkDecryptionKey = {
      id: `key-${Date.now()}`,
      name: newKey.name,
      formId: newKey.formId,
      key: newKey.key,
      createdAt: new Date().toISOString()
    };

    setDecryptionKeys([...decryptionKeys, keyToAdd]);
    setNewKey({});
    setIsAddKeyDialogOpen(false);
    toast.success('Clé de déchiffrement ajoutée avec succès');
  };

  const handleDeleteKey = (keyId: string) => {
    setDecryptionKeys(decryptionKeys.filter(key => key.id !== keyId));
    toast.success('Clé de déchiffrement supprimée');
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
                  {encryptedForms.map(form => {
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
                            <Key className="h-4 w-4" />
                            {hasKey ? 'Clé configurée' : 'Ajouter une clé'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {encryptedForms.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Aucun formulaire crypté trouvé
                      </TableCell>
                    </TableRow>
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
                    {decryptionKeys.map(key => {
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
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {decryptionKeys.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          Aucune clé de déchiffrement enregistrée
                        </TableCell>
                      </TableRow>
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
                <Label htmlFor="form-id">ID du formulaire</Label>
                <select 
                  id="form-id"
                  className="w-full p-2 border rounded-md"
                  value={newKey.formId || ''}
                  onChange={(e) => setNewKey({...newKey, formId: e.target.value})}
                >
                  <option value="">Sélectionnez un formulaire</option>
                  {encryptedForms.map(form => (
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
            <Button variant="outline" onClick={() => setIsAddKeyDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddKey} className="bg-app-blue hover:bg-app-lightBlue">
              <FileKey className="mr-2 h-4 w-4" />
              Enregistrer la clé
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OdkDecryptionManager;
