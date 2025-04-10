
// Mock user data
const mockUsers = [
  {
    id: 'currentUser',
    name: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@mems.org',
    role: 'administrator',
    avatar: '/placeholder.svg',
    active: true,
    lastLogin: '2023-04-07T08:30:00Z',
    fieldOffice: 'Siège',
    jobTitle: 'System Administrator'
  },
  {
    id: 'user2',
    name: 'Jean Dupont',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    role: 'creator',
    avatar: null,
    active: true,
    lastLogin: '2023-04-06T14:15:00Z',
    fieldOffice: 'Bureau régional Est',
    jobTitle: 'Field Officer'
  },
  {
    id: 'user3',
    name: 'Marie Silva',
    firstName: 'Marie',
    lastName: 'Silva',
    email: 'marie.silva@example.com',
    role: 'validator',
    avatar: null,
    active: true,
    lastLogin: '2023-04-07T09:20:00Z',
    fieldOffice: 'Bureau régional Ouest',
    jobTitle: 'Program Manager'
  },
  {
    id: 'user4',
    name: 'Robert Johnson',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@example.com',
    role: 'viewer',
    avatar: null,
    active: true,
    lastLogin: '2023-04-05T11:45:00Z',
    fieldOffice: 'Bureau local A',
    jobTitle: 'Data Analyst'
  },
  {
    id: 'user5',
    name: 'Sophie Martin',
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie.martin@example.com',
    role: 'super_user',
    avatar: null,
    active: false,
    lastLogin: '2023-03-28T16:30:00Z',
    fieldOffice: 'Siège',
    jobTitle: 'Director'
  }
];

// Field offices list
export const FIELD_OFFICES = [
  "Siège",
  "Bureau régional Est",
  "Bureau régional Ouest", 
  "Bureau régional Nord",
  "Bureau régional Sud",
  "Bureau local A",
  "Bureau local B",
  "Bureau local C"
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
    
    // If we're updating name fields, also update the composite name field
    if (updates.firstName || updates.lastName) {
      const firstName = updates.firstName || mockUsers[userIndex].firstName;
      const lastName = updates.lastName || mockUsers[userIndex].lastName;
      updates.name = `${firstName} ${lastName}`;
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
    
    // Create a composite name if first name and last name are provided
    let name = userData.name;
    if (userData.firstName && userData.lastName) {
      name = `${userData.firstName} ${userData.lastName}`;
    }
    
    const newUser = {
      id: `user${mockUsers.length + 1}`,
      active: true,
      lastLogin: null,
      name,
      ...userData
    };
    
    mockUsers.push(newUser);
    return { ...newUser };
  },
  
  getFieldOffices: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...FIELD_OFFICES];
  }
};
