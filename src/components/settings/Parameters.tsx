
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverarchingParameters from '@/components/settings/OverarchingParameters';
import { ActivitySquare, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                  <p className="text-sm text-blue-700">
                    Cette section permet de configurer les paramètres initiaux pour le plan de suivi.
                  </p>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Périodes de planification</CardTitle>
                    <CardDescription>
                      Définir la période de référence pour la planification
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="planning-period">Période de planification par défaut</Label>
                        <Select defaultValue="monthly">
                          <SelectTrigger id="planning-period">
                            <SelectValue placeholder="Sélectionner une période" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                            <SelectItem value="monthly">Mensuelle</SelectItem>
                            <SelectItem value="quarterly">Trimestrielle</SelectItem>
                            <SelectItem value="biannual">Semestrielle</SelectItem>
                            <SelectItem value="annual">Annuelle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fiscal-year-start">Début de l'année fiscale</Label>
                        <Select defaultValue="january">
                          <SelectTrigger id="fiscal-year-start">
                            <SelectValue placeholder="Sélectionner un mois" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="january">Janvier</SelectItem>
                            <SelectItem value="february">Février</SelectItem>
                            <SelectItem value="march">Mars</SelectItem>
                            <SelectItem value="april">Avril</SelectItem>
                            <SelectItem value="may">Mai</SelectItem>
                            <SelectItem value="june">Juin</SelectItem>
                            <SelectItem value="july">Juillet</SelectItem>
                            <SelectItem value="august">Août</SelectItem>
                            <SelectItem value="september">Septembre</SelectItem>
                            <SelectItem value="october">Octobre</SelectItem>
                            <SelectItem value="november">Novembre</SelectItem>
                            <SelectItem value="december">Décembre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-rollover">Reconduction automatique des plans non réalisés</Label>
                        <Switch id="auto-rollover" defaultChecked={true} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Critères de priorisation</CardTitle>
                    <CardDescription>
                      Configurer les règles de priorisation des sites
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="risk-weight">Poids du facteur de risque (%)</Label>
                        <Input type="number" id="risk-weight" defaultValue="30" min="0" max="100" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vulnerability-weight">Poids du facteur de vulnérabilité (%)</Label>
                        <Input type="number" id="vulnerability-weight" defaultValue="25" min="0" max="100" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="coverage-weight">Poids du facteur de couverture (%)</Label>
                        <Input type="number" id="coverage-weight" defaultValue="25" min="0" max="100" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time-weight">Poids du facteur temps depuis dernière visite (%)</Label>
                        <Input type="number" id="time-weight" defaultValue="20" min="0" max="100" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-prioritize">Priorisation automatique des sites</Label>
                        <Switch id="auto-prioritize" defaultChecked={true} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Exigences de visites</CardTitle>
                    <CardDescription>
                      Définir les exigences minimales de visites par site
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="min-visits-high">Visites minimales - Sites à risque élevé</Label>
                        <Select defaultValue="quarterly">
                          <SelectTrigger id="min-visits-high">
                            <SelectValue placeholder="Sélectionner une fréquence" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                            <SelectItem value="biweekly">Bimensuelle</SelectItem>
                            <SelectItem value="monthly">Mensuelle</SelectItem>
                            <SelectItem value="quarterly">Trimestrielle</SelectItem>
                            <SelectItem value="biannual">Semestrielle</SelectItem>
                            <SelectItem value="annual">Annuelle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="min-visits-medium">Visites minimales - Sites à risque moyen</Label>
                        <Select defaultValue="biannual">
                          <SelectTrigger id="min-visits-medium">
                            <SelectValue placeholder="Sélectionner une fréquence" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                            <SelectItem value="biweekly">Bimensuelle</SelectItem>
                            <SelectItem value="monthly">Mensuelle</SelectItem>
                            <SelectItem value="quarterly">Trimestrielle</SelectItem>
                            <SelectItem value="biannual">Semestrielle</SelectItem>
                            <SelectItem value="annual">Annuelle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="min-visits-low">Visites minimales - Sites à risque faible</Label>
                        <Select defaultValue="annual">
                          <SelectTrigger id="min-visits-low">
                            <SelectValue placeholder="Sélectionner une fréquence" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                            <SelectItem value="biweekly">Bimensuelle</SelectItem>
                            <SelectItem value="monthly">Mensuelle</SelectItem>
                            <SelectItem value="quarterly">Trimestrielle</SelectItem>
                            <SelectItem value="biannual">Semestrielle</SelectItem>
                            <SelectItem value="annual">Annuelle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button className="bg-app-blue hover:bg-app-lightBlue">Enregistrer les paramètres</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Parameters;
