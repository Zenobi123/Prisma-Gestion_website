
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

async function callSendEmail(type: string, data: object): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase non configuré – email non envoyé.');
    return;
  }

  const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ type, data }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Erreur ${response.status}`);
  }
}

export async function sendContactEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  subject: string;
  message: string;
}): Promise<void> {
  await callSendEmail('contact', data);
}

export async function sendQuoteEmail(data: {
  full_name: string;
  email: string;
  phone: string;
  service: string | null;
  details: string;
}): Promise<void> {
  await callSendEmail('quote', data);
}

export async function sendAppointmentEmail(data: {
  fullName: string;
  phone: string;
  subject: string;
  date: string;
  time: string;
  message: string;
}): Promise<void> {
  await callSendEmail('appointment', data);
}
