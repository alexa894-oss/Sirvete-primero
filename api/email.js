// Vercel Serverless Function — Envío de email via Resend
// El API key vive como variable de entorno en Vercel

const EJERCICIOS_POR_AMO = {
  culpa: [
    'Esta semana, cada vez que sientas culpa por hacer algo para ti, escríbelo. Solo observa, sin juzgarte.',
    'Di que no a una sola cosa que normalmente aceptarías para no sentirte culpable.',
    'Cada noche anota una decisión que tomaste para ti ese día. Estás re-entrenando la relación contigo misma.',
  ],
  miedo: [
    'Identifica una cosa que has postergado por miedo. Escríbela y pregúntate: ¿cuánto me está costando no hacerlo?',
    'Haz esa cosa que llevas tiempo evitando. El miedo no desaparece esperando.',
    'Cuando sientas miedo antes de actuar, di en voz alta: me da miedo y lo voy a hacer de todas formas.',
  ],
  adiccion: [
    'Identifica el momento del día en que más recurres a tu amo. ¿Qué emoción lo precede? Escríbela.',
    'Reemplaza una vez esa conducta con algo que te nutra: un baño, una caminata, diez minutos de silencio.',
    'Cuéntale a alguien de confianza que estás trabajando en este patrón. La adicción vive en el secreto.',
  ],
  opinion: [
    'Antes de cada decisión esta semana pregúntate: ¿esto lo hago porque lo quiero yo, o por lo que van a pensar?',
    'Haz algo que llevas tiempo queriendo hacer y que no has hecho por lo que dirán. Algo pequeño cuenta.',
    'Reduce 15 minutos al día revisando likes o reacciones. Obsérvate sin juzgarte.',
  ],
  perfec: [
    'Lanza algo esta semana que no esté perfecto. Un mensaje, una publicación, una idea. Lanzarlo imperfecto es el ejercicio.',
    'Pon un tiempo límite a una tarea. Cuando se acabe el tiempo, la das por lista.',
    'Escribe tres cosas que hiciste bien esta semana aunque no hayan quedado perfectas. El progreso también cuenta.',
  ],
  custom: [
    'Esta semana observa cuándo aparece tu amo. Solo observa, sin juzgarte.',
    'Identifica qué emoción lo activa y escríbela cada vez que aparezca.',
    'Elige una acción pequeña y concreta que nutra la carencia real que hay detrás.',
  ],
};

