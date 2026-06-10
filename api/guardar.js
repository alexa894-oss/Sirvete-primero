// Vercel Serverless Function
// El token de Airtable vive aquí como variable de entorno — nunca en el cliente

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS para que la app pueda llamarla
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { nombre, email, amo, emocion, carencia, accion } = req.body;

  const token  = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID || 'appQ3XPC0Q522qbeq';
  const tabla  = 'Respuestas';

  if (!token) {
    return res.status(500).json({ error: 'AIRTABLE_TOKEN no configurado en Vercel' });
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tabla)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            Nombre:   nombre   || '',
            Email:    email    || '',
            Amo:      amo      || '',
            Emocion:  emocion  || '',
            Carencia: carencia || '',
            Accion:   accion   || '',
            Fecha:    new Date().toISOString(),
          }
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Airtable error:', data);
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ ok: true, id: data.id });

  } catch (err) {
    console.error('Error guardando en Airtable:', err);
    return res.status(500).json({ error: err.message });
  }
}
