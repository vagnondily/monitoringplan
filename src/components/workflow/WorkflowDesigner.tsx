
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { X, Save, Play, Plus, Settings } from 'lucide-react';
import { Workflow, WorkflowStep, WorkflowTrigger } from '@/types';

interface WorkflowDesignerProps {
  workflow: Workflow;
  onClose: () => void;
}

const WorkflowDesigner: React.FC<WorkflowDesignerProps> = ({ workflow, onClose }) => {
  const [workflowData, setWorkflowData] = useState<Workflow>(workflow);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<WorkflowTrigger | null>(null);

  const handleSave = () => {
    // Here would be the API call to save the workflow
    toast.success('Workflow saved successfully');
  };

  const handleRun = () => {
    toast.info('Running workflow...');
    setTimeout(() => {
      toast.success('Workflow completed successfully');
    }, 2000);
  };

  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: 'New Step',
      type: 'action',
      config: {},
      nextSteps: [],
      position: { x: 250, y: 100 + (workflowData.steps.length * 80) }
    };
    
    setWorkflowData({
      ...workflowData,
      steps: [...workflowData.steps, newStep]
    });
    
    setSelectedStep(newStep);
  };

  const handleAddTrigger = () => {
    const newTrigger: WorkflowTrigger = {
      id: `trigger-${Date.now()}`,
      type: 'event',
      config: {}
    };
    
    setWorkflowData({
      ...workflowData,
      triggers: [...workflowData.triggers, newTrigger]
    });
    
    setSelectedTrigger(newTrigger);
  };

  const handleWorkflowChange = (field: keyof Workflow, value: any) => {
    setWorkflowData({
      ...workflowData,
      [field]: value
    });
  };

  // Simple mock for workflow canvas
  const renderDesignerCanvas = () => {
    return (
      <div className="bg-gray-50 border rounded-md h-[500px] relative overflow-hidden">
        {/* Triggers Section */}
        <div className="absolute left-10 top-20">
          <p className="text-xs text-gray-500 mb-2">Triggers</p>
          {workflowData.triggers.map(trigger => (
            <div 
              key={trigger.id}
              className="bg-white border border-blue-500 p-3 rounded-md mb-3 w-48 cursor-pointer hover:shadow-md"
              onClick={() => setSelectedTrigger(trigger)}
            >
              <p className="text-sm font-medium">{trigger.type === 'schedule' ? 'Schedule Trigger' : 'Event Trigger'}</p>
              <p className="text-xs text-gray-500">
                {trigger.type === 'schedule' && trigger.config.frequency && `Every ${trigger.config.frequency}`}
                {trigger.type === 'event' && trigger.config.event && `On ${trigger.config.event}`}
              </p>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-48"
            onClick={handleAddTrigger}
          >
            <Plus className="h-3 w-3 mr-1" /> Add Trigger
          </Button>
        </div>

        {/* Steps Section */}
        <div className="absolute left-[250px] top-20">
          <p className="text-xs text-gray-500 mb-2">Steps</p>
          {workflowData.steps.map((step, index) => (
            <div 
              key={step.id}
              className="bg-white border border-green-500 p-3 rounded-md mb-3 w-48 cursor-pointer hover:shadow-md"
              style={{ 
                position: 'absolute',
                top: step.position.y,
                left: step.position.x
              }}
              onClick={() => setSelectedStep(step)}
            >
              <p className="text-sm font-medium">{step.name}</p>
              <p className="text-xs text-gray-500 capitalize">{step.type}</p>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-48"
            onClick={handleAddStep}
          >
            <Plus className="h-3 w-3 mr-1" /> Add Step
          </Button>
        </div>

        {/* Guide text for empty workflow */}
        {workflowData.steps.length === 0 && workflowData.triggers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Settings className="h-16 w-16 mx-auto mb-2 opacity-20" />
              <p className="text-lg">Start building your workflow</p>
              <p className="text-sm">Add triggers and steps to define your automated process</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1" /> Close
          </Button>
          <Button className="bg-app-blue hover:bg-app-lightBlue" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
          <Button 
            variant="outline" 
            className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800"
            onClick={handleRun}
          >
            <Play className="h-4 w-4 mr-1" /> Run
          </Button>
        </div>
        <div className="text-sm">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
            Status: {workflowData.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Workflow Designer</CardTitle>
            </CardHeader>
            <CardContent>
              {renderDesignerCanvas()}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Workflow Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workflow-name">Name</Label>
                <Input 
                  id="workflow-name" 
                  value={workflowData.name}
                  onChange={(e) => handleWorkflowChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workflow-description">Description</Label>
                <Textarea 
                  id="workflow-description" 
                  value={workflowData.description}
                  onChange={(e) => handleWorkflowChange('description', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workflow-status">Status</Label>
                <Select 
                  value={workflowData.status}
                  onValueChange={(value) => handleWorkflowChange('status', value)}
                >
                  <SelectTrigger id="workflow-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {selectedStep && (
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle>Step Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="step-name">Step Name</Label>
                  <Input 
                    id="step-name" 
                    value={selectedStep.name}
                    onChange={(e) => {
                      const updatedSteps = workflowData.steps.map(s => 
                        s.id === selectedStep.id ? { ...s, name: e.target.value } : s
                      );
                      setWorkflowData({ ...workflowData, steps: updatedSteps });
                      setSelectedStep({ ...selectedStep, name: e.target.value });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="step-type">Step Type</Label>
                  <Select 
                    value={selectedStep.type}
                    onValueChange={(value: 'action' | 'condition' | 'delay') => {
                      const updatedSteps = workflowData.steps.map(s => 
                        s.id === selectedStep.id ? { ...s, type: value } : s
                      );
                      setWorkflowData({ ...workflowData, steps: updatedSteps });
                      setSelectedStep({ ...selectedStep, type: value });
                    }}
                  >
                    <SelectTrigger id="step-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="action">Action</SelectItem>
                      <SelectItem value="condition">Condition</SelectItem>
                      <SelectItem value="delay">Delay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic form based on step type */}
                {selectedStep.type === 'action' && (
                  <div className="space-y-2">
                    <Label htmlFor="action-type">Action Type</Label>
                    <Select defaultValue="api">
                      <SelectTrigger id="action-type">
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api">API Call</SelectItem>
                        <SelectItem value="email">Send Email</SelectItem>
                        <SelectItem value="notification">Send Notification</SelectItem>
                        <SelectItem value="data">Update Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedStep.type === 'condition' && (
                  <div className="space-y-2">
                    <Label htmlFor="condition-type">Condition Type</Label>
                    <Select defaultValue="compare">
                      <SelectTrigger id="condition-type">
                        <SelectValue placeholder="Select condition type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compare">Compare Values</SelectItem>
                        <SelectItem value="exists">Check If Exists</SelectItem>
                        <SelectItem value="date">Date Condition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedStep.type === 'delay' && (
                  <div className="space-y-2">
                    <Label htmlFor="delay-duration">Delay Duration (minutes)</Label>
                    <Input id="delay-duration" type="number" defaultValue="5" />
                  </div>
                )}

                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    const updatedSteps = workflowData.steps.filter(s => s.id !== selectedStep.id);
                    setWorkflowData({ ...workflowData, steps: updatedSteps });
                    setSelectedStep(null);
                  }}
                >
                  Remove Step
                </Button>
              </CardContent>
            </Card>
          )}

          {selectedTrigger && (
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle>Trigger Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trigger-type">Trigger Type</Label>
                  <Select 
                    value={selectedTrigger.type}
                    onValueChange={(value: 'event' | 'schedule' | 'manual') => {
                      const updatedTriggers = workflowData.triggers.map(t => 
                        t.id === selectedTrigger.id ? { ...t, type: value, config: {} } : t
                      );
                      setWorkflowData({ ...workflowData, triggers: updatedTriggers });
                      setSelectedTrigger({ ...selectedTrigger, type: value, config: {} });
                    }}
                  >
                    <SelectTrigger id="trigger-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic form based on trigger type */}
                {selectedTrigger.type === 'event' && (
                  <div className="space-y-2">
                    <Label htmlFor="event-name">Event Name</Label>
                    <Select defaultValue="data.import.completed">
                      <SelectTrigger id="event-name">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="data.import.completed">Data Import Completed</SelectItem>
                        <SelectItem value="site.created">Site Created</SelectItem>
                        <SelectItem value="site.updated">Site Updated</SelectItem>
                        <SelectItem value="user.action">User Action</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedTrigger.type === 'schedule' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger id="frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" type="time" defaultValue="08:00" />
                    </div>
                  </>
                )}

                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    const updatedTriggers = workflowData.triggers.filter(t => t.id !== selectedTrigger.id);
                    setWorkflowData({ ...workflowData, triggers: updatedTriggers });
                    setSelectedTrigger(null);
                  }}
                >
                  Remove Trigger
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowDesigner;
