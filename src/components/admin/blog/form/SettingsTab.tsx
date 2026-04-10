
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, ArrowUpRight } from "lucide-react";
import TagManager from "./TagManager";
import { BlogPost, NewBlogPost } from "../types";

interface SettingsTabProps {
  post: BlogPost | NewBlogPost;
  idPrefix: string;
  onValueChange: (post: BlogPost | NewBlogPost) => void;
}

const SettingsTab = ({ post, idPrefix, onValueChange }: SettingsTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${idPrefix}-author`}>Auteur</Label>
        <Input
          id={`${idPrefix}-author`}
          value={post.author}
          onChange={(e) => onValueChange({ ...post, author: e.target.value })}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor={`${idPrefix}-publishDate`}>Date de publication</Label>
        <div className="flex items-center mt-1">
          <Calendar className="mr-2 h-4 w-4 opacity-50" />
          <Input
            id={`${idPrefix}-publishDate`}
            type="date"
            value={post.publishDate}
            onChange={(e) => onValueChange({ ...post, publishDate: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor={`${idPrefix}-status`}>Statut</Label>
        <div className="flex items-center space-x-2 mt-1">
          <select
            id={`${idPrefix}-status`}
            value={post.status}
            onChange={(e) => onValueChange({ ...post, status: e.target.value as "Publié" | "Brouillon" | "Programmé" })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Publié">Publié</option>
            <option value="Brouillon">Brouillon</option>
            <option value="Programmé">Programmé</option>
          </select>
        </div>
      </div>
      
      <div>
        <Label htmlFor={`${idPrefix}-slug`}>Slug URL</Label>
        <div className="flex items-center mt-1">
          <ArrowUpRight className="mr-2 h-4 w-4 opacity-50" />
          <Input
            id={`${idPrefix}-slug`}
            value={post.slug}
            onChange={(e) => onValueChange({ ...post, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') })}
            placeholder="url-de-larticle"
          />
        </div>
      </div>
      
      <TagManager
        tags={post.tags}
        onTagsChange={(tags) => onValueChange({ ...post, tags })}
      />
    </div>
  );
};

export default SettingsTab;
