
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Upload, 
  Database, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Settings
} from 'lucide-react';

const BackupPanel = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const mockBackups = [
    {
      id: '1',
      name: 'Sauvegarde automatique',
      date: '2024-01-15 03:00:00',
      size: '45.2 MB',
      type: 'auto',
      status: 'success'
    },
    {
      id: '2',
      name: 'Sauvegarde manuelle',
      date: '2024-01-14 14:30:00',
      size: '43.8 MB',
      type: 'manual',
      status: 'success'
    },
    {
      id: '3',
      name: 'Sauvegarde automatique',
      date: '2024-01-14 03:00:00',
      size: '44.1 MB',
      type: 'auto',
      status: 'success'
    },
    {
      id: '4',
      name: 'Sauvegarde automatique',
      date: '2024-01-13 03:00:00',
      size: '42.9 MB',
      type: 'auto',
      status: 'warning'
    }
  ];

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      // Simulation de création de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "Sauvegarde créée",
        description: "La sauvegarde manuelle a été créée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = (backupId: string) => {
    toast({
      title: "Téléchargement démarré",
      description: "Le téléchargement de la sauvegarde va commencer.",
    });
  };

  const handleRestoreBackup = (backupId: string) => {
    toast({
      title: "Restauration planifiée",
      description: "La restauration sera effectuée lors de la prochaine maintenance.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Réussie</Badge>;
      case 'warning':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Avertissement</Badge>;
      case 'error':
        return <Badge variant="destructive">Échec</Badge>;
      default:
        return <Badge variant="secondary">Inconnue</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'auto' ? <Calendar className="h-4 w-4" /> : <Settings className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sauvegarde & Restauration</h1>
          <p className="text-gray-600">Gestion des sauvegardes de la base de données</p>
        </div>
        <Button onClick={handleCreateBackup} disabled={loading}>
          {loading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Database className="h-4 w-4 mr-2" />
          )}
          Créer une sauvegarde
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière sauvegarde</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 Jan 2024</div>
            <p className="text-xs text-muted-foreground">03:00 (Automatique)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taille totale</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">176 MB</div>
            <p className="text-xs text-muted-foreground">4 sauvegardes disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prochaine sauvegarde</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16 Jan</div>
            <p className="text-xs text-muted-foreground">03:00 (dans 18h)</p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration automatique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configuration automatique</span>
          </CardTitle>
          <CardDescription>
            Paramètres des sauvegardes automatiques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Fréquence</p>
                <p className="text-sm text-gray-600">Quotidienne à 03:00</p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">Activée</Badge>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Rétention</p>
                <p className="text-sm text-gray-600">7 jours</p>
              </div>
              <Badge variant="default">Configurée</Badge>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Compression</p>
                <p className="text-sm text-gray-600">Gzip activée</p>
              </div>
              <Badge variant="default" className="bg-blue-100 text-blue-800">Optimisée</Badge>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-gray-600">Email admin</p>
              </div>
              <Badge variant="default">Activées</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des sauvegardes */}
      <Card>
        <CardHeader>
          <CardTitle>Sauvegardes disponibles</CardTitle>
          <CardDescription>
            Historique des sauvegardes récentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockBackups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  {getTypeIcon(backup.type)}
                  <div>
                    <p className="font-medium">{backup.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(backup.date).toLocaleString()} • {backup.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(backup.status)}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadBackup(backup.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestoreBackup(backup.id)}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Avertissements */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Recommandations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-orange-700">
          <ul className="space-y-2 text-sm">
            <li>• Testez régulièrement vos sauvegardes en les restaurant sur un environnement de test</li>
            <li>• Conservez des sauvegardes hors site pour une protection optimale</li>
            <li>• Vérifiez l'intégrité des sauvegardes avant de supprimer les anciennes</li>
            <li>• Documentez votre processus de restauration d'urgence</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupPanel;
