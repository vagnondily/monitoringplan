import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Search, 
  Play, 
  Pause, 
  Edit, 
  Trash, 
  Copy,
  LayoutDashboard,
  GitBranch
} from 'lucide-react';
import { toast } from 'sonner';
import WorkflowDesigner from '@/components/workflow/WorkflowDesigner';
import WorkflowList from '@/components/workflow/WorkflowList';
import { Workflow } from '@/types';

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Site Data Collection',
    description: 'Automated workflow for collecting site data from ODK and processing it',
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    triggers: [
      {
        id: 't1',
        type: 'schedule',
        config: { frequency: 'daily', time: '08:00' }
      }
    ]
  },
  {
    id: '2',
    name: 'Monthly Report Generation',
    description: 'Generate and send monthly reports to stakeholders',
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    triggers: [
      {
        id: 't2',
        type: 'schedule',
        config: { frequency: 'monthly', day: 1 }
      }
    ]
  },
  {
    id: '3',
    name: 'Data Validation',
    description: 'Validates imported data against predefined rules',
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
    triggers: [
      {
        id: 't3',
        type: 'event',
        config: { event: 'data.import.completed' }
      }
    ]
  }
];

const WorkflowPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const { data: workflows = mockWorkflows } = useQuery({
    queryKey: ['workflows'],
    queryFn: () => Promise.resolve(mockWorkflows)
  });

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && workflow.status === 'active';
    if (activeTab === 'draft') return matchesSearch && workflow.status === 'draft';
    if (activeTab === 'archived') return matchesSearch && workflow.status === 'archived';
    
    return matchesSearch;
  });

  const handleCreateWorkflow = () => {
    const newWorkflow: Workflow = {
      id: `new-${Date.now()}`,
      name: 'New Workflow',
      description: 'Add a description',
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      triggers: []
    };
    
    setSelectedWorkflow(newWorkflow);
    toast.success('New workflow created');
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
  };

  const handleCloseEditor = () => {
    setSelectedWorkflow(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <GitBranch className="h-8 w-8 text-app-blue" /> 
          Workflow Designer
        </h1>
        <Button 
          className="bg-app-blue hover:bg-app-lightBlue"
          onClick={handleCreateWorkflow}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> 
          Create Workflow
        </Button>
      </div>

      {selectedWorkflow ? (
        <WorkflowDesigner workflow={selectedWorkflow} onClose={handleCloseEditor} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkflows.map(workflow => (
              <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </div>
                    <div>
                      {workflow.status === 'active' ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Active
                        </span>
                      ) : workflow.status === 'draft' ? (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Draft
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 mb-3">
                    {workflow.triggers.map(trigger => (
                      <div key={trigger.id} className="mb-1">
                        Trigger: {trigger.type === 'schedule' ? 'Scheduled' : 'Event-based'}
                      </div>
                    ))}
                    <div>Last updated: {new Date(workflow.updatedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => toast.info('Workflow copied')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditWorkflow(workflow)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {workflow.status === 'active' ? (
                      <Button variant="outline" size="sm" onClick={() => toast.info('Workflow paused')}>
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => toast.info('Workflow activated')}>
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => toast.info('Delete clicked')}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkflowPage;
