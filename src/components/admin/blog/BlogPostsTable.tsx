
import React from "react";
import { Calendar, Eye, Pencil, Trash2, MoreHorizontal, Clock, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types/blog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface BlogPostsTableProps {
  posts: BlogPost[];
  isLoading: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onPublish: (post: BlogPost) => void;
  onSchedule: (post: BlogPost) => void;
}

const BlogPostsTable = ({ 
  posts, 
  isLoading, 
  onEdit, 
  onDelete,
  onPublish,
  onSchedule
}: BlogPostsTableProps) => {
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-prisma-purple"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Titre</TableHead>
            <TableHead>Auteur</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Aucun article trouvé
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded mr-3 flex-shrink-0">
                      <img src={post.image} alt="" className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="truncate max-w-[300px]">{post.title}</div>
                  </div>
                </TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{new Date(post.publishDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    post.status === "Publié" 
                      ? "bg-green-100 text-green-800" 
                      : post.status === "Brouillon"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-100 text-blue-800"
                  }`}>
                    {post.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {post.status !== "Publié" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => onPublish(post)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Publier
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Visualiser</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(post)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {post.status !== "Publié" && (
                          <DropdownMenuItem onClick={() => onPublish(post)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <span>Publier</span>
                          </DropdownMenuItem>
                        )}
                        {post.status !== "Programmé" && (
                          <DropdownMenuItem onClick={() => onSchedule(post)}>
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Programmer</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDelete(post)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogPostsTable;
