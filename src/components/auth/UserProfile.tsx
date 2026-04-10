
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User } from 'lucide-react';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  if (!user) return null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profil utilisateur
        </CardTitle>
        <CardDescription>
          Informations de votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-lg">{user.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">ID utilisateur</p>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded">{user.id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Membre depuis</p>
          <p className="text-lg">
            {new Date(user.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <Button 
          onClick={handleSignOut}
          variant="outline"
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
