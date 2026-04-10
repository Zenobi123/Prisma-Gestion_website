import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Liste complète des services disponibles
export const services = [
  { value: "comptabilite", label: "Comptabilité" },
  { value: "finance", label: "Finance" },
  { value: "fiscalite", label: "Fiscalité" },
  { value: "ressources-humaines", label: "Ressources Humaines" },
  { value: "genie-logiciel", label: "Génie Logiciel" },
  { value: "intelligence-artificielle", label: "Intelligence Artificielle" }
];

interface ServiceSelectorProps {
  value: string;
  onValueChange?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  required?: boolean;
  error?: string;
  id?: string;
}

const ServiceSelector = ({ 
  value, 
  onValueChange,
  onChange,
  label = "Service",
  required = false,
  error,
  id = "subject"
}: ServiceSelectorProps) => {
  // Gérer le changement en fonction de la méthode fournie
  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <div>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500">*</span>}
      </Label>
      <Select 
        value={value} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger id={id} className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-prisma-purple focus:border-prisma-purple`}>
          <SelectValue placeholder="Sélectionnez un service" />
        </SelectTrigger>
        <SelectContent>
          {services.map((service) => (
            <SelectItem key={service.value} value={service.value}>
              {service.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ServiceSelector;
