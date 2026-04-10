
import { Badge } from "@/components/ui/badge";
import { FC } from "react";

interface NotificationBadgeProps {
  count: number;
}

const NotificationBadge: FC<NotificationBadgeProps> = ({ count }) => {
  if (count <= 0) return null;
  
  return (
    <Badge 
      className="bg-prisma-chartreuse text-prisma-purple hover:bg-prisma-chartreuse/90"
      aria-label={`${count} nouveaux messages`}
    >
      {count}
    </Badge>
  );
};

export default NotificationBadge;