function getEjercicios(amo) {
  const key = Object.keys(EJERCICIOS_POR_AMO).find(k =>
    amo && amo.toLowerCase().includes(k)
  ) || 'custom';
  return EJERCICIOS_POR_AMO[key];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { nombre, email, amo, emocion, carencia, accion } = req.body;
  const apiKey = process.env.RESEND_API_KEY || process.env.Resend_Api_Key;

  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY no configurado en Vercel' });
  }

  const ejercicios = getEjercicios(amo);

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#070D1A;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070D1A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#0C1628;border-radius:16px;border:1px solid #1A2E4A;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 32px;text-align:center;border-bottom:1px solid #1A2E4A;">
              <p style="margin:0 0 4px;font-size:24px;font-weight:700;color:#C9A055;font-style:italic;letter-spacing:-0.5px;">AG</p>
              <p style="margin:0 0 8px;font-size:10px;font-weight:400;letter-spacing:0.25em;color:#C9A055;text-transform:uppercase;font-family:'Arial',sans-serif;">Alexa González</p>
              <h1 style="margin:0;font-size:28px;font-weight:600;color:#F5F0E8;line-height:1.2;font-family:'Georgia',serif;">Sírvete Primero</h1>
            </td>
          </tr>

          <!-- Saludo -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0 0 6px;font-size:10px;font-weight:500;letter-spacing:0.2em;color:#C9A055;text-transform:uppercase;font-family:'Arial',sans-serif;">Tu diagnóstico</p>
              <h2 style="margin:0 0 24px;font-size:28px;font-weight:600;color:#F5F0E8;font-family:'Georgia',serif;">${nombre}</h2>
            </td>
          </tr>

          <!-- Cards diagnóstico -->
          <tr>
            <td style="padding:0 40px;">

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td style="background:#112040;border:1px solid #1A2E4A;border-radius:10px;padding:14px 16px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:500;letter-spacing:0.14em;color:#C9A055;text-transform:uppercase;font-family:'Arial',sans-serif;">Tu amo más molesto</p>
                    <p style="margin:0;font-size:18px;font-weight:600;color:#E8D5A3;font-family:'Georgia',serif;">${amo}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td style="background:#112040;border:1px solid #1A2E4A;border-radius:10px;padding:14px 16px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:500;letter-spacing:0.14em;color:#C9A055;text-transform:uppercase;font-family:'Arial',sans-serif;">La emoción que lo activa</p>
                    <p style="margin:0;font-size:18px;font-weight:600;color:#E8D5A3;font-family:'Georgia',serif;">${emocion}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td style="background:#112040;border:1px solid #1A2E4A;border-radius:10px;padding:14px 16px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:500;letter-spacing:0.14em;color:#C9A055;text-transform:uppercase;font-family:'Arial',sans-serif;">El hambre detrás</p>
                    <p style="margin:0;font-size:18px;font-weight:600;color:#E8D5A3;font-family:'Georgia',serif;">${carencia}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#112040;border:1px solid #1A2E4A;border-radius:10px;padding:14px 16px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:500;letter-spacing:0.14em;color:#C9A055;text-transform:uppercase;font-family:'Arial',sans-serif;">Tu acción esta semana</p>
                    <p style="margin:0;font-size:18px;font-weight:600;color:#E8D5A3;font-family:'Georgia',serif;">${accion}</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Ejercicios -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#F5F0E8;font-family:'Georgia',serif;">Tres ejercicios para sostener tu proceso</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                <tr>
                  <td width="32" valign="top">
                    <div style="width:28px;height:28px;background:#C9A05515;border:1px solid #C9A05530;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:500;color:#C9A055;font-family:'Arial',sans-serif;">1</div>
                  </td>
                  <td style="padding-left:12px;">
                    <p style="margin:0;font-size:14px;color:#8A8070;line-height:1.6;font-family:'Arial',sans-serif;">${ejercicios[0]}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                <tr>
                  <td width="32" valign="top">
                    <div style="width:28px;height:28px;background:#C9A05515;border:1px solid #C9A05530;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:500;color:#C9A055;font-family:'Arial',sans-serif;">2</div>
                  </td>
                  <td style="padding-left:12px;">
                    <p style="margin:0;font-size:14px;color:#8A8070;line-height:1.6;font-family:'Arial',sans-serif;">${ejercicios[1]}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="32" valign="top">
                    <div style="width:28px;height:28px;background:#C9A05515;border:1px solid #C9A05530;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:500;color:#C9A055;font-family:'Arial',sans-serif;">3</div>
                  </td>
                  <td style="padding-left:12px;">
                    <p style="margin:0;font-size:14px;color:#8A8070;line-height:1.6;font-family:'Arial',sans-serif;">${ejercicios[2]}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Frase de cierre -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#070D1A;border:1px solid #C9A05530;border-radius:12px;padding:24px;text-align:center;">
                    <p style="margin:0 0 12px;font-size:16px;font-weight:500;color:#F5F0E8;line-height:1.65;font-style:italic;font-family:'Georgia',serif;">"La acción no es decirle que no al amo.<br/>La acción es decirte que sí a ti."</p>
                    <p style="margin:0;font-size:12px;color:#C9A055;letter-spacing:0.1em;font-family:'Arial',sans-serif;">— Alexa González</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1A2E4A;text-align:center;">
              <p style="margin:0;font-size:12px;color:#3A4A5A;font-family:'Arial',sans-serif;">Alexa González · Sírvete Primero</p>
              <p style="margin:4px 0 0;font-size:12px;color:#3A4A5A;font-family:'Arial',sans-serif;">alexagonzalez.co</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Alexa González <info@alexagonzalez.co>',
        to:   [email],
        subject: `Tu diagnóstico — Sírvete Primero · Alexa González`,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ ok: true, id: data.id });

  } catch (err) {
    console.error('Error enviando email:', err);
    return res.status(500).json({ error: err.message });
  }
}
