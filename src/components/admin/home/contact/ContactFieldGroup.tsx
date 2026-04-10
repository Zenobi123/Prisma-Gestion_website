
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactFieldGroupProps {
  contactData: {
    title: string;
    description: string;
    address: string;
    email: string;
    phone: string;
    whatsapp: string;
    formTitle: string;
    formDescription: string;
  };
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContactFieldGroup = ({ contactData, isLoading, handleChange }: ContactFieldGroupProps) => (
  <div className="space-y-4">
    <div>
      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
        Titre
      </label>
      <Input
        id="title"
        name="title"
        value={contactData.title}
        onChange={handleChange}
        disabled={isLoading}
      />
    </div>

    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <Textarea
        id="description"
        name="description"
        value={contactData.description}
        onChange={handleChange}
        rows={3}
        disabled={isLoading}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Adresse
        </label>
        <Input
          id="address"
          name="address"
          value={contactData.address}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          id="email"
          name="email"
          value={contactData.email}
          onChange={handleChange}
          type="email"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Téléphone
        </label>
        <Input
          id="phone"
          name="phone"
          value={contactData.phone}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
          WhatsApp
        </label>
        <Input
          id="whatsapp"
          name="whatsapp"
          value={contactData.whatsapp}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>
    </div>

    <div>
      <label htmlFor="formTitle" className="block text-sm font-medium text-gray-700 mb-1">
        Titre du formulaire
      </label>
      <Input
        id="formTitle"
        name="formTitle"
        value={contactData.formTitle}
        onChange={handleChange}
        disabled={isLoading}
      />
    </div>

    <div>
      <label htmlFor="formDescription" className="block text-sm font-medium text-gray-700 mb-1">
        Description du formulaire
      </label>
      <Textarea
        id="formDescription"
        name="formDescription"
        value={contactData.formDescription}
        onChange={handleChange}
        rows={2}
        disabled={isLoading}
      />
    </div>
  </div>
);

export default ContactFieldGroup;
