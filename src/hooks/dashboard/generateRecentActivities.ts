
import { formatActivityTime } from "./formatActivityTime";
import { parseActivityTime } from "./parseActivityTime";

export const generateRecentActivities = (
  recentPosts: any[] | null, 
  recentMessages: any[] | null
) => {
  const activities = [];
  let idCounter = 1;

  // Add recent contact messages
  if (recentMessages && recentMessages.length > 0) {
    recentMessages.forEach(message => {
      activities.push({
        id: idCounter++,
        type: 'contact',
        message: `Nouvelle demande de devis de ${message.first_name} ${message.last_name}`,
        time: formatActivityTime(message.date)
      });
    });
  }

  // Add recent blog posts
  if (recentPosts && recentPosts.length > 0) {
    recentPosts.forEach(post => {
      const action = post.status === 'Publié' ? 'publié' : 'créé';
      activities.push({
        id: idCounter++,
        type: 'blog',
        message: `Article '${post.title}' ${action}`,
        time: formatActivityTime(post.created_at)
      });
    });
  }

  // Sort activities by recency
  activities.sort((a, b) => {
    const timeA = parseActivityTime(a.time);
    const timeB = parseActivityTime(b.time);
    return timeB.getTime() - timeA.getTime();
  });

  // Limit to maximum 4 activities
  return activities.slice(0, 4);
};
