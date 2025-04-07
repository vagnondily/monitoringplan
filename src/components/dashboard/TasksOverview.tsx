
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { messageService } from '@/services/messageService';
import { Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TasksOverview = () => {
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: messageService.getTasks
  });

  // Filter tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const urgentTasks = tasks.filter(task => task.priority === 'high' && task.status === 'pending');

  // Group tasks by assignee
  const groupedByAssignee = pendingTasks.reduce((acc, task) => {
    if (!acc[task.assignee]) {
      acc[task.assignee] = [];
    }
    acc[task.assignee].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-500">Urgent</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>Normal</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Tâches en attente ({pendingTasks.length})</h2>
          {urgentTasks.length > 0 && (
            <p className="text-red-500 flex items-center gap-1">
              <AlertTriangle size={16} />
              {urgentTasks.length} tâches urgentes requièrent votre attention
            </p>
          )}
        </div>
        <Link to="/messaging">
          <Button>Voir toutes les tâches</Button>
        </Link>
      </div>

      {Object.entries(groupedByAssignee).length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-2" />
            <p>Aucune tâche en attente</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedByAssignee).map(([assignee, assigneeTasks]) => (
          <Card key={assignee}>
            <CardHeader>
              <CardTitle className="text-lg">Assignées à: {assignee}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {assigneeTasks.slice(0, 3).map(task => (
                  <li key={task.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description.substring(0, 60)}...</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(task.priority)}
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
                {assigneeTasks.length > 3 && (
                  <li className="text-sm text-gray-500 text-center">
                    + {assigneeTasks.length - 3} autres tâches
                  </li>
                )}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Voir toutes les tâches de {assignee}
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default TasksOverview;
