
import { MessageCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const CommentsTab = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-xl font-medium">Aucun commentaire</p>
        <p className="text-muted-foreground mt-2 text-center max-w-md">
          Les commentaires sur les articles de blog apparaîtront ici lorsque cette fonctionnalité sera activée.
        </p>
      </CardContent>
    </Card>
  );
};

export default CommentsTab;
