
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Image, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface ImageUploaderProps {
  initialImage: string;
  onImageChange: (imageUrl: string) => void;
  idPrefix: string;
  disabled?: boolean;
}

const ImageUploader = ({ initialImage, onImageChange, idPrefix, disabled = false }: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setPreviewUrl(initialImage);
  }, [initialImage]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const fileType = file.type;
    
    if (!fileType.startsWith("image/")) {
      toast({
        title: "Type de fichier non valide",
        description: "Veuillez sélectionner une image valide.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Preview local
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Supabase Storage
      const filePath = `images/${idPrefix}-${Date.now()}-${file.name}`;
      
      const uploadOptions = {
        cacheControl: '3600',
        contentType: fileType,
        upsert: false
      };
      
      const progressCallback = (progress: { loaded: number; total: number }) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setUploadProgress(percent);
      };
      
      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file, uploadOptions);

      if (error) {
        throw error;
      }

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(data.path);
        
        console.log('Image uploaded successfully. Public URL:', publicUrl);
        onImageChange(publicUrl);
        
        toast({
          title: "Image téléversée",
          description: "L'image a été téléversée avec succès.",
        });
      }
    } catch (err) {
      console.error("Erreur lors du téléversement de l'image:", err);
      
      toast({
        title: "Erreur de téléversement",
        description: "Une erreur s'est produite lors du téléversement de l'image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label>Image d'accroche</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <div className="w-full aspect-video bg-gray-100 rounded-md overflow-hidden mb-2 flex items-center justify-center">
            {previewUrl ? (
              <OptimizedImage
                src={previewUrl}
                alt="Aperçu de l'image"
                className="w-full h-full object-cover"
                fallback="/placeholder.svg"
              />
            ) : (
              <div className="text-center p-4">
                <Image className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Aucune image sélectionnée</p>
              </div>
            )}
          </div>
          
          <div className="w-full">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id={`${idPrefix}-image-input`}
              disabled={isUploading || disabled}
            />
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById(`${idPrefix}-image-input`)?.click()}
              disabled={isUploading || disabled}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Téléversement ({uploadProgress}%)
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choisir une image
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col justify-center space-y-2">
          <p className="text-sm text-gray-500">
            Image d'accroche pour l'article. Format recommandé : 16:9
          </p>
          <p className="text-sm text-gray-500">
            Pour une meilleure expérience utilisateur, choisissez une image de haute qualité et pertinente.
          </p>
          <p className="text-sm text-gray-500">
            Formats acceptés : JPG, PNG, WebP
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
