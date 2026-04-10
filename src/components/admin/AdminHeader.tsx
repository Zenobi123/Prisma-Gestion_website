
import { useState, useEffect } from "react";
import { Bell, Calendar, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getContactMessages } from "@/utils/contact/supabase";
import { getAppointments } from "@/utils/appointment/crud";
import { getQuoteRequests } from "@/utils/quotes/getQuoteRequests";

type AdminHeaderProps = {
  onLogout: () => void;
};

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  const [unreadContactCount, setUnreadContactCount] = useState(0);
  const [pendingAppointmentCount, setPendingAppointmentCount] = useState(0);
  const [unreadQuotesCount, setUnreadQuotesCount] = useState(0);
  
  // Fonction pour charger les notifications
  const loadNotificationCounts = async () => {
    try {
      // Charger les messages de contact non lus
      const messages = await getContactMessages();
      setUnreadContactCount(messages.filter(message => !message.read).length);
      
      // Charger les rendez-vous en attente
      const appointments = await getAppointments();
      setPendingAppointmentCount(appointments.filter(
        appointment => appointment.status === 'pending'
      ).length);
      
      // Charger les devis non lus
      const quotes = await getQuoteRequests();
      setUnreadQuotesCount(quotes.filter(quote => !quote.read).length);
      
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
    }
  };
  
  useEffect(() => {
    // Charger les notifications au premier rendu
    loadNotificationCounts();
    
    // Mettre en place un écouteur pour les mises à jour de notifications
    const handleNotificationsUpdated = (e: CustomEvent) => {
      if (e.detail) {
        setUnreadContactCount(e.detail.unreadContactCount || 0);
        setPendingAppointmentCount(e.detail.pendingAppointmentCount || 0);
        setUnreadQuotesCount(e.detail.unreadQuotesCount || 0);
      }
    };
    
    window.addEventListener('notifications-updated', handleNotificationsUpdated as EventListener);
    
    // Configurer un intervalle pour rafraîchir le compteur
    const intervalId = setInterval(loadNotificationCounts, 60000); // Mise à jour toutes les 60 secondes
    
    return () => {
      window.removeEventListener('notifications-updated', handleNotificationsUpdated as EventListener);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm h-16 px-6">
      <div className="flex justify-between items-center h-full">
        <h1 className="text-xl font-semibold text-[#2E1A47]">
          Administration PRISMA GESTION
        </h1>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Calendar size={18} />
                {pendingAppointmentCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D6DD00] text-xs text-[#2E1A47] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {pendingAppointmentCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Rendez-vous en attente</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {pendingAppointmentCount > 0 ? (
                <DropdownMenuItem 
                  onClick={() => {
                    // Naviguer vers la section des rendez-vous
                    document.dispatchEvent(new CustomEvent('admin-navigate', { 
                      detail: 'messages' 
                    }));
                    // Après un court délai, changer l'onglet actif
                    setTimeout(() => {
                      document.dispatchEvent(new CustomEvent('message-tab-navigate', { 
                        detail: 'appointments' 
                      }));
                    }, 100);
                  }}
                >
                  Voir les {pendingAppointmentCount} rendez-vous en attente
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>Aucun rendez-vous en attente</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Bell size={18} />
                {unreadContactCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadContactCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Messages non lus</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {unreadContactCount > 0 ? (
                <DropdownMenuItem 
                  onClick={() => {
                    // Naviguer vers la section des messages
                    document.dispatchEvent(new CustomEvent('admin-navigate', { 
                      detail: 'messages' 
                    }));
                    // Après un court délai, changer l'onglet actif (si pas déjà sur contacts)
                    setTimeout(() => {
                      document.dispatchEvent(new CustomEvent('message-tab-navigate', { 
                        detail: 'contacts' 
                      }));
                    }, 100);
                  }}
                >
                  Voir les {unreadContactCount} messages non lus
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>Aucun message non lu</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <FileText size={18} />
                {unreadQuotesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D6DD00] text-xs text-[#2E1A47] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadQuotesCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Devis non lus</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {unreadQuotesCount > 0 ? (
                <DropdownMenuItem 
                  onClick={() => {
                    // Naviguer vers la section des devis
                    document.dispatchEvent(new CustomEvent('admin-navigate', { 
                      detail: 'messages' 
                    }));
                    // Après un court délai, changer l'onglet actif
                    setTimeout(() => {
                      document.dispatchEvent(new CustomEvent('message-tab-navigate', { 
                        detail: 'quotes' 
                      }));
                    }, 100);
                  }}
                >
                  Voir les {unreadQuotesCount} devis non lus
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>Aucun devis non lu</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <div className="w-8 h-8 bg-[#2E1A47] rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profil</DropdownMenuItem>
              <DropdownMenuItem>Paramètres</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
