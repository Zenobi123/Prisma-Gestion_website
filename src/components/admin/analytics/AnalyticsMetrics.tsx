
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Eye, MessageSquare, TrendingUp } from 'lucide-react';

export const AnalyticsMetrics = () => {
  const mockData = {
    visitors: {
      total: 1247,
      thisMonth: 342,
      growth: '+12%'
    },
    pageViews: {
      total: 3891,
      thisMonth: 892,
      growth: '+8%'
    },
    messages: {
      total: 156,
      thisMonth: 43,
      growth: '+23%'
    },
    quotes: {
      total: 89,
      thisMonth: 25,
      growth: '+15%'
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visiteurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockData.visitors.total.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">{mockData.visitors.growth}</span> ce mois
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pages vues</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockData.pageViews.total.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">{mockData.pageViews.growth}</span> ce mois
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockData.messages.total}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">{mockData.messages.growth}</span> ce mois
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Devis</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockData.quotes.total}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">{mockData.quotes.growth}</span> ce mois
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
