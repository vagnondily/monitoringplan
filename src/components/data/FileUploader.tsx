
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploaderProps {
  title: string;
  description: string;
  acceptedFileTypes: string;
  maxSize?: number;
  onFileUpload: (file: File) => void;
}

const FileUploader = ({ 
  title, 
  description, 
  acceptedFileTypes, 
  maxSize = 5, 
  onFileUpload
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    // Vérifier le type de fichier
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension || '')) {
      toast.error(`Type de fichier non supporté. Veuillez télécharger un fichier ${acceptedFileTypes}`);
      return;
    }
    
    // Vérifier la taille du fichier (en MB)
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Le fichier est trop volumineux. Taille maximale: ${maxSize}MB`);
      return;
    }
    
    setSelectedFile(file);
  };
  
  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
      toast.success(`${selectedFile.name} téléchargé avec succès`);
      setSelectedFile(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-app-blue bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Glissez-déposez votre fichier ici, ou
          </p>
          <div>
            <label className="inline-block">
              <span className="btn btn-sm btn-primary cursor-pointer px-4 py-2 rounded-md bg-app-blue text-white hover:bg-app-lightBlue transition-colors">
                Parcourir les fichiers
              </span>
              <input
                type="file"
                className="hidden"
                accept={acceptedFileTypes}
                onChange={handleFileChange}
              />
            </label>
          </div>
          {selectedFile && (
            <div className="mt-4">
              <p className="text-sm text-gray-700">Fichier sélectionné: {selectedFile.name}</p>
              <Button 
                className="mt-2 bg-app-blue hover:bg-app-lightBlue" 
                onClick={handleUpload}
              >
                Télécharger
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
