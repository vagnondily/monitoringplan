
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  MessageSquare, 
  Send, 
  User, 
  Search, 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  Trash, 
  Edit, 
  PlusCircle,
  Users
} from 'lucide-react';
import { Message, Task, User as UserType } from '@/types';

// Mock data
const mockMessages = [
  {
    id: '1',
    subject: 'Site Visit Report',
    content: 'Please review the site visit report attached to this message.',
    sender: 'admin@example.com',
    recipient: 'user@example.com',
    createdAt: '2023-04-05T10:30:00Z',
    read: false
  },
  {
    id: '2',
    subject: 'Monthly Planning Meeting',
    content: 'The monthly planning meeting is scheduled for next Monday at 10 AM.',
    sender: 'manager@example.com',
    recipient: 'user@example.com',
    createdAt: '2023-04-03T14:15:00Z',
    read: true
  },
  {
    id: '3',
    subject: 'Data Import Issue',
    content: 'There was an issue with the last data import. Please check the logs.',
    sender: 'system@example.com',
    recipient: 'user@example.com',
    createdAt: '2023-04-01T08:45:00Z',
    read: true
  }
];

const mockTasks = [
  {
    id: '1',
    title: 'Review Site Reports',
    description: 'Review site visit reports for the Northern region',
    assignee: 'user@example.com',
    createdBy: 'admin@example.com',
    createdAt: '2023-04-05T10:30:00Z',
    dueDate: '2023-04-10T23:59:59Z',
    status: 'pending',
    priority: 'high',
    completedAt: null
  },
  {
    id: '2',
    title: 'Update Monitoring Schedule',
    description: 'Update the monitoring schedule for Q2',
    assignee: 'user@example.com',
    createdBy: 'manager@example.com',
    createdAt: '2023-04-03T14:15:00Z',
    dueDate: '2023-04-15T23:59:59Z',
    status: 'pending',
    priority: 'medium',
    completedAt: null
  },
  {
    id: '3',
    title: 'Fix Data Import Script',
    description: 'Fix the data import script for ODK forms',
    assignee: 'user@example.com',
    createdBy: 'admin@example.com',
    createdAt: '2023-04-01T08:45:00Z',
    dueDate: '2023-04-07T23:59:59Z',
    status: 'completed',
    priority: 'high',
    completedAt: '2023-04-06T16:30:00Z'
  }
];

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    avatar: null,
    active: true,
    lastLogin: '2023-04-06T09:15:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Manager',
    avatar: null,
    active: true,
    lastLogin: '2023-04-05T14:30:00Z'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Field Officer',
    avatar: null,
    active: false,
    lastLogin: '2023-03-28T11:45:00Z'
  }
];

const Messaging = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [composeMessageOpen, setComposeMessageOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [messageForm, setMessageForm] = useState({
    recipient: '',
    subject: '',
    content: ''
  });
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium'
  });

  const { data: messages = mockMessages } = useQuery({
    queryKey: ['messages'],
    queryFn: () => Promise.resolve(mockMessages)
  });

  const { data: tasks = mockTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => Promise.resolve(mockTasks)
  });

  const { data: users = mockUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => Promise.resolve(mockUsers)
  });

  const filteredMessages = messages.filter(message => 
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    // In a real app, this would make an API call
    if (!messageForm.recipient || !messageForm.subject || !messageForm.content) {
      toast.error('Please fill all required fields');
      return;
    }
    
    toast.success('Message sent successfully');
    setComposeMessageOpen(false);
    setMessageForm({
      recipient: '',
      subject: '',
      content: ''
    });
  };

  const handleCreateTask = () => {
    // In a real app, this would make an API call
    if (!taskForm.title || !taskForm.assignee || !taskForm.dueDate) {
      toast.error('Please fill all required fields');
      return;
    }
    
    toast.success('Task created successfully');
    setCreateTaskOpen(false);
    setTaskForm({
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      priority: 'medium'
    });
  };

  const handleMarkAsRead = (id: string) => {
    toast.success('Message marked as read');
  };

  const handleDeleteMessage = (id: string) => {
    toast.success('Message deleted');
  };

  const handleCompleteTask = (id: string) => {
    toast.success('Task marked as completed');
  };

  const handleDeleteTask = (id: string) => {
    toast.success('Task deleted');
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    }
    
    const isOverdue = new Date(dueDate) < new Date();
    
    if (isOverdue) {
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    }
    
    return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-app-blue" /> 
          Messaging & Tasks
        </h1>
        <div className="flex gap-2">
          {activeTab === 'messages' ? (
            <Button 
              className="bg-app-blue hover:bg-app-lightBlue"
              onClick={() => setComposeMessageOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> 
              Compose Message
            </Button>
          ) : (
            <Button 
              className="bg-app-blue hover:bg-app-lightBlue"
              onClick={() => setCreateTaskOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> 
              Create Task
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare size={16} />
              Messages
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare size={16} />
              Tasks
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={activeTab === 'messages' ? "Search messages..." : "Search tasks..."}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {activeTab === 'tasks' && (
              <div>
                <Button variant="outline" size="sm">
                  All
                </Button>
                <Button variant="outline" size="sm" className="ml-2">
                  Pending
                </Button>
                <Button variant="outline" size="sm" className="ml-2">
                  Completed
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="messages" className="mt-2">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Subject</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No messages found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMessages.map(message => (
                      <TableRow key={message.id} className={message.read ? '' : 'bg-blue-50'}>
                        <TableCell className="font-medium">
                          {!message.read && <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>}
                          {message.subject}
                        </TableCell>
                        <TableCell>{message.sender}</TableCell>
                        <TableCell>{new Date(message.createdAt).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!message.read && (
                              <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(message.id)}>
                                Mark as Read
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteMessage(message.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-2">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Task</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No tasks found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map(task => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">
                          {task.title}
                          <p className="text-xs text-gray-500">{task.description}</p>
                        </TableCell>
                        <TableCell>{task.assignee}</TableCell>
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(task.status, task.dueDate)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {task.status !== 'completed' && (
                              <Button variant="ghost" size="sm" onClick={() => handleCompleteTask(task.id)}>
                                Complete
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteTask(task.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {composeMessageOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compose New Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">To</Label>
              <Select value={messageForm.recipient} onValueChange={(value) => setMessageForm({ ...messageForm, recipient: value })}>
                <SelectTrigger id="recipient">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.email}>{user.name} ({user.email})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject" 
                value={messageForm.subject}
                onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Message</Label>
              <Textarea 
                id="content" 
                rows={6}
                value={messageForm.content}
                onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setComposeMessageOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {createTaskOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                rows={3}
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignee">Assign To</Label>
              <Select value={taskForm.assignee} onValueChange={(value) => setTaskForm({ ...taskForm, assignee: value })}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.email}>{user.name} ({user.email})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({ ...taskForm, priority: value })}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateTaskOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Messaging;
