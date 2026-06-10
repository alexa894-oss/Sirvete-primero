# Sírvete Primero — Alexa González

App mobile-first de autoconocimiento en 4 pasos. Una sola página HTML, sin build steps, deployable directamente en Vercel.

---

## Deploy en Vercel (5 minutos)

1. Ve a [vercel.com](https://vercel.com) → New Project
2. Importa la carpeta `sirvete-primero` (o sube el `index.html` directamente)
3. Vercel detecta que es un sitio estático → click **Deploy**
4. ¡Listo! Tienes una URL pública.

---

## Activar envío de correos (EmailJS)

1. Crea cuenta gratuita en [emailjs.com](https://emailjs.com)
2. Ve a **Email Services** → conecta tu cuenta de Gmail/Outlook
3. Ve a **Email Templates** → crea un template con estas variables:

```
Asunto: Tu diagnóstico — Sírvete Primero · Alexa González

Hola {{to_name}},

Aquí está tu diagnóstico de La Mesa de los Amos:

🔴 Tu amo más molesto: {{amo}}
💛 La emoción que lo activa: {{emocion}}
🌱 El hambre detrás: {{carencia}}
✅ Tu acción esta semana: {{accion}}

---
TUS TRES EJERCICIOS:

1. {{ejercicio_1}}
2. {{ejercicio_2}}
3. {{ejercicio_3}}

---
"La acción no es decirle que no al amo. La acción es decirte que sí a ti."

Alexa González — Sírvete Primero
```

4. Copia tu **Public Key** (Account → API Keys)
5. En `index.html`, busca `EMAILJS_CONFIG` y reemplaza:

```js
const EMAILJS_CONFIG = {
  publicKey:  'tu_public_key',   // ← aquí
  serviceId:  'tu_service_id',   // ← aquí
  templateId: 'tu_template_id',  // ← aquí
};
```

---

## Guardar respuestas en Supabase (opcional)

Para que Alexa pueda ver qué amos son más comunes:

1. Crea proyecto en [supabase.com](https://supabase.com)
2. En el SQL Editor, crea la tabla:

```sql
create table respuestas (
  id uuid default gen_random_uuid() primary key,
  nombre text,
  email text,
  amo text,
  emocion text,
  carencia text,
  accion text,
  fecha timestamptz default now()
);

-- Permitir inserts anónimos
alter table respuestas enable row level security;
create policy "Allow inserts" on respuestas for insert with check (true);
```

3. Copia la **URL** y la **anon key** del proyecto (Settings → API)
4. En `index.html`, busca `SUPABASE_CONFIG` y reemplaza:

```js
const SUPABASE_CONFIG = {
  url:    'https://xxxx.supabase.co',
  apikey: 'tu_anon_key',
};
```

---

## Personalización

Todo el contenido está en el bloque de datos al inicio del `<script>`:

- **`AMOS`** — los 5 amos y sus descripciones
- **`EMOCIONES`** — las 6 emociones
- **`CARENCIAS`** — las 6 carencias
- **`ACCIONES`** — las 6 acciones
- **`EJERCICIOS_POR_AMO`** — los 3 ejercicios por cada amo

Para cambiar colores, busca `#534AB7` (púrpura brand) en el archivo.
