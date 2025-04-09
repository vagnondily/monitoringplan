
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface FileUploaderProps {
  title?: string;
  description?: string;
  acceptedFileTypes: string;
  maxSize?: number;
  maxFileSizeMB?: number; // Adding this for backward compatibility
  onFileUpload?: (file: File) => void;
  templateAvailable?: boolean;
  onTemplateDownload?: () => void;
}

const FileUploader = ({ 
  title = "Upload File", 
  description = "Drag and drop or click to upload", 
  acceptedFileTypes, 
  maxSize = 5,
  maxFileSizeMB,  // Optional param for backward compatibility
  onFileUpload = () => {},
  templateAvailable = false,
  onTemplateDownload
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Use maxFileSizeMB if provided, otherwise use maxSize
  const effectiveMaxSize = maxFileSizeMB || maxSize;
  
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
    if (file.size > effectiveMaxSize * 1024 * 1024) {
      toast.error(`Le fichier est trop volumineux. Taille maximale: ${effectiveMaxSize}MB`);
      return;
    }
    
    setSelectedFile(file);
  };
  
  const handleUpload = () => {
    if (selectedFile) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulation de la progression d'importation
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            onFileUpload(selectedFile);
            toast.success(`${selectedFile.name} téléchargé avec succès`);
            setSelectedFile(null);
            return 0;
          }
          return prev + 10;
        });
      }, 300);
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
              <div className="flex items-center gap-2 justify-center mb-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <p className="text-sm text-gray-700">{selectedFile.name}</p>
              </div>
              
              {isUploading ? (
                <div className="w-full max-w-xs mx-auto">
                  <Progress value={uploadProgress} className="h-2 mb-2" />
                  <p className="text-xs text-gray-500">Importation en cours...</p>
                </div>
              ) : (
                <Button 
                  className="mt-2 bg-app-blue hover:bg-app-lightBlue" 
                  onClick={handleUpload}
                >
                  Télécharger
                </Button>
              )}
            </div>
          )}
        </div>
        
        {templateAvailable && onTemplateDownload && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <p className="text-sm text-gray-700">Assurez-vous que votre fichier respecte le format requis</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-2 text-app-blue border-app-blue hover:bg-blue-50"
              onClick={onTemplateDownload}
            >
              Télécharger le modèle
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploader;
