
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const TrafficTab = () => {
  const topPages = [
    { path: '/', views: 1205, bounce: '32%' },
    { path: '/services', views: 892, bounce: '28%' },
    { path: '/blog', views: 634, bounce: '45%' },
    { path: '/calculateur-impots', views: 523, bounce: '22%' },
    { path: '/outils', views: 298, bounce: '38%' }
  ];

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pages les plus visitées</CardTitle>
          <CardDescription>
            Classement des pages par nombre de vues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={page.path} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 w-6">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{page.path}</p>
                    <p className="text-sm text-gray-500">{page.views} vues</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Taux de rebond</p>
                  <p className="text-sm text-gray-500">{page.bounce}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
