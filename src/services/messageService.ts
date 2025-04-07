
// Mock data for user tasks
const mockTasks = [
  {
    id: 'task1',
    title: 'Visiter le site MIARO à Toliara',
    description: 'Effectuer une visite de suivi sur le site MIARO à Toliara pour vérifier la distribution alimentaire.',
    assignee: 'currentUser',
    createdBy: 'user2',
    createdAt: '2023-04-01T10:00:00Z',
    dueDate: '2023-04-15T00:00:00Z',
    status: 'pending',
    priority: 'high',
    completedAt: null
  },
  {
    id: 'task2',
    title: 'Préparer le rapport mensuel',
    description: 'Compiler les données de suivi du mois dernier et préparer le rapport pour le comité de pilotage.',
    assignee: 'currentUser',
    createdBy: 'user3',
    createdAt: '2023-04-02T14:30:00Z',
    dueDate: '2023-04-10T00:00:00Z',
    status: 'pending',
    priority: 'medium',
    completedAt: null
  },
  {
    id: 'task3',
    title: 'Former le personnel sur ODK',
    description: 'Organiser une session de formation pour le personnel de terrain sur l\'utilisation d\'ODK pour la collecte de données.',
    assignee: 'user2',
    createdBy: 'currentUser',
    createdAt: '2023-03-28T09:15:00Z',
    dueDate: '2023-04-20T00:00:00Z',
    status: 'pending',
    priority: 'medium',
    completedAt: null
  },
  {
    id: 'task4',
    title: 'Évaluer les nouveaux sites potentiels',
    description: 'Visiter et évaluer trois nouveaux sites potentiels pour le programme d\'alimentation scolaire dans la région de Fianarantsoa.',
    assignee: 'user4',
    createdBy: 'currentUser',
    createdAt: '2023-03-30T11:45:00Z',
    dueDate: '2023-04-25T00:00:00Z',
    status: 'pending',
    priority: 'low',
    completedAt: null
  },
  {
    id: 'task5',
    title: 'Résoudre le problème technique ODK',
    description: 'Plusieurs utilisateurs signalent des problèmes de synchronisation avec ODK. Veuillez enquêter et résoudre.',
    assignee: 'user5',
    createdBy: 'currentUser',
    createdAt: '2023-04-05T08:20:00Z',
    dueDate: '2023-04-08T00:00:00Z',
    status: 'pending',
    priority: 'high',
    completedAt: null
  }
];

// Mock data for messages
const mockMessages = [
  {
    id: 'msg1',
    subject: 'Mise à jour sur le site Betioky',
    content: 'Bonjour, j\'ai effectué une visite sur le site de Betioky. Tout fonctionne bien, mais il y a un souci avec l\'approvisionnement en eau. Pouvons-nous en discuter lors de la prochaine réunion?',
    sender: 'user2',
    recipient: 'currentUser',
    createdAt: '2023-04-05T09:30:00Z',
    read: false
  },
  {
    id: 'msg2',
    subject: 'Question sur le formulaire ODK',
    content: 'Je rencontre un problème avec le formulaire d\'évaluation des sites. Le champ GPS ne fonctionne pas correctement. Pouvez-vous m\'aider?',
    sender: 'user3',
    recipient: 'currentUser',
    createdAt: '2023-04-04T14:15:00Z',
    read: true
  },
  {
    id: 'msg3',
    subject: 'Confirmation de la réunion du comité',
    content: 'Ce message est pour confirmer que la réunion du comité de pilotage aura lieu le 15 avril à 10h00. Merci de préparer les présentations nécessaires.',
    sender: 'user4',
    recipient: 'currentUser',
    createdAt: '2023-04-03T11:45:00Z',
    read: false
  },
  {
    id: 'msg4',
    subject: 'Suivi sur les rapports en retard',
    content: 'Cher(e) collègue, je voulais vous informer que nous avons quelques rapports de suivi en retard pour le mois dernier. Pourriez-vous les soumettre dès que possible?',
    sender: 'currentUser',
    recipient: 'user2',
    createdAt: '2023-04-02T10:20:00Z',
    read: true
  },
  {
    id: 'msg5',
    subject: 'Formation sur ODK',
    content: 'J\'ai préparé les documents pour la formation sur ODK la semaine prochaine. Voulez-vous les consulter avant la session?',
    sender: 'currentUser',
    recipient: 'user5',
    createdAt: '2023-04-01T16:30:00Z',
    read: true
  }
];

export const messageService = {
  getTasks: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockTasks];
  },
  
  getMessages: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockMessages];
  },
  
  createTask: async (task: any) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTask = {
      id: `task${mockTasks.length + 1}`,
      createdBy: 'currentUser',
      createdAt: new Date().toISOString(),
      status: 'pending',
      completedAt: null,
      ...task
    };
    
    mockTasks.push(newTask);
    return newTask;
  },
  
  updateTask: async (taskId: string, updates: any) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...updates
    };
    
    return mockTasks[taskIndex];
  },
  
  deleteTask: async (taskId: string) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks.splice(taskIndex, 1);
    return { success: true };
  },
  
  sendMessage: async (message: any) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newMessage = {
      id: `msg${mockMessages.length + 1}`,
      sender: 'currentUser',
      createdAt: new Date().toISOString(),
      read: false,
      ...message
    };
    
    mockMessages.push(newMessage);
    return newMessage;
  },
  
  markMessageAsRead: async (messageId: string) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const messageIndex = mockMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) {
      throw new Error('Message not found');
    }
    
    mockMessages[messageIndex].read = true;
    return { success: true };
  }
};
