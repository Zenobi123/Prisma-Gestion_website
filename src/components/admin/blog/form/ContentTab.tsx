
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "./ImageUploader";
import { BlogPost, NewBlogPost } from "@/types/blog";

interface ContentTabProps {
  post: BlogPost | NewBlogPost;
  idPrefix: string;
  onValueChange: (post: BlogPost | NewBlogPost) => void;
  // Permet d'accueillir une gestion spéciale du collage HTML
  onContentPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
}

const ContentTab = ({ post, idPrefix, onValueChange, onContentPaste }: ContentTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${idPrefix}-title`}>Titre</Label>
        <Input
          id={`${idPrefix}-title`}
          value={post.title}
          onChange={(e) => onValueChange({ ...post, title: e.target.value })}
          className="mt-1"
          placeholder="Titre de l'article"
        />
      </div>

      <ImageUploader
        initialImage={post.image}
        idPrefix={idPrefix}
        onImageChange={(imageUrl) => onValueChange({ ...post, image: imageUrl })}
      />
      
      <div>
        <Label htmlFor={`${idPrefix}-excerpt`}>Extrait</Label>
        <Textarea
          id={`${idPrefix}-excerpt`}
          value={post.excerpt || ""}
          onChange={(e) => onValueChange({ ...post, excerpt: e.target.value })}
          className="mt-1"
          placeholder="Court résumé de l'article"
          rows={2}
        />
      </div>
      
      <div>
        <Label htmlFor={`${idPrefix}-content`}>Contenu</Label>
        <Textarea
          id={`${idPrefix}-content`}
          value={post.content || ""}
          onChange={(e) => onValueChange({ ...post, content: e.target.value })}
          className="mt-1 font-mono text-sm"
          placeholder="Contenu complet de l'article"
          rows={15}
          // Ajout du gestionnaire d'événement spécial pour le collage HTML
          onPaste={onContentPaste}
        />
        <p className="mt-2 text-xs text-gray-500">
          Vous pouvez utiliser du HTML pour mettre en forme votre contenu. Les balises classiques comme h2, h3, p, ul, li, blockquote sont supportées.<br />
          Pour coller un article riche depuis Word ou Google Docs, utilisez le raccourci clavier <span className="font-bold">Ctrl+V</span> ou <span className="font-bold">Cmd+V</span>.
        </p>
      </div>
    </div>
  );
};

export default ContentTab;
