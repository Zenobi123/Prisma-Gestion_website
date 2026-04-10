
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPanelHeaderProps {
  onAddClick: () => void;
}

const BlogPanelHeader = ({ onAddClick }: BlogPanelHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-[#2E1A47]">Gestion du blog</h2>
        <p className="text-gray-500">Créez, modifiez et publiez des articles de blog</p>
      </div>
      <Button 
        onClick={onAddClick}
        className="bg-[#2E1A47] hover:bg-[#2E1A47]/90"
      >
        <PlusCircle size={16} className="mr-2" />
        Nouvel article
      </Button>
    </div>
  );
};

export default BlogPanelHeader;
