
import React from "react";
import { Button } from "@/components/ui/button";

interface SpecialArticleNoticeProps {
  isUpdatingContent: boolean;
  onUpdate: () => void;
}

const SpecialArticleNotice = ({ isUpdatingContent, onUpdate }: SpecialArticleNoticeProps) => {
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
      <h3 className="font-medium text-amber-800">
        Article spécial: "Les avantages de la comptabilité en ligne"
      </h3>
      <p className="text-amber-700 text-sm mt-1">
        Cet article possède un contenu formaté spécial. Vous pouvez le mettre à jour avec le contenu optimisé.
      </p>
      <Button
        onClick={onUpdate}
        disabled={isUpdatingContent}
        className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
      >
        {isUpdatingContent ? "Mise à jour..." : "Mettre à jour le contenu formaté"}
      </Button>
    </div>
  );
};

export default SpecialArticleNotice;
