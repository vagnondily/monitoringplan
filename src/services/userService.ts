
// Mock user data
const mockUsers = [
  {
    id: 'currentUser',
    name: 'Vous',
    email: 'current.user@example.com',
    role: 'admin',
    avatar: '/placeholder.svg',
    active: true,
    lastLogin: '2023-04-07T08:30:00Z'
  },
  {
    id: 'user2',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'field_officer',
    avatar: null,
    active: true,
    lastLogin: '2023-04-06T14:15:00Z'
  },
  {
    id: 'user3',
    name: 'Marie Silva',
    email: 'marie.silva@example.com',
    role: 'program_manager',
    avatar: null,
    active: true,
    lastLogin: '2023-04-07T09:20:00Z'
  },
  {
    id: 'user4',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    role: 'data_analyst',
    avatar: null,
    active: true,
    lastLogin: '2023-04-05T11:45:00Z'
  },
  {
    id: 'user5',
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    role: 'it_support',
    avatar: null,
    active: false,
    lastLogin: '2023-03-28T16:30:00Z'
  }
];

export const userService = {
  getUsers: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockUsers];
  },
  
  getUserById: async (userId: string) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return { ...user };
  },
  
  getCurrentUser: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { ...mockUsers[0] };
  },
  
  updateUser: async (userId: string, updates: any) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates
    };
    
    return { ...mockUsers[userIndex] };
  },
  
  createUser: async (userData: any) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: `user${mockUsers.length + 1}`,
      active: true,
      lastLogin: null,
      ...userData
    };
    
    mockUsers.push(newUser);
    return { ...newUser };
  }
};
