
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Download, FileText, Plus, ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';

// Mock template data
const templateSamples = [
  {
    id: 'template1',
    name: 'Rapport de visite standard',
    description: 'Modèle standard pour les rapports de visite de site',
    lastModified: '2025-03-15',
    sections: ['Informations générales', 'Activités observées', 'Problèmes identifiés', 'Photos', 'Recommandations'],
    category: 'field_visit'
  },
  {
    id: 'template2',
    name: 'Rapport mensuel de suivi',
    description: 'Modèle pour les rapports mensuels de suivi des activités',
    lastModified: '2025-04-01',
    sections: ['Résumé exécutif', 'Progrès des activités', 'Indicateurs de performance', 'Défis', 'Plan pour le mois suivant'],
    category: 'monthly'
  },
  {
    id: 'template3',
    name: 'Rapport d\'incident',
    description: 'Modèle pour signaler les incidents sur le terrain',
    lastModified: '2025-03-22',
    sections: ['Informations de l\'incident', 'Personnes impliquées', 'Impact', 'Actions immédiates', 'Suivi requis'],
    category: 'incident'
  }
];

const ReportTemplate = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [templates, setTemplates] = useState(templateSamples);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: '',
    sections: []
  });
  const [newSection, setNewSection] = useState('');

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTemplate.name || !newTemplate.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (newTemplate.sections.length === 0) {
      toast.error('Ajoutez au moins une section au modèle');
      return;
    }
    
    // Create new template
    const template = {
      id: `template${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      sections: [...newTemplate.sections],
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    setTemplates([...templates, template]);
    
    // Reset form and switch to browse tab
    setNewTemplate({
      name: '',
      description: '',
      category: '',
      sections: []
    });
    setActiveTab('browse');
    
    toast.success('Modèle de rapport créé avec succès');
  };

  const handleAddSection = () => {
    if (!newSection.trim()) {
      toast.error('Veuillez entrer un nom de section');
      return;
    }
    
    setNewTemplate({
      ...newTemplate,
      sections: [...newTemplate.sections, newSection]
    });
    setNewSection('');
  };

  const handleRemoveSection = (index: number) => {
    const updatedSections = [...newTemplate.sections];
    updatedSections.splice(index, 1);
    setNewTemplate({
      ...newTemplate,
      sections: updatedSections
    });
  };

  const handleGenerateReport = (templateId: string) => {
    // In a real app, this would generate a report based on the template
    toast.success('Génération du rapport initiée');
    setSelectedTemplate(templateId);
    
    // Simulate report generation
    setTimeout(() => {
      toast.success('Rapport généré avec succès');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modèles de rapport</h1>
        <p className="text-muted-foreground">
          Créez et gérez des modèles de rapport pour standardiser vos documents
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="browse">Parcourir les modèles</TabsTrigger>
            <TabsTrigger value="create">Créer un modèle</TabsTrigger>
          </TabsList>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter les modèles
          </Button>
        </div>

        <TabsContent value="browse" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card 
                key={template.id} 
                className={selectedTemplate === template.id ? 'border-2 border-primary' : ''}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Modifié le {template.lastModified}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Sections:</h4>
                    <ul className="text-sm space-y-1">
                      {template.sections.map((section, index) => (
                        <li key={index} className="flex items-center">
                          <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                          {section}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-muted">
                      {template.category === 'field_visit' ? 'Visite de terrain' : 
                       template.category === 'monthly' ? 'Rapport mensuel' : 
                       template.category === 'incident' ? 'Incident' : template.category}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateReport(template.id)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Générer un rapport
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {templates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun modèle de rapport</h3>
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore créé de modèle de rapport. Commencez par en créer un.
              </p>
              <Button onClick={() => setActiveTab('create')}>
                Créer un modèle
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Créer un nouveau modèle de rapport</CardTitle>
              <CardDescription>
                Définissez les sections et les champs de votre modèle de rapport
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTemplate} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="templateName">Nom du modèle *</Label>
                    <Input
                      id="templateName"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      placeholder="Ex: Rapport de visite de site"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="templateCategory">Catégorie *</Label>
                    <Select
                      value={newTemplate.category}
                      onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                    >
                      <SelectTrigger id="templateCategory">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="field_visit">Visite de terrain</SelectItem>
                        <SelectItem value="monthly">Rapport mensuel</SelectItem>
                        <SelectItem value="quarterly">Rapport trimestriel</SelectItem>
                        <SelectItem value="annual">Rapport annuel</SelectItem>
                        <SelectItem value="incident">Rapport d'incident</SelectItem>
                        <SelectItem value="evaluation">Évaluation</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="templateDescription">Description</Label>
                  <Textarea
                    id="templateDescription"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    placeholder="Décrivez l'objectif et l'utilisation de ce modèle de rapport"
                  />
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Sections du rapport</h3>
                  
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value)}
                        placeholder="Nom de la section"
                      />
                      <Button type="button" onClick={handleAddSection}>
                        <Plus className="h-4 w-4" />
                        Ajouter
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {newTemplate.sections.length > 0 ? (
                        <div className="space-y-2">
                          {newTemplate.sections.map((section, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-2 bg-muted rounded"
                            >
                              <span>{section}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveSection(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Ajoutez au moins une section à votre modèle de rapport
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('browse')}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    <Check className="mr-2 h-4 w-4" />
                    Créer le modèle
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportTemplate;
