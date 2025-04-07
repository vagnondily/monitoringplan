
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { notificationService } from '@/services/notificationService';
import { Notification } from '@/types';

const Notifications = () => {
  const queryClient = useQueryClient();
  
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Toutes les notifications ont été marquées comme lues');
    }
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  // Filter notifications by status and type
  const unreadNotifications = notifications.filter(n => !n.read);
  const allNotifications = [...notifications].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const alertNotifications = notifications.filter(n => n.type === 'alert');
  const infoNotifications = notifications.filter(n => n.type === 'info');
  const taskNotifications = notifications.filter(n => n.type === 'task');

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'task':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-gray-500">
            Vous avez {unreadNotifications.length} notifications non lues
          </p>
        </div>
        {unreadNotifications.length > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            Marquer tout comme lu
          </Button>
        )}
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            Toutes <Badge className="ml-2">{allNotifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Non lues <Badge className="ml-2">{unreadNotifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="alerts">
            Alertes <Badge className="ml-2">{alertNotifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="tasks">
            Tâches <Badge className="ml-2">{taskNotifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="info">
            Informations <Badge className="ml-2">{infoNotifications.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {['all', 'unread', 'alerts', 'tasks', 'info'].map(tab => {
          let filteredNotifications;
          switch(tab) {
            case 'unread':
              filteredNotifications = unreadNotifications;
              break;
            case 'alerts':
              filteredNotifications = alertNotifications;
              break;
            case 'tasks':
              filteredNotifications = taskNotifications;
              break;
            case 'info':
              filteredNotifications = infoNotifications;
              break;
            default:
              filteredNotifications = allNotifications;
          }

          return (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {tab === 'all' && 'Toutes les notifications'}
                    {tab === 'unread' && 'Notifications non lues'}
                    {tab === 'alerts' && 'Alertes'}
                    {tab === 'tasks' && 'Tâches à effectuer'}
                    {tab === 'info' && 'Informations générales'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune notification</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {filteredNotifications.map(notification => (
                        <li key={notification.id} className={`border-l-4 p-4 rounded-sm ${notification.read ? 'border-gray-200 bg-gray-50' : 'border-blue-500 bg-blue-50'}`}>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium">
                                  {notification.title}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  {new Date(notification.date).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-600 mt-1">{notification.message}</p>
                              
                              {notification.actionLink && (
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto text-blue-600 mt-2"
                                  asChild
                                >
                                  <a href={notification.actionLink}>
                                    {notification.actionText || 'Voir détails'}
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {!notification.read && (
                            <div className="flex justify-end mt-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                Marquer comme lu
                              </Button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default Notifications;
