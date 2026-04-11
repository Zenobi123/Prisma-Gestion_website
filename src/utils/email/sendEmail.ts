
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY as string;
const FROM_EMAIL = 'noreply@nobiangtime.com';
const TO_EMAIL = 'obiangtimenathan@gmail.com';

const SERVICE_LABELS: Record<string, string> = {
  comptabilite: 'Comptabilité',
  finance: 'Finance',
  fiscalite: 'Fiscalité',
  'ressources-humaines': 'Ressources Humaines',
  'genie-logiciel': 'Génie Logiciel',
  'intelligence-artificielle': 'Intelligence Artificielle',
};

async function callResend(payload: object): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn('VITE_RESEND_API_KEY non définie – email non envoyé.');
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? `Resend error ${response.status}`);
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
  const serviceLabel = SERVICE_LABELS[data.subject] ?? data.subject;
  const fullName = `${data.firstName} ${data.lastName}`;

  await callResend({
    from: `PRISMA GESTION <${FROM_EMAIL}>`,
    to: [TO_EMAIL],
    subject: `Nouveau message – ${serviceLabel} – ${fullName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#2E1A47">Nouveau message de contact</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 12px;font-weight:bold;width:140px">Nom</td><td style="padding:6px 12px">${fullName}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px">${data.email}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">WhatsApp</td><td style="padding:6px 12px">${data.whatsapp}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:bold">Service</td><td style="padding:6px 12px">${serviceLabel}</td></tr>
        </table>
        <h3 style="color:#2E1A47;margin-top:24px">Message</h3>
        <p style="background:#f9f9f9;padding:16px;border-left:4px solid #2E1A47;white-space:pre-line">${data.message}</p>
        <hr style="margin-top:32px;border:none;border-top:1px solid #e0e0e0">
        <p style="font-size:12px;color:#999">Envoyé depuis le formulaire de contact · PRISMA GESTION</p>
      </div>
    `,
  });
}

export async function sendQuoteEmail(data: {
  full_name: string;
  email: string;
  phone: string;
  service: string | null;
  details: string;
}): Promise<void> {
  const serviceLabel = data.service
    ? (SERVICE_LABELS[data.service] ?? data.service)
    : 'Non spécifié';

  await callResend({
    from: `PRISMA GESTION <${FROM_EMAIL}>`,
    to: [TO_EMAIL],
    subject: `Demande de devis – ${serviceLabel} – ${data.full_name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#2E1A47">Nouvelle demande de devis</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 12px;font-weight:bold;width:140px">Nom</td><td style="padding:6px 12px">${data.full_name}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px">${data.email}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Téléphone</td><td style="padding:6px 12px">${data.phone}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:bold">Service</td><td style="padding:6px 12px">${serviceLabel}</td></tr>
        </table>
        <h3 style="color:#2E1A47;margin-top:24px">Détails du projet</h3>
        <p style="background:#f9f9f9;padding:16px;border-left:4px solid #D6DD00;white-space:pre-line">${data.details}</p>
        <hr style="margin-top:32px;border:none;border-top:1px solid #e0e0e0">
        <p style="font-size:12px;color:#999">Envoyé depuis le formulaire de devis · PRISMA GESTION</p>
      </div>
    `,
  });
}
