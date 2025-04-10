
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Trash,
  CheckCheck,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Notification } from '@/types';

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Site Visit Due',
    message: 'A site visit is scheduled for Site A tomorrow.',
    type: 'task',
    date: '2023-04-07T10:30:00Z',
    read: false,
    actionLink: '/sites',
    actionText: 'View Site Details'
  },
  {
    id: '2',
    title: 'Data Import Completed',
    message: 'The data import from ODK Briefcase has been completed successfully.',
    type: 'info',
    date: '2023-04-06T15:45:00Z',
    read: true,
    actionLink: '/import',
    actionText: 'View Import History'
  },
  {
    id: '3',
    title: 'System Update',
    message: 'The system will be updated tonight at 11 PM. Please save your work before leaving.',
    type: 'info',
    date: '2023-04-06T09:00:00Z',
    read: false,
    actionLink: null,
    actionText: null
  },
  {
    id: '4',
    title: 'Site Data Missing',
    message: 'Site B is missing critical data fields. Please review and update.',
    type: 'alert',
    date: '2023-04-05T14:20:00Z',
    read: false,
    actionLink: '/sites',
    actionText: 'Review Site Data'
  },
  {
    id: '5',
    title: 'Report Generated',
    message: 'Monthly site monitoring report has been generated and is ready for review.',
    type: 'task',
    date: '2023-04-04T11:15:00Z',
    read: true,
    actionLink: '/exports',
    actionText: 'View Report'
  }
];

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'alert':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'task':
      return <Clock className="h-5 w-5 text-purple-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  
  const { data: notifications = mockNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => Promise.resolve(mockNotifications)
  });

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    toast.success('Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    toast.success('All notifications marked as read');
  };

  const handleDeleteNotification = (id: string) => {
    toast.success('Notification deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="h-8 w-8 text-app-blue" /> 
          Notifications
        </h1>
        {unreadCount > 0 && (
          <Button 
            variant="outline"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck className="mr-2 h-4 w-4" /> 
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="flex gap-4">
        <div className="w-64 space-y-4">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <Button 
                  variant={filter === 'all' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setFilter('all')}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  All Notifications
                  <Badge className="ml-auto">{notifications.length}</Badge>
                </Button>
                <Button 
                  variant={filter === 'unread' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setFilter('unread')}
                >
                  <Info className="mr-2 h-4 w-4" />
                  Unread
                  <Badge className="ml-auto">{unreadCount}</Badge>
                </Button>
                <Separator className="my-2" />
                <Button 
                  variant={filter === 'info' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setFilter('info')}
                >
                  <Info className="mr-2 h-4 w-4 text-blue-500" />
                  Information
                </Button>
                <Button 
                  variant={filter === 'alert' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setFilter('alert')}
                >
                  <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                  Alerts
                </Button>
                <Button 
                  variant={filter === 'task' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setFilter('task')}
                >
                  <Clock className="mr-2 h-4 w-4 text-purple-500" />
                  Tasks
                </Button>
              </nav>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Site Visit: Site C</p>
                    <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Monthly Report Due</p>
                    <p className="text-xs text-gray-500">April 15, 2023</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Team Meeting</p>
                    <p className="text-xs text-gray-500">April 10, 2023, 2:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>
                  {filter === 'all' ? 'All Notifications' : 
                   filter === 'unread' ? 'Unread Notifications' : 
                   `${filter.charAt(0).toUpperCase() + filter.slice(1)} Notifications`}
                </span>
                {filteredNotifications.length > 0 && (
                  <Badge variant="outline">{filteredNotifications.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredNotifications.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No notifications found</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <NotificationIcon type={notification.type} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{notification.title}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.date).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          {notification.actionLink && (
                            <a 
                              href={notification.actionLink} 
                              className="text-xs text-blue-600 hover:underline inline-block mt-2"
                            >
                              {notification.actionText}
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700" 
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
