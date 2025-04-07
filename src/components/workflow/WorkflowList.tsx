
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Play, Pause, Trash, Copy } from 'lucide-react';
import { Workflow } from '@/types';

interface WorkflowListProps {
  workflows: Workflow[];
  onEdit: (workflow: Workflow) => void;
}

const WorkflowList: React.FC<WorkflowListProps> = ({ workflows, onEdit }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Triggers</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.map(workflow => (
            <TableRow key={workflow.id}>
              <TableCell className="font-medium">{workflow.name}</TableCell>
              <TableCell>
                {workflow.status === 'active' ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                ) : workflow.status === 'draft' ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 hover:bg-yellow-100">Draft</Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">Archived</Badge>
                )}
              </TableCell>
              <TableCell>{workflow.triggers.length}</TableCell>
              <TableCell>{new Date(workflow.updatedAt).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(workflow)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {workflow.status === 'active' ? (
                    <Button variant="ghost" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkflowList;
