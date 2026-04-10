
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BlogPost, NewBlogPost } from "../types";

interface SEOTabProps {
  post: BlogPost | NewBlogPost;
  idPrefix: string;
  onValueChange: (post: BlogPost | NewBlogPost) => void;
}

const SEOTab = ({ post, idPrefix, onValueChange }: SEOTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${idPrefix}-seoTitle`}>Titre SEO</Label>
        <Input
          id={`${idPrefix}-seoTitle`}
          value={post.seoTitle}
          onChange={(e) => onValueChange({ ...post, seoTitle: e.target.value })}
          className="mt-1"
          placeholder="Titre optimisé pour les moteurs de recherche"
        />
        <p className="text-xs text-gray-500 mt-1">
          {post.seoTitle.length} caractères (idéalement entre 50 et 60)
        </p>
      </div>
      
      <div>
        <Label htmlFor={`${idPrefix}-seoDescription`}>Description SEO</Label>
        <Textarea
          id={`${idPrefix}-seoDescription`}
          value={post.seoDescription}
          onChange={(e) => onValueChange({ ...post, seoDescription: e.target.value })}
          className="mt-1"
          placeholder="Description optimisée pour les moteurs de recherche"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          {post.seoDescription.length} caractères (idéalement entre 120 et 160)
        </p>
      </div>
      
      <div className="pt-4 border-t">
        <Label className="flex items-center justify-between">
          <span>Générer automatiquement les méta-données</span>
          <Switch />
        </Label>
        <p className="text-xs text-gray-500 mt-1">
          Utiliser l'IA pour générer les métadonnées SEO à partir du contenu de l'article.
        </p>
      </div>
    </div>
  );
};

export default SEOTab;
