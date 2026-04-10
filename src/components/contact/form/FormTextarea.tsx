
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormTextareaProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const FormTextarea = ({
  id,
  label,
  value,
  placeholder,
  rows = 4,
  required = false,
  error,
  onChange
}: FormTextareaProps) => {
  return (
    <div>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        className={`w-full px-3 md:px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-prisma-purple focus:border-prisma-purple outline-none transition text-base resize-y`}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormTextarea;
