
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { SiteBreadcrumb } from "@/components/ui/SiteBreadcrumb";

interface BlogPostHeaderProps {
  post: BlogPost;
  onBackClick: () => void;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ post, onBackClick }) => (
  <div className="mb-8">
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <SiteBreadcrumb
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.title }
        ]}
      />
      <button
        onClick={onBackClick}
        className="inline-flex items-center text-prisma-purple font-medium hover:text-prisma-purple/80 shrink-0"
        aria-label="Retour aux articles"
      >
        <ArrowLeft size={18} className="mr-2" />
        Retour aux articles
      </button>
    </div>
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {post.image && (
        <div className="w-full h-[300px] md:h-[400px] relative">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si l'image n'est pas chargée, on montre un placeholder seulement
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
      )}
      <div className="p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-prisma-purple mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center text-gray-600 mb-6">
          <div className="flex items-center mr-6 mb-2">
            <User className="h-4 w-4 mr-1" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{new Date(post.publishDate).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <span 
                key={tag} 
                className="bg-prisma-purple/10 text-prisma-purple text-xs font-medium px-2.5 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default BlogPostHeader;
