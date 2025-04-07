
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit, 
  Trash2, 
  Send,
  PlusCircle,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { messageService } from '@/services/messageService';
import { userService } from '@/services/userService';
import { Message, Task, User } from '@/types';

const Messaging = () => {
  const queryClient = useQueryClient();
  
  // State for new task creation
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium'
  });
  
  // State for new message
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: ''
  });
  
  // Open/close state for dialogs
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  
  // Fetch data
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: messageService.getTasks
  });
  
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: messageService.getMessages
  });
  
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: userService.getUsers
  });
  
  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: (task: Omit<Task, 'id' | 'status' | 'createdAt'>) => 
      messageService.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tâche créée avec succès');
      setNewTask({
        title: '',
        description: '',
        assignee: '',
        dueDate: '',
        priority: 'medium'
      });
      setIsTaskDialogOpen(false);
    }
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: (task: Partial<Task> & { id: string }) => 
      messageService.updateTask(task.id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tâche mise à jour avec succès');
    }
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => 
      messageService.sendMessage(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message envoyé avec succès');
      setNewMessage({
        recipient: '',
        subject: '',
        content: ''
      });
      setIsMessageDialogOpen(false);
    }
  });
  
  // Handlers
  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignee || !newTask.dueDate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    createTaskMutation.mutate(newTask);
  };
  
  const handleSendMessage = () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.content) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    sendMessageMutation.mutate(newMessage);
  };
  
  const handleCompleteTask = (taskId: string) => {
    updateTaskMutation.mutate({
      id: taskId,
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };
  
  // Filter and sort data
  const myTasks = tasks.filter(task => task.assignee === 'currentUser');
  const assignedTasks = tasks.filter(task => task.assignee !== 'currentUser');
  const inboxMessages = messages.filter(msg => msg.recipient === 'currentUser');
  const sentMessages = messages.filter(msg => msg.sender === 'currentUser');
  
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-500">Complété</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500">Annulé</Badge>;
      default:
        return <Badge>En attente</Badge>;
    }
  };
  
  // Get priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-500">Urgent</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Moyen</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Faible</Badge>;
      default:
        return <Badge>Normal</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messagerie et Tâches</h1>
          <p className="text-gray-500">
            Gérez vos tâches et communication avec votre équipe
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <MessageSquare size={16} />
                Nouveau message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau message</DialogTitle>
                <DialogDescription>
                  Envoyer un message à un membre de l'équipe
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Destinataire</Label>
                  <Select 
                    value={newMessage.recipient} 
                    onValueChange={(value) => setNewMessage({...newMessage, recipient: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un destinataire" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Message</Label>
                  <Textarea
                    id="content"
                    rows={5}
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSendMessage} className="flex items-center gap-2">
                  <Send size={16} />
                  Envoyer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" variant="outline">
                <PlusCircle size={16} />
                Nouvelle tâche
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une nouvelle tâche</DialogTitle>
                <DialogDescription>
                  Assigner une tâche à un membre de l'équipe
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de la tâche*</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assigné à*</Label>
                  <Select 
                    value={newTask.assignee} 
                    onValueChange={(value) => setNewTask({...newTask, assignee: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un membre" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Date d'échéance*</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="dueDate"
                        type="date"
                        className="pl-8"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priorité</Label>
                    <Select 
                      value={newTask.priority} 
                      onValueChange={(value) => setNewTask({...newTask, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateTask}>
                  Créer la tâche
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckCircle size={16} />
            Tâches
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare size={16} />
            Messages
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <Tabs defaultValue="my-tasks">
            <TabsList>
              <TabsTrigger value="my-tasks">
                Mes tâches <Badge className="ml-2">{myTasks.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="assigned">
                Tâches assignées <Badge className="ml-2">{assignedTasks.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-tasks">
              <Card>
                <CardHeader>
                  <CardTitle>Mes tâches à effectuer</CardTitle>
                  <CardDescription>
                    Liste des tâches qui vous sont assignées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {myTasks.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Vous n'avez aucune tâche en attente</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {myTasks.map(task => (
                        <li key={task.id} className="border p-4 rounded-lg">
                          <div className="flex justify-between">
                            <div className="font-medium">{task.title}</div>
                            <div className="flex gap-2">
                              {getPriorityBadge(task.priority)}
                              {getStatusBadge(task.status)}
                            </div>
                          </div>
                          <p className="text-gray-600 mt-2">{task.description}</p>
                          <div className="flex justify-between mt-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              Échéance: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                              {task.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="flex items-center gap-1"
                                  onClick={() => handleCompleteTask(task.id)}
                                >
                                  <CheckCircle size={14} />
                                  Marquer comme terminé
                                </Button>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="assigned">
              <Card>
                <CardHeader>
                  <CardTitle>Tâches assignées à d'autres</CardTitle>
                  <CardDescription>
                    Liste des tâches que vous avez assignées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {assignedTasks.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Vous n'avez assigné aucune tâche</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {assignedTasks.map(task => (
                        <li key={task.id} className="border p-4 rounded-lg">
                          <div className="flex justify-between">
                            <div className="font-medium">{task.title}</div>
                            <div className="flex gap-2">
                              {getPriorityBadge(task.priority)}
                              {getStatusBadge(task.status)}
                            </div>
                          </div>
                          <p className="text-gray-600 mt-2">{task.description}</p>
                          <div className="flex justify-between mt-4 text-sm text-gray-500">
                            <div>
                              <span className="text-gray-700">Assigné à:</span> {
                                users.find(u => u.id === task.assignee)?.name || 'Inconnu'
                              }
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              Échéance: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 w-7 p-0"
                              >
                                <Edit size={14} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 w-7 p-0 text-red-500"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-4">
          <Tabs defaultValue="inbox">
            <TabsList>
              <TabsTrigger value="inbox">
                Boîte de réception <Badge className="ml-2">{inboxMessages.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="sent">
                Messages envoyés <Badge className="ml-2">{sentMessages.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="inbox">
              <Card>
                <CardHeader>
                  <CardTitle>Boîte de réception</CardTitle>
                </CardHeader>
                <CardContent>
                  {inboxMessages.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Votre boîte de réception est vide</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {inboxMessages.map(message => (
                        <li key={message.id} className={`border-l-4 p-4 rounded-sm ${message.read ? 'border-gray-200 bg-gray-50' : 'border-blue-500 bg-blue-50'}`}>
                          <div className="flex justify-between">
                            <div className="font-medium">{message.subject}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(message.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            De: {users.find(u => u.id === message.sender)?.name || 'Inconnu'}
                          </div>
                          <p className="text-gray-600 mt-2">{message.content}</p>
                          <div className="flex justify-end mt-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-blue-600"
                            >
                              Répondre
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sent">
              <Card>
                <CardHeader>
                  <CardTitle>Messages envoyés</CardTitle>
                </CardHeader>
                <CardContent>
                  {sentMessages.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Vous n'avez envoyé aucun message</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {sentMessages.map(message => (
                        <li key={message.id} className="border p-4 rounded-lg">
                          <div className="flex justify-between">
                            <div className="font-medium">{message.subject}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(message.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            À: {users.find(u => u.id === message.recipient)?.name || 'Inconnu'}
                          </div>
                          <p className="text-gray-600 mt-2">{message.content}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messaging;
