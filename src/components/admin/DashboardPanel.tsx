
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Mail, Eye } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDashboard } from "@/hooks/useDashboard";

const DashboardPanel = () => {
  const { stats, isLoading } = useDashboard();

  // Dashboard statistics cards configuration
  const statsCards = [
    { 
      title: "Utilisateurs", 
      value: stats.userCount.toString(), 
      icon: Users, 
      color: "bg-blue-500" 
    },
    { 
      title: "Articles", 
      value: stats.articleCount.toString(), 
      icon: BookOpen, 
      color: "bg-green-500" 
    },
    { 
      title: "Demandes", 
      value: stats.contactRequestCount.toString(), 
      icon: Mail, 
      color: "bg-yellow-500" 
    },
    { 
      title: "Vues", 
      value: stats.viewCount.toLocaleString('fr-FR'), 
      icon: Eye, 
      color: "bg-purple-500" 
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-[#2E1A47]">Tableau de bord</h2>
          <p className="text-gray-500">Bienvenue dans l'administration de PRISMA GESTION</p>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-prisma-purple"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#2E1A47]">Tableau de bord</h2>
        <p className="text-gray-500">Bienvenue dans l'administration de PRISMA GESTION</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visites du site</CardTitle>
            <CardDescription>Statistiques des 7 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.visitData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#2E1A47" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="mr-4">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6DD00] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D6DD00]"></span>
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
              
              {stats.recentActivities.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-gray-500">Aucune activité récente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPanel;
