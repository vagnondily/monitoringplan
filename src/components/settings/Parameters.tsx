
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverarchingParameters from '@/components/settings/OverarchingParameters';
import { ActivitySquare, BarChart } from 'lucide-react';

const Parameters = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>
            Configuration des paramètres pour le plan de suivi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overarching" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="overarching" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>Paramètres globaux</span>
              </TabsTrigger>
              <TabsTrigger value="planning" className="flex items-center gap-2">
                <ActivitySquare className="h-4 w-4" />
                <span>Configuration du plan</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overarching">
              <OverarchingParameters />
            </TabsContent>
            
            <TabsContent value="planning">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                  <p className="text-sm text-blue-700">
                    Cette section permet de configurer les paramètres initiaux pour le plan de suivi.
                  </p>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration du plan de suivi</CardTitle>
                    <CardDescription>
                      Paramètres de base pour la planification des visites
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        La configuration des paramètres du plan de suivi vous permet de définir:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li>Les périodes de planification (mensuelle, trimestrielle, etc.)</li>
                        <li>Les critères de priorisation des sites</li>
                        <li>Les exigences minimales de visites par site</li>
                        <li>Les contraintes de ressources</li>
                        <li>Les règles d'allocation des ressources</li>
                      </ul>
                      
                      <p className="text-sm text-muted-foreground mt-4">
                        Ces paramètres sont utilisés en conjonction avec les paramètres globaux pour générer un plan de suivi optimal.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Parameters;
