
import { useState, useEffect } from "react";
import { submitQuote } from "@/utils/quotes/submitQuote";
import { useToast } from "@/hooks/use-toast";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  details: string;
};

type FormErrors = {
  fullName: string;
  email: string;
  phone: string;
  details: string;
};

const initialFormState: FormData = {
  fullName: "",
  email: "",
  phone: "",
  service: "",
  details: ""
};

const initialErrorState: FormErrors = {
  fullName: "",
  email: "",
  phone: "",
  details: ""
};

export function useQuoteForm(serviceTitle?: string) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const { toast } = useToast();

  useEffect(() => {
    if (serviceTitle) {
      setFormData(prev => ({
        ...prev,
        service: serviceTitle
      }));
    }
  }, [serviceTitle]);

  const resetForm = () => {
    setFormData({
      ...initialFormState,
      service: serviceTitle || ""
    });
    setErrors(initialErrorState);
    setSent(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [id]: ""
      }));
    }
  };

  const handleServiceChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      service: value
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...initialErrorState };
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Veuillez entrer votre nom complet";
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Veuillez entrer votre email";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Veuillez entrer un email valide";
      isValid = false;
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Veuillez entrer votre numéro de téléphone";
      isValid = false;
    }
    
    if (!formData.details.trim()) {
      newErrors.details = "Veuillez décrire votre projet";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires correctement.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { id, error } = await submitQuote({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        details: formData.details,
        service: formData.service || serviceTitle || null
      });

      if (error) {
        throw new Error(String(error));
      }

      setSent(true);
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande de devis a bien été enregistrée.",
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du devis:", error);
      toast({
        title: "Erreur lors de l'envoi",
        description: "Votre demande n'a pas pu être envoyée. Merci de réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    sent,
    loading,
    handleInputChange,
    handleServiceChange,
    handleSubmit,
    resetForm
  };
}
