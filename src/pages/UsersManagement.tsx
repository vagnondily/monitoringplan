
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Search, UserPlus, Edit, Trash } from 'lucide-react';
import UserForm from '@/components/users/UserForm';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Utilisateur ajouté avec succès');
      setIsAddUserOpen(false);
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'ajout de l\'utilisateur');
      console.error(error);
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: any) => userService.updateUser(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Utilisateur mis à jour avec succès');
      setIsEditUserOpen(false);
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour de l\'utilisateur');
      console.error(error);
    }
  });

  const handleAddUser = (data: any) => {
    createUserMutation.mutate(data);
  };

  const handleEditUser = (data: any) => {
    updateUserMutation.mutate({ ...data, id: selectedUser.id });
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const filteredUsers = users.filter((user: any) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500">Administrateur</Badge>;
      case 'field_officer':
        return <Badge className="bg-green-500">Agent de terrain</Badge>;
      case 'program_manager':
        return <Badge className="bg-blue-500">Responsable de programme</Badge>;
      case 'data_analyst':
        return <Badge className="bg-purple-500">Analyste de données</Badge>;
      case 'it_support':
        return <Badge className="bg-yellow-500">Support IT</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
        
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Complétez les informations pour ajouter un nouvel utilisateur au système.
              </DialogDescription>
            </DialogHeader>
            <UserForm 
              onSubmit={handleAddUser}
              onCancel={() => setIsAddUserOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Liste des utilisateurs</CardTitle>
              <CardDescription>Gérez les utilisateurs et leurs autorisations</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Chargement des utilisateurs...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Aucun utilisateur trouvé</div>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user: any) => (
                <div 
                  key={user.id} 
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRoleBadge(user.role)}
                      {user.active ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Actif</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Inactif</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dernière connexion:</span>
                      <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Jamais'}</span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => {
                        e.stopPropagation();
                        handleUserSelect(user);
                      }}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Éditer</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" onClick={(e) => {
                        e.stopPropagation();
                        toast.error("Voulez-vous vraiment supprimer cet utilisateur?");
                      }}>
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm 
              user={selectedUser}
              onSubmit={handleEditUser}
              onCancel={() => setIsEditUserOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
