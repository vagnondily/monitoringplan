
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Upload, FileUp, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FIELD_OFFICES, activityCategories } from '@/services/parametersService';

const LocationCreator = () => {
  const [locationName, setLocationName] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [commune, setCommune] = useState('');
  const [fokontany, setFokontany] = useState('');
  const [gpsLatitude, setGpsLatitude] = useState('');
  const [gpsLongitude, setGpsLongitude] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('');
  const [activityCategory, setActivityCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveLocation = () => {
    // Validate form
    if (!locationName || !region || !district || !selectedOffice || !activityCategory) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Save location logic would go here
    toast.success('Localisation enregistrée avec succès');
    
    // Reset form
    setLocationName('');
    setRegion('');
    setDistrict('');
    setCommune('');
    setFokontany('');
    setGpsLatitude('');
    setGpsLongitude('');
    setSelectedOffice('');
    setActivityCategory('');
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Veuillez sélectionner un fichier Excel');
      return;
    }

    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      toast.success(`Fichier "${selectedFile.name}" importé avec succès`);
      setSelectedFile(null);
      setIsUploading(false);
    }, 2000);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>Création de Localisation</CardTitle>
        <CardDescription>
          Ajoutez une nouvelle localisation manuellement ou par importation de fichier Excel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Saisie Manuelle</TabsTrigger>
            <TabsTrigger value="import">Import Excel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locationName">Nom de la localisation *</Label>
                <Input 
                  id="locationName" 
                  value={locationName} 
                  onChange={(e) => setLocationName(e.target.value)} 
                  placeholder="Nom du site"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fieldOffice">Bureau de terrain *</Label>
                <Select value={selectedOffice} onValueChange={setSelectedOffice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un bureau" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_OFFICES.map((office) => (
                      <SelectItem key={office} value={office}>
                        {office}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Région *</Label>
                <Input 
                  id="region" 
                  value={region} 
                  onChange={(e) => setRegion(e.target.value)} 
                  placeholder="Région"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Input 
                  id="district" 
                  value={district} 
                  onChange={(e) => setDistrict(e.target.value)} 
                  placeholder="District"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commune">Commune</Label>
                <Input 
                  id="commune" 
                  value={commune} 
                  onChange={(e) => setCommune(e.target.value)} 
                  placeholder="Commune"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fokontany">Fokontany</Label>
                <Input 
                  id="fokontany" 
                  value={fokontany} 
                  onChange={(e) => setFokontany(e.target.value)} 
                  placeholder="Fokontany"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gpsLatitude">Latitude GPS</Label>
                <Input 
                  id="gpsLatitude" 
                  value={gpsLatitude} 
                  onChange={(e) => setGpsLatitude(e.target.value)} 
                  placeholder="ex: -18.8792"
                  type="number"
                  step="0.000001"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gpsLongitude">Longitude GPS</Label>
                <Input 
                  id="gpsLongitude" 
                  value={gpsLongitude} 
                  onChange={(e) => setGpsLongitude(e.target.value)} 
                  placeholder="ex: 47.5079"
                  type="number"
                  step="0.000001"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="activityCategory">Catégorie d'activité *</Label>
                <Select value={activityCategory} onValueChange={setActivityCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => {
                // Reset form
                setLocationName('');
                setRegion('');
                setDistrict('');
                setCommune('');
                setFokontany('');
                setGpsLatitude('');
                setGpsLongitude('');
                setSelectedOffice('');
                setActivityCategory('');
              }}>
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
              <Button onClick={handleSaveLocation}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4 mt-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <FileUp className="h-8 w-8 text-muted-foreground" />
                <h3 className="font-medium">Importer un fichier Excel</h3>
                <p className="text-sm text-muted-foreground">
                  Glissez-déposez ou cliquez pour sélectionner
                </p>
                
                <Input
                  id="fileUpload"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('fileUpload')?.click()}
                  className="mt-2"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Sélectionner un fichier
                </Button>
                
                {selectedFile && (
                  <div className="mt-4 text-sm">
                    <span className="font-medium">Fichier sélectionné:</span> {selectedFile.name}
                  </div>
                )}
              </div>
            </div>
            
            {selectedFile && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedFile(null)}>
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <Button onClick={handleFileUpload} disabled={isUploading}>
                  {isUploading ? 'Importation...' : 'Importer'}
                </Button>
              </div>
            )}
            
            <div className="rounded border p-4 mt-4">
              <h3 className="font-medium mb-2">Format de fichier requis</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Votre fichier Excel doit contenir les colonnes suivantes:
              </p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Nom du site</li>
                <li>Bureau de terrain</li>
                <li>Région</li>
                <li>District</li>
                <li>Commune</li>
                <li>Fokontany</li>
                <li>Latitude GPS</li>
                <li>Longitude GPS</li>
                <li>Catégorie d'activité</li>
              </ul>
              <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                Télécharger un modèle Excel
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LocationCreator;
