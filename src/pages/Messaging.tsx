
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Inbox, 
  MessageSquare, 
  Plus, 
  Search, 
  Send, 
  Trash, 
  CheckCircle, 
  UserPlus, 
  Calendar, 
  CheckSquare, 
  PlusCircle,
  RefreshCw,
  Filter as FilterIcon,
  MoreHorizontal,
  Clock,
  AlertCircle,
  CheckCircle2,
  Edit,
  Pencil
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { messageService } from '@/services/messageService';

const Messaging = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [composeMessageOpen, setComposeMessageOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [selectedTaskStatus, setSelectedTaskStatus] = useState<string>('pending');
  const [selectedFilter, setSelectedFilter] = useState('all');
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

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: messageService.getMessages
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: messageService.getTasks
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: { taskId: string; updates: any }) => 
      messageService.updateTask(data.taskId, data.updates),
    onSuccess: () => {
      toast.success('Tâche mise à jour avec succès');
      setEditTaskId(null);
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour: ' + error);
    }
  });

  const filteredMessages = messages.filter(message => {
    if (searchQuery) {
      return message.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
        message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.sender.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const filteredTasks = tasks.filter(task => {
    let statusFilter = true;
    if (selectedFilter !== 'all') {
      statusFilter = selectedFilter === task.status;
    }
    
    if (searchQuery) {
      return (task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase())) && statusFilter;
    }
    return statusFilter;
  });

  const handleSendMessage = () => {
    if (!messageForm.recipient || !messageForm.subject || !messageForm.content) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    
    toast.success('Message envoyé avec succès');
    setComposeMessageOpen(false);
    setMessageForm({
      recipient: '',
      subject: '',
      content: ''
    });
  };

  const handleCreateTask = () => {
    if (!taskForm.title || !taskForm.assignee || !taskForm.dueDate) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    
    toast.success('Tâche créée avec succès');
    setCreateTaskOpen(false);
    setTaskForm({
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      priority: 'medium'
    });
  };

  const handleEditTask = (task: any) => {
    setEditTaskId(task.id);
    setSelectedTaskStatus(task.status);
  };

  const handleSaveTaskStatus = (taskId: string) => {
    updateTaskMutation.mutate({
      taskId,
      updates: { status: selectedTaskStatus === 'completed' ? 'completed' : 'pending' }
    });
  };

  const handleMarkAsRead = (id: string) => {
    toast.success('Message marqué comme lu');
  };

  const handleDeleteMessage = (id: string) => {
    toast.success('Message supprimé');
  };

  const handleCompleteTask = (id: string) => {
    updateTaskMutation.mutate({
      taskId: id,
      updates: { status: 'completed', completedAt: new Date().toISOString() }
    });
  };

  const handleDeleteTask = (id: string) => {
    toast.success('Tâche supprimée');
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Élevée</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Moyenne</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Basse</Badge>;
      default:
        return <Badge>Inconnue</Badge>;
    }
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-800">Terminée</Badge>;
    }
    
    const isOverdue = new Date(dueDate) < new Date();
    
    if (isOverdue) {
      return <Badge className="bg-red-100 text-red-800">En retard</Badge>;
    }
    
    return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {activeTab === 'inbox' ? (
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Inbox className="h-8 w-8 text-app-blue" /> 
            Boîte de réception
          </h1>
        ) : (
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CheckSquare className="h-8 w-8 text-app-blue" /> 
            Tâches
          </h1>
        )}
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => toast.success('Actualisation...')}
          >
            <RefreshCw size={16} />
            Actualiser
          </Button>
          {activeTab === 'inbox' ? (
            <Button 
              className="bg-app-blue hover:bg-app-lightBlue"
              onClick={() => setComposeMessageOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> 
              Nouveau message
            </Button>
          ) : (
            <Button 
              className="bg-app-blue hover:bg-app-lightBlue"
              onClick={() => setCreateTaskOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> 
              Nouvelle tâche
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <Inbox size={16} />
              Messages
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare size={16} />
              Tâches
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={activeTab === 'inbox' ? "Rechercher des messages..." : "Rechercher des tâches..."}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {activeTab === 'tasks' && (
              <div>
                <Button 
                  variant={selectedFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedFilter('all')}
                  className={selectedFilter === 'all' ? 'bg-app-blue' : ''}
                >
                  Toutes
                </Button>
                <Button 
                  variant={selectedFilter === 'pending' ? 'default' : 'outline'} 
                  size="sm" 
                  className={`ml-2 ${selectedFilter === 'pending' ? 'bg-app-blue' : ''}`}
                  onClick={() => setSelectedFilter('pending')}
                >
                  En cours
                </Button>
                <Button 
                  variant={selectedFilter === 'completed' ? 'default' : 'outline'} 
                  size="sm" 
                  className={`ml-2 ${selectedFilter === 'completed' ? 'bg-app-blue' : ''}`}
                  onClick={() => setSelectedFilter('completed')}
                >
                  Terminées
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="inbox" className="mt-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Messages</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      <FilterIcon size={14} className="mr-2" />
                      Filtrer
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Consultez et gérez vos messages reçus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="text-center py-10">
                      <div className="animate-spin w-6 h-6 border-2 border-app-blue border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-muted-foreground">Chargement des messages...</p>
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="text-center py-10 border rounded-md">
                      <Inbox className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Aucun message trouvé</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div key={message.id} className={`border rounded-md overflow-hidden ${!message.read ? 'border-l-4 border-l-app-blue' : ''}`}>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${message.sender.replace('@', '+')}`} />
                                <AvatarFallback>{message.sender.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{message.sender}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(message.createdAt).toLocaleDateString()} à {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!message.read && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">Non lu</Badge>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteMessage(message.id)}>
                                <Trash size={16} />
                              </Button>
                            </div>
                          </div>
                          <h4 className="font-medium text-lg mb-1">{message.subject}</h4>
                          <p className="text-muted-foreground">{message.content.substring(0, 120)}...</p>
                          <div className="flex justify-end mt-3">
                            {!message.read && (
                              <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(message.id)}>
                                <CheckCircle size={14} className="mr-2" />
                                Marquer comme lu
                              </Button>
                            )}
                            <Button variant="default" size="sm" className="ml-2 bg-app-blue">
                              Répondre
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="mt-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Résumé des tâches</CardTitle>
                </div>
                <CardDescription>
                  Gérez et suivez vos tâches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-green-50">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="rounded-full bg-green-100 p-3">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold">{tasks.filter(t => t.status === 'completed').length}</p>
                          <p className="text-sm text-green-700">Tâches terminées</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="rounded-full bg-blue-100 p-3">
                          <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold">{tasks.filter(t => t.status === 'pending').length}</p>
                          <p className="text-sm text-blue-700">Tâches en cours</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="rounded-full bg-red-100 p-3">
                          <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold">
                            {tasks.filter(t => t.status === 'pending' && new Date(t.dueDate) < new Date()).length}
                          </p>
                          <p className="text-sm text-red-700">Tâches en retard</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-yellow-50">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="rounded-full bg-yellow-100 p-3">
                          <Calendar className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold">
                            {tasks.filter(t => t.status === 'pending' && 
                              new Date(t.dueDate) > new Date() && 
                              new Date(t.dueDate) < new Date(new Date().setDate(new Date().getDate() + 7))
                            ).length}
                          </p>
                          <p className="text-sm text-yellow-700">Échéance cette semaine</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  {tasksLoading ? (
                    <div className="text-center py-10">
                      <div className="animate-spin w-6 h-6 border-2 border-app-blue border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-muted-foreground">Chargement des tâches...</p>
                    </div>
                  ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-10 border rounded-md">
                      <CheckSquare className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Aucune tâche trouvée</p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div key={task.id} className={`border rounded-md overflow-hidden ${task.priority === 'high' ? 'border-l-4 border-l-red-500' : ''}`}>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{task.title}</h3>
                                {getPriorityBadge(task.priority)}
                                {getStatusBadge(task.status, task.dueDate)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Assignée à: {task.assignee} • 
                                Échéance: {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditTask(task)}
                              >
                                <Pencil size={14} className="mr-2" />
                                Modifier
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{task.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-sm text-muted-foreground">
                              Créée le: {new Date(task.createdAt).toLocaleDateString()}
                            </div>
                            {task.status !== 'completed' && (
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleCompleteTask(task.id)}
                              >
                                <CheckCircle2 size={14} className="mr-2" />
                                Marquer comme terminée
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {composeMessageOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nouveau message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Destinataire</Label>
              <Select value={messageForm.recipient} onValueChange={(value) => setMessageForm({ ...messageForm, recipient: value })}>
                <SelectTrigger id="recipient">
                  <SelectValue placeholder="Sélectionner un destinataire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1@example.com">John Doe (user1@example.com)</SelectItem>
                  <SelectItem value="user2@example.com">Jane Smith (user2@example.com)</SelectItem>
                  <SelectItem value="user3@example.com">Bob Johnson (user3@example.com)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Objet</Label>
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
                Annuler
              </Button>
              <Button onClick={handleSendMessage} className="bg-app-blue hover:bg-app-lightBlue">
                <Send className="mr-2 h-4 w-4" /> Envoyer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {createTaskOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nouvelle tâche</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
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
              <Label htmlFor="assignee">Assigner à</Label>
              <Select value={taskForm.assignee} onValueChange={(value) => setTaskForm({ ...taskForm, assignee: value })}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Sélectionner un assigné" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1@example.com">John Doe (user1@example.com)</SelectItem>
                  <SelectItem value="user2@example.com">Jane Smith (user2@example.com)</SelectItem>
                  <SelectItem value="user3@example.com">Bob Johnson (user3@example.com)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d'échéance</Label>
                <Input 
                  id="dueDate" 
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({ ...taskForm, priority: value })}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Sélectionner une priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="low">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateTaskOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateTask} className="bg-app-blue hover:bg-app-lightBlue">
                <PlusCircle className="mr-2 h-4 w-4" /> Créer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editTaskId && (
        <Dialog open={!!editTaskId} onOpenChange={() => setEditTaskId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le statut de la tâche</DialogTitle>
              <DialogDescription>
                Mettez à jour le statut de la tâche
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taskStatus">Statut</Label>
                <Select value={selectedTaskStatus} onValueChange={setSelectedTaskStatus}>
                  <SelectTrigger id="taskStatus">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En cours</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditTaskId(null)}>
                Annuler
              </Button>
              <Button 
                onClick={() => handleSaveTaskStatus(editTaskId)}
                className="bg-app-blue hover:bg-app-lightBlue"
              >
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Messaging;
