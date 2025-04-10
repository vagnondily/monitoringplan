
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit avoir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  role: z.string().min(1, { message: "Veuillez sélectionner un rôle" }),
  jobTitle: z.string().min(2, { message: "Le titre du poste doit avoir au moins 2 caractères" }),
  office: z.string().min(2, { message: "Le bureau doit avoir au moins 2 caractères" }),
  active: z.boolean().default(true)
});

type FormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  user?: any;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

const UserForm = ({ user, onSubmit, onCancel }: UserFormProps) => {
  const defaultValues = user ? {
    name: user.name || '',
    email: user.email || '',
    role: user.role || '',
    jobTitle: user.jobTitle || '',
    office: user.office || '',
    active: user.active ?? true
  } : {
    name: '',
    email: '',
    role: '',
    jobTitle: '',
    office: '',
    active: true
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Jean Dupont" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="jean.dupont@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="field_officer">Agent de terrain</SelectItem>
                  <SelectItem value="program_manager">Responsable de programme</SelectItem>
                  <SelectItem value="data_analyst">Analyste de données</SelectItem>
                  <SelectItem value="it_support">Support IT</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre du poste</FormLabel>
              <FormControl>
                <Input placeholder="Coordinateur de suivi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="office"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bureau</FormLabel>
              <FormControl>
                <Input placeholder="Antananarivo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Statut du compte</FormLabel>
                <FormDescription>
                  Activer ou désactiver ce compte utilisateur
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>Annuler</Button>
          <Button type="submit">{user ? 'Mettre à jour' : 'Ajouter'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
