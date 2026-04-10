
-- Activer RLS sur toutes les tables qui n'en ont pas
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- Créer la table des rôles utilisateurs
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction sécurisée pour vérifier les rôles (évite la récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Fonction pour vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Politiques RLS pour contact_messages
CREATE POLICY "Admins can view all contact messages"
ON public.contact_messages FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update contact messages"
ON public.contact_messages FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Anyone can insert contact messages"
ON public.contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Politiques RLS pour quote_requests
CREATE POLICY "Admins can view all quote requests"
ON public.quote_requests FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update quote requests"
ON public.quote_requests FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete quote requests"
ON public.quote_requests FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Anyone can insert quote requests"
ON public.quote_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Politiques RLS pour appointments
CREATE POLICY "Admins can view all appointments"
ON public.appointments FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update appointments"
ON public.appointments FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete appointments"
ON public.appointments FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Anyone can insert appointments"
ON public.appointments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Politiques RLS pour blog_posts (correction: utiliser 'status' au lieu de 'published')
CREATE POLICY "Everyone can view published blog posts"
ON public.blog_posts FOR SELECT
TO anon, authenticated
USING (status = 'Publié');

CREATE POLICY "Admins can view all blog posts"
ON public.blog_posts FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can insert blog posts"
ON public.blog_posts FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update blog posts"
ON public.blog_posts FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts FOR DELETE
TO authenticated
USING (public.is_admin());

-- Politiques RLS pour services
CREATE POLICY "Everyone can view services"
ON public.services FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage services"
ON public.services FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Politiques RLS pour media_files
CREATE POLICY "Admins can manage media files"
ON public.media_files FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Politiques RLS pour user_roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can manage user roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Tables de configuration protégées
ALTER TABLE public.contact_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_image_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view config"
ON public.contact_config FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage config"
ON public.contact_config FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Everyone can view site sections"
ON public.site_sections FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage site sections"
ON public.site_sections FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Everyone can view blog image mappings"
ON public.blog_image_mappings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage blog image mappings"
ON public.blog_image_mappings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Fonction pour créer automatiquement un rôle utilisateur lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Trigger pour assigner automatiquement le rôle 'user' aux nouveaux utilisateurs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insérer un utilisateur admin par défaut (remplacez l'email par le vôtre)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'nobiangtime@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
