
export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export type ContactFormData = Omit<ContactMessage, "id" | "date" | "read">;

