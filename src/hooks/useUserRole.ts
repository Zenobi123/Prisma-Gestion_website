
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'user' | null;

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (roleError) {
          if (roleError.code === 'PGRST116') {
            // Aucun rôle trouvé, assigner le rôle par défaut
            setRole('user');
          } else {
            throw roleError;
          }
        } else {
          setRole(data.role as UserRole);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du rôle:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setRole('user'); // Rôle par défaut en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserRole();
    }
  }, [user, authLoading]);

  const isAdmin = role === 'admin';
  const isUser = role === 'user';

  return {
    role,
    isAdmin,
    isUser,
    loading: authLoading || loading,
    error,
  };
};
