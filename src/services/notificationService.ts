
// Mock notifications data
const mockNotifications = [
  {
    id: 'notif1',
    title: 'Nouvelle tâche assignée',
    message: 'Vous avez une nouvelle tâche: Visiter le site MIARO à Toliara',
    type: 'task',
    date: '2023-04-05T09:30:00Z',
    read: false,
    actionLink: '/messaging',
    actionText: 'Voir la tâche'
  },
  {
    id: 'notif2',
    title: 'Mise à jour système',
    message: 'Le système sera en maintenance le 10 avril de 22h à 23h',
    type: 'info',
    date: '2023-04-04T14:00:00Z',
    read: true,
    actionLink: null,
    actionText: null
  },
  {
    id: 'notif3',
    title: 'Alerte: Rapport en retard',
    message: 'Le rapport mensuel pour le projet Nutrition est en retard de 3 jours',
    type: 'alert',
    date: '2023-04-03T11:45:00Z',
    read: false,
    actionLink: '/reports',
    actionText: 'Voir les rapports'
  },
  {
    id: 'notif4',
    title: 'Nouveau message reçu',
    message: 'Vous avez reçu un nouveau message de Jean Dupont concernant le site Betioky',
    type: 'info',
    date: '2023-04-02T16:20:00Z',
    read: false,
    actionLink: '/messaging',
    actionText: 'Lire le message'
  },
  {
    id: 'notif5',
    title: 'Synchronisation terminée',
    message: 'La synchronisation des données ODK a été complétée avec succès',
    type: 'info',
    date: '2023-04-01T10:15:00Z',
    read: true,
    actionLink: '/actual-data',
    actionText: 'Voir les données'
  },
  {
    id: 'notif6',
    title: 'Alerte: Problème de sécurité',
    message: 'Alerte de sécurité signalée dans la région de Toliara. Les visites de terrain sont suspendues jusqu\'à nouvel ordre.',
    type: 'alert',
    date: '2023-03-30T08:45:00Z',
    read: true,
    actionLink: null,
    actionText: null
  }
];

export const notificationService = {
  getNotifications: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockNotifications];
  },
  
  markAsRead: async (notificationId: string) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
    if (notificationIndex !== -1) {
      mockNotifications[notificationIndex].read = true;
    }
    
    return { success: true };
  },
  
  markAllAsRead: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    mockNotifications.forEach(notification => {
      notification.read = true;
    });
    
    return { success: true };
  },
  
  deleteNotification: async (notificationId: string) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
    if (notificationIndex !== -1) {
      mockNotifications.splice(notificationIndex, 1);
    }
    
    return { success: true };
  },
  
  createNotification: async (notification: any) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newNotification = {
      id: `notif${mockNotifications.length + 1}`,
      date: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    mockNotifications.unshift(newNotification);
    return newNotification;
  }
};
