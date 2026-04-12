const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = 'PRISMA GESTION <onboarding@resend.dev>'
const TO_EMAIL = 'obiangtimenathan@gmail.com'

const SERVICE_LABELS: Record<string, string> = {
  comptabilite: 'Comptabilité',
  finance: 'Finance',
  fiscalite: 'Fiscalité',
  'ressources-humaines': 'Ressources Humaines',
  'genie-logiciel': 'Génie Logiciel',
  'intelligence-artificielle': 'Intelligence Artificielle',
}

async function sendViaResend(subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY non configurée')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message ?? `Resend error ${response.status}`)
  }
}

function buildContactHtml(data: any): { subject: string; html: string } {
  const serviceLabel = SERVICE_LABELS[data.subject] ?? data.subject
  const fullName = `${data.firstName} ${data.lastName}`
  return {
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
      </div>`,
  }
}

function buildQuoteHtml(data: any): { subject: string; html: string } {
  const serviceLabel = data.service ? (SERVICE_LABELS[data.service] ?? data.service) : 'Non spécifié'
  return {
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
      </div>`,
  }
}

function buildAppointmentHtml(data: any): { subject: string; html: string } {
  return {
    subject: `Nouveau rendez-vous – ${data.subject} – ${data.fullName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#2E1A47">Nouvelle demande de rendez-vous</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 12px;font-weight:bold;width:140px">Nom</td><td style="padding:6px 12px">${data.fullName}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:bold">Téléphone</td><td style="padding:6px 12px">${data.phone}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Sujet</td><td style="padding:6px 12px">${data.subject}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:bold">Date</td><td style="padding:6px 12px">${data.date}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Heure</td><td style="padding:6px 12px">${data.time}</td></tr>
        </table>
        ${data.message ? `<h3 style="color:#2E1A47;margin-top:24px">Message</h3><p style="background:#f9f9f9;padding:16px;border-left:4px solid #2E1A47;white-space:pre-line">${data.message}</p>` : ''}
        <hr style="margin-top:32px;border:none;border-top:1px solid #e0e0e0">
        <p style="font-size:12px;color:#999">Envoyé depuis le formulaire de rendez-vous · PRISMA GESTION</p>
      </div>`,
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()

    let emailContent: { subject: string; html: string }

    switch (type) {
      case 'contact':
        emailContent = buildContactHtml(data)
        break
      case 'quote':
        emailContent = buildQuoteHtml(data)
        break
      case 'appointment':
        emailContent = buildAppointmentHtml(data)
        break
      default:
        return new Response(JSON.stringify({ error: 'Type de message inconnu' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

    await sendViaResend(emailContent.subject, emailContent.html)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Erreur envoi email:', error)
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
