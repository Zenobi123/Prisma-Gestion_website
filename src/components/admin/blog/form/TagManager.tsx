
import React, { useState } from "react";
import { Tag } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagManager = ({ tags, onTagsChange }: TagManagerProps) => {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (tag: string) => {
    if (!tag.trim() || tags.includes(tag)) return;
    onTagsChange([...tags, tag]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <Label>Tags</Label>
      <div className="flex items-center mt-1">
        <Tag className="mr-2 h-4 w-4 opacity-50" />
        <div className="flex-1">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Ajouter un tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag(tagInput);
              }
            }}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="ml-2"
          onClick={() => handleAddTag(tagInput)}
        >
          Ajouter
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <div key={index} className="bg-[#2E1A47]/10 text-[#2E1A47] px-2 py-1 rounded-full text-xs flex items-center">
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 text-[#2E1A47] hover:text-[#2E1A47]/80"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagManager;
