
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock, MoreHorizontal, Phone, User, MessageSquare } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentStatus } from '@/utils/appointment/types';
import { getAppointments, updateAppointmentStatus, deleteAppointment } from '@/utils/appointment/crud';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">En attente</Badge>;
    case 'confirmed':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Confirmé</Badge>;
    case 'canceled':
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Annulé</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Terminé</Badge>;
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
};

const formatDate = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), 'dd MMMM yyyy', { locale: fr });
  } catch (e) {
    console.error("Erreur de format de date:", e);
    return dateStr;
  }
};

const AppointmentsPanel = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rendez-vous.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    
    // Configuration d'un écouteur pour les mises à jour en temps réel
    const channel = supabase
      .channel('admin-appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        () => {
          console.log('Mise à jour détectée dans la table appointments');
          loadAppointments();
        }
      )
      .subscribe();
    
    // Écouteur d'événement personnalisé
    const handleCustomEvent = () => {
      console.log('Événement appointmentsUpdated détecté');
      loadAppointments();
    };
    
    window.addEventListener('appointmentsUpdated', handleCustomEvent);
    
    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('appointmentsUpdated', handleCustomEvent);
    };
  }, [toast]);

  const handleUpdateStatus = async (id: string, status: 'pending' | 'confirmed' | 'canceled' | 'completed') => {
    try {
      await updateAppointmentStatus(id, status);
      toast({
        title: "Statut mis à jour",
        description: "Le statut du rendez-vous a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du rendez-vous.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedAppointment) return;
    
    try {
      await deleteAppointment(selectedAppointment.id);
      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès.",
      });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Erreur lors de la suppression du rendez-vous:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous.",
        variant: "destructive",
      });
    }
  };

  const showDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsDialog(true);
  };

  const pendingCount = appointments.filter(app => app.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rendez-vous</h2>
          <p className="text-muted-foreground">
            Gérez les demandes de rendez-vous.
            {pendingCount > 0 && (
              <Badge className="ml-2 bg-yellow-400 text-yellow-900">
                {pendingCount} {pendingCount === 1 ? 'en attente' : 'en attente'}
              </Badge>
            )}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-prisma-purple rounded-full"></div>
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-medium">Aucun rendez-vous</p>
            <p className="text-muted-foreground mt-2">
              Les demandes de rendez-vous apparaîtront ici lorsque les clients en feront la demande.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(appointment.date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {appointment.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{appointment.fullName}</div>
                    </TableCell>
                    <TableCell>{appointment.subject}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => showDetails(appointment)}>
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                            disabled={appointment.status === 'confirmed'}
                          >
                            Confirmer
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                            disabled={appointment.status === 'completed'}
                          >
                            Marquer comme terminé
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(appointment.id, 'canceled')}
                            disabled={appointment.status === 'canceled'}
                          >
                            Annuler
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleDelete(appointment)}
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialogue de détails du rendez-vous */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du rendez-vous</DialogTitle>
            <DialogDescription>
              Informations complètes sur le rendez-vous
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-[20px_1fr] items-start gap-2">
                <User className="h-5 w-5 text-prisma-purple mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-gray-500">Nom complet</p>
                  <p>{selectedAppointment.fullName}</p>
                </div>
              </div>
              <div className="grid grid-cols-[20px_1fr] items-start gap-2">
                <Phone className="h-5 w-5 text-prisma-purple mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-gray-500">Téléphone</p>
                  <p>{selectedAppointment.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-[20px_1fr] items-start gap-2">
                <CalendarIcon className="h-5 w-5 text-prisma-purple mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-gray-500">Date et heure</p>
                  <p>{formatDate(selectedAppointment.date)} à {selectedAppointment.time}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="font-semibold text-sm text-gray-500">Sujet</p>
                <p>{selectedAppointment.subject}</p>
              </div>
              {selectedAppointment.message && (
                <div>
                  <div className="grid grid-cols-[20px_1fr] items-start gap-2">
                    <MessageSquare className="h-5 w-5 text-prisma-purple mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-500">Message</p>
                      <p className="whitespace-pre-wrap">{selectedAppointment.message}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="border-t pt-4">
                <p className="font-semibold text-sm text-gray-500">Statut actuel</p>
                <div className="mt-1">{getStatusBadge(selectedAppointment.status)}</div>
              </div>
              
              <div className="border-t pt-4 flex flex-wrap gap-2 justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    handleUpdateStatus(selectedAppointment.id, 'confirmed');
                    setShowDetailsDialog(false);
                  }}
                  disabled={selectedAppointment.status === 'confirmed'}
                >
                  Confirmer
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    handleUpdateStatus(selectedAppointment.id, 'completed');
                    setShowDetailsDialog(false);
                  }}
                  disabled={selectedAppointment.status === 'completed'}
                >
                  Terminé
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    handleUpdateStatus(selectedAppointment.id, 'canceled');
                    setShowDetailsDialog(false);
                  }}
                  disabled={selectedAppointment.status === 'canceled'}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsPanel;
