
import { supabase } from "@/integrations/supabase/client";

/**
 * Va chercher l'image canonique pour un titre d'article en base via la fonction SQL Supabase.
 * Retourne null si aucun mapping n'existe.
 */
export const getDefaultImageForTitle = async (title: string): Promise<string | null> => {
  const { data, error } = await supabase.rpc('get_default_image_for_blog_title', { title_to_check: title });
  if (error) {
    console.error('Erreur lors de la récupération de l\'image par défaut pour le titre:', error);
    return null;
  }
  return data || null;
};
