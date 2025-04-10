
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
          <Tabs defaultValue="parameters" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="parameters" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>Paramètres globaux</span>
              </TabsTrigger>
              <TabsTrigger value="planning" className="flex items-center gap-2">
                <ActivitySquare className="h-4 w-4" />
                <span>Configuration du plan</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="parameters">
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                  <p className="text-sm text-blue-700">
                    Cette section permet de configurer les paramètres globaux pour le suivi.
                  </p>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres généraux</CardTitle>
                    <CardDescription>
                      Définir les paramètres globaux pour le suivi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="threshold-critical">Seuil critique (%)</Label>
                        <Input type="number" id="threshold-critical" defaultValue="75" min="0" max="100" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="threshold-warning">Seuil d'avertissement (%)</Label>
                        <Input type="number" id="threshold-warning" defaultValue="90" min="0" max="100" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="aggregation-method">Méthode d'agrégation</Label>
                        <Select defaultValue="average">
                          <SelectTrigger id="aggregation-method">
                            <SelectValue placeholder="Sélectionner une méthode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sum">Somme</SelectItem>
                            <SelectItem value="average">Moyenne</SelectItem>
                            <SelectItem value="weighted">Pondérée</SelectItem>
                            <SelectItem value="min">Minimum</SelectItem>
                            <SelectItem value="max">Maximum</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-calculation">Calcul automatique des indicateurs</Label>
                        <Switch id="auto-calculation" defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifications-enabled">Activer les notifications de seuil</Label>
                        <Switch id="notifications-enabled" defaultChecked={true} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Affichage et rapports</CardTitle>
                    <CardDescription>
                      Définir les paramètres pour l'affichage et les rapports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="default-chart">Graphique par défaut</Label>
                        <Select defaultValue="bar">
                          <SelectTrigger id="default-chart">
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bar">Barres</SelectItem>
                            <SelectItem value="line">Lignes</SelectItem>
                            <SelectItem value="pie">Camembert</SelectItem>
                            <SelectItem value="radar">Radar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="default-timeframe">Période par défaut</Label>
                        <Select defaultValue="month">
                          <SelectTrigger id="default-timeframe">
                            <SelectValue placeholder="Sélectionner une période" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">Semaine</SelectItem>
                            <SelectItem value="month">Mois</SelectItem>
                            <SelectItem value="quarter">Trimestre</SelectItem>
                            <SelectItem value="year">Année</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-target">Inclure les cibles dans les graphiques</Label>
                        <Switch id="include-target" defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-baseline">Afficher les valeurs de référence</Label>
                        <Switch id="show-baseline" defaultChecked={true} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
