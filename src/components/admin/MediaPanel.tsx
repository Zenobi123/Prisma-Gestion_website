
import { useState, useEffect, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Upload, Trash, Download, Image, File } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type MediaFile = {
  id: string;
  file_name: string;
  url: string;
  uploaded_at: string;
  uploaded_by?: string | null;
  size_in_bytes?: number | null;
  type?: string | null;
};

const MEDIA_BUCKET = "media";

export default function MediaPanel() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Récupère la liste des fichiers en BDD
  async function fetchFiles() {
    const { data, error } = await supabase
      .from("media_files")
      .select("*")
      .order("uploaded_at", { ascending: false });
    if (!error && data) setFiles(data as MediaFile[]);
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  async function handleUpload(ev: ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `${Date.now()}-${file.name}`;
    // 1. Upload du fichier dans le storage (on crée le bucket s'il n'existe pas déjà)
    const { data: upData, error: upErr } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(filePath, file);
    if (upErr) {
      toast({ title: "Échec de l'upload", description: upErr.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    // 2. Récupération de l'URL publique
    const { data: publicUrlData } = supabase
      .storage
      .from(MEDIA_BUCKET)
      .getPublicUrl(filePath);
    const url = publicUrlData.publicUrl;

    // 3. Insert metadata en BDD
    await supabase.from("media_files").insert([
      {
        file_name: file.name,
        url,
        uploaded_by: "admin",
        size_in_bytes: file.size,
        type: file.type,
      }
    ]);
    toast({ title: "Fichier uploadé", description: file.name + " a été ajouté !" });
    fetchFiles();
    setUploading(false);
  }

  // Suppression d'un fichier (soft : juste BDD, pas storage)
  async function handleDelete(id: string) {
    await supabase.from("media_files").delete().eq("id", id);
    setFiles(files.filter(f => f.id !== id));
    toast({ title: "Fichier supprimé" });
  }

  // Téléchargement du fichier
  function handleDownload(url: string) {
    window.open(url, "_blank");
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des fichiers médias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleUpload}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                disabled={uploading}
              />
              <Button variant="default" disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Téléchargement..." : "Uploader un fichier"}
              </Button>
            </label>
          </div>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead>Téléchargement</TableHead>
                  <TableHead>Suppression</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-gray-500">Aucun fichier</TableCell>
                  </TableRow>
                )}
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="flex items-center gap-2">
                      {(file.type || "").startsWith("image/")
                        ? <Image className="w-4 h-4" />
                        : <File className="w-4 h-4" />}
                      <span>{file.file_name}</span>
                    </TableCell>
                    <TableCell>{file.type || "?"}</TableCell>
                    <TableCell>{file.size_in_bytes ? (file.size_in_bytes/1024).toFixed(1) + "Ko" : "-"}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDownload(file.url)}
                        title="Télécharger"
                        size="icon"
                        variant="outline"
                      >
                        <Download />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDelete(file.id)}
                        variant="destructive"
                        size="icon"
                        title="Supprimer"
                      >
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
