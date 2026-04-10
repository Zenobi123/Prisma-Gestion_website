
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Mail, Phone, Check } from "lucide-react";

type AppointmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AppointmentDialog({ open, onOpenChange }: AppointmentDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const fullName = data.get("fullName") as string;
    const phone = data.get("phone") as string;
    const subject = data.get("subject") as string;
    const date = data.get("date") as string;
    const time = data.get("time") as string;
    const message = data.get("message") as string;

    if (!fullName || !phone || !subject || !date || !time) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Envoi à Supabase
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.from("appointments").insert({
        full_name: fullName,
        phone,
        subject,
        appointment_date: date,
        appointment_time: time,
        message,
        status: "pending",
      });

      if (error) {
        throw error;
      }

      setSent(true);
      toast({
        title: "Rendez-vous confirmé",
        description: "Votre demande de rendez-vous a bien été envoyée.",
      });

      // Pour rafraîchir le panneau admin
      window.dispatchEvent(new CustomEvent('appointmentsUpdated', {
        detail: { timestamp: new Date().getTime() }
      }));

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de la demande. Veuillez réessayer.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  function resetState() {
    setSent(false);
  }

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) setTimeout(resetState, 300); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prendre rendez-vous</DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour demander un rendez-vous. Nous vous contacterons sous peu.
          </DialogDescription>
        </DialogHeader>
        {!sent ? (
          <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nom complet</label>
              <input className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-prisma-purple" required type="text" id="fullName" name="fullName" placeholder="Votre nom" autoComplete="name"/>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-prisma-purple">
                  <Phone className="w-4 h-4" />
                </span>
                <input className="pl-8 mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-prisma-purple" required type="tel" id="phone" name="phone" placeholder="06 12 34 56 78" autoComplete="tel" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Objet du rendez-vous</label>
              <input className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-prisma-purple" required type="text" id="subject" name="subject" placeholder="Objet" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-prisma-purple">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input className="pl-8 mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-prisma-purple"
                    required type="date" id="date" name="date" />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Heure</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-prisma-purple">
                    <Clock className="w-4 h-4" />
                  </span>
                  <input className="pl-8 mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-prisma-purple"
                    required type="time" id="time" name="time"/>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (optionnel)</label>
              <textarea className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-prisma-purple" id="message" name="message" placeholder="Précisez votre demande" rows={3}/>
            </div>
            <div className="flex justify-end space-x-2">
              <DialogClose asChild>
                <button type="button" className="btn-primary px-4 py-2 rounded">Annuler</button>
              </DialogClose>
              <button type="submit" className="btn-primary bg-prisma-purple text-white px-4 py-2 rounded hover:bg-prisma-purple/90 transition-colors flex items-center" disabled={loading}>
                {loading ? (
                  <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                ) : null}
                Envoyer la demande
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center space-y-3 py-4">
            <Check className="text-green-500 w-12 h-12 mb-2" />
            <p className="font-semibold text-lg">Demande envoyée !</p>
            <p className="text-muted-foreground text-sm text-center">Merci pour votre demande.<br />Nous reviendrons vers vous rapidement.</p>
            <DialogClose asChild>
              <button className="btn-primary px-4 py-2 rounded mt-2">Fermer</button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
