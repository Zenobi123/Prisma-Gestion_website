
import FormInput from "@/components/contact/form/FormInput";
import FormTextarea from "@/components/contact/form/FormTextarea";
import ServiceSelector from "@/components/contact/form/ServiceSelector";
import SubmitButton from "@/components/SubmitButton";

interface QuoteFormProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    service: string;
    details: string;
  };
  errors: {
    fullName: string;
    email: string;
    phone: string;
    details: string;
  };
  loading: boolean;
  serviceTitle?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onServiceChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export function QuoteForm({
  formData,
  errors,
  loading,
  serviceTitle,
  onInputChange,
  onServiceChange,
  onSubmit,
  onCancel
}: QuoteFormProps) {
  return (
    <form
      className="space-y-4 pt-2"
      onSubmit={onSubmit}
    >
      <FormInput
        id="fullName"
        label="Nom complet"
        value={formData.fullName}
        onChange={onInputChange}
        placeholder="Votre nom"
        autoComplete="name"
        required
        error={errors.fullName}
      />
      
      <FormInput
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={onInputChange}
        placeholder="votre@email.com"
        autoComplete="email"
        required
        error={errors.email}
      />
      
      <FormInput
        id="phone"
        label="Numéro de téléphone"
        value={formData.phone}
        onChange={onInputChange}
        placeholder="Ex: 694123456"
        autoComplete="tel"
        required
        error={errors.phone}
      />
      
      {!serviceTitle && (
        <ServiceSelector
          value={formData.service}
          onValueChange={onServiceChange}
          label="Service souhaité"
        />
      )}
      
      <FormTextarea
        id="details"
        label="Détails du projet"
        value={formData.details}
        onChange={onInputChange}
        placeholder="Décrivez brièvement votre besoin"
        rows={3}
        required
        error={errors.details}
      />
      
      <div className="flex justify-end space-x-2">
        <button 
          type="button" 
          className="btn-primary px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
          disabled={loading}
          onClick={onCancel}
        >
          Annuler
        </button>
        <SubmitButton 
          isSubmitting={loading}
          text="Envoyer la demande"
          loadingText="Envoi en cours..."
        />
      </div>
    </form>
  );
}
