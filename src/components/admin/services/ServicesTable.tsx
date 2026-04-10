
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ServiceType } from "@/types/services";
import { Pencil, Trash2, Image } from "lucide-react";

interface ServicesTableProps {
  services: ServiceType[];
  onEdit: (service: ServiceType) => void;
  onDelete: (service: ServiceType) => void;
  isSubmitting: boolean;
}

export const ServicesTable = ({ services, onEdit, onDelete, isSubmitting }: ServicesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Titre</TableHead>
          <TableHead className="w-[40%]">Description</TableHead>
          <TableHead>Éléments</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell>
              {service.image ? (
                <div className="h-10 w-10 rounded overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
              ) : (
                <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                  <Image size={16} className="text-gray-400" />
                </div>
              )}
            </TableCell>
            <TableCell className="font-medium">{service.title}</TableCell>
            <TableCell className="truncate max-w-[400px]">{service.description}</TableCell>
            <TableCell>{service.items.length}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(service)}
                disabled={isSubmitting}
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(service)}
                disabled={isSubmitting}
              >
                <Trash2 size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
