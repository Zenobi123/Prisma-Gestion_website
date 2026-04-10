
import { supabase } from "@/integrations/supabase/client";

export const CONTACT_CONFIG_ID = "1"; // ID fixe pour la configuration de contact

export async function getContactConfig() {
  try {
    const { data, error } = await supabase
      .from("contact_config")
      .select("*")
      .eq("id", CONTACT_CONFIG_ID)
      .maybeSingle();

    if (error) {
      console.error("Erreur lors de la récupération de la configuration de contact:", error);
      throw error;
    }
    
    console.log("Configuration de contact récupérée:", data);
    return data;
  } catch (error) {
    console.error("Exception lors de la récupération de la configuration de contact:", error);
    throw error;
  }
}

export async function upsertContactConfig(config: Partial<{
  title: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  form_title: string;
  form_description: string;
}> & { title: string }) {
  try {
    // Nous nous assurons que title est toujours présent avec le type intersection
    const { data, error } = await supabase
      .from("contact_config")
      .upsert({
        id: CONTACT_CONFIG_ID,
        ...config
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Erreur lors de la mise à jour de la configuration de contact:", error);
      throw error;
    }
    
    console.log("Configuration de contact mise à jour:", data);
    
    // Déclencher l'événement de mise à jour du contenu
    window.dispatchEvent(new CustomEvent('home-content-update', {
      detail: { 
        section: 'contact',
        timestamp: new Date().getTime() 
      }
    }));
    
    return data;
  } catch (error) {
    console.error("Exception lors de la mise à jour de la configuration de contact:", error);
    throw error;
  }
}
