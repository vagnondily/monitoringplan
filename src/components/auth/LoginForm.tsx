
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, LockKeyhole, User } from 'lucide-react';

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'admin@mems.org',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'administrator',
    fieldOffice: 'Headquarters',
    jobTitle: 'System Administrator',
  },
  {
    id: '2',
    email: 'creator@mems.org',
    password: 'creator123',
    firstName: 'Creator',
    lastName: 'User',
    role: 'creator',
    fieldOffice: 'Field Office 1',
    jobTitle: 'Data Specialist',
  },
  {
    id: '3',
    email: 'viewer@mems.org',
    password: 'viewer123',
    firstName: 'Viewer',
    lastName: 'User',
    role: 'viewer',
    fieldOffice: 'Field Office 2',
    jobTitle: 'Regional Manager',
  },
];

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { setUser, setIsAuthenticated } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // This is a mock authentication process
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );
      
      if (user) {
        // Remove the password before storing in state
        const { password, ...userWithoutPassword } = user;
        setUser(userWithoutPassword as any);
        setIsAuthenticated(true);
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${user.firstName}!`,
        });
        navigate('/');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password. Please try again.',
          variant: 'destructive',
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full border shadow-sm rounded-md overflow-hidden">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-2xl font-bold text-[#0A2647]">
          MEMS Login
        </CardTitle>
        <CardDescription>
          Monitoring & Evaluation Management System
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <User size={18} />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <a href="#" className="text-xs text-[#2563EB] hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <LockKeyhole size={18} />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#2563EB] hover:bg-[#1E40AF] transition-colors" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col text-center pt-0">
        <div className="text-xs text-muted-foreground mt-4">
          For demo purposes, use these credentials:
          <div className="mt-2 grid gap-1">
            <div>Admin: admin@mems.org / admin123</div>
            <div>Creator: creator@mems.org / creator123</div>
            <div>Viewer: viewer@mems.org / viewer123</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
