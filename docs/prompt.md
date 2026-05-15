# Etapa 2: Prompt Maestro Estructural para Agente de Diseño IA (Versión Detallada)

## 1. Estrategia de Generación
En lugar de pedirle a la IA que adivine todo el sitio de golpe, estructuraremos los prompts mediante una arquitectura basada en componentes. Esto nos garantiza un diseño UI/UX de ultra-alta fidelidad, con una cuadrícula (grid) impecable de 12 columnas y consistencia visual en cada bloque.

---

## 2. El Prompt Global (Base de Estilo)
*Este prompt establece la dirección de arte general y debe acompañar a las variaciones de las secciones.*

> **Base Prompt:** "Award-winning UI/UX web design for 'Weddings Monkey Trip', a luxury Destination Wedding agency. Tropical Luxury aesthetic, high-end boutique vibe, Vogue Weddings editorial style. Pearl White background (#FFFFFF) with Deep Turquoise Ocean (#00A4A6) and soft Sunset Coral (#FF7F50) accents. Typography: High-contrast elegant Serif for headings, clean geometric sans-serif for body text. 8k resolution, ultra-detailed, hyper-realistic UI, clean layout, generous negative space, Behance and Awwwards winner style, 2026 web trends."

---

## 3. Prompts Modulares por Sección

### A. Hero Section (El Gancho Emocional)
> **Prompt:** "[INSERTAR BASE PROMPT] + Focus on the Hero Section. Full-width cinematic background photo of an elegant sunset beach wedding in the Mexican Caribbean. Foreground: A sleek, minimalist top navigation bar with a frosted glassmorphism effect. Central typography: A massive, elegant serif headline reading 'Begin Your Journey'. Below it, a primary Call-to-Action (CTA) button in Sand Gold (#D4AF37) with subtle metallic inner glow and 8px rounded corners. Crisp, professional web design layout --ar 16:9 --v 6.0 --style raw"

### B. Destinos & Servicios (Bento Box Layout)
> **Prompt:** "[INSERTAR BASE PROMPT] + Focus on the Services Section. Use a modern 'Bento Box' asymmetrical grid layout. Display 4 high-end destination cards (Riviera Maya, Tulum, Los Cabos, Costa Rica). Each card features a stunning tropical image, soft drop shadows (15% opacity, y-axis blur), 12px border radius, and a subtle gradient overlay at the bottom for text legibility. Crisp, structured UI components, highly organized, web design --ar 16:9 --v 6.0"

### C. The Monkey Experience (Social Proof & Trust)
> **Prompt:** "[INSERTAR BASE PROMPT] + Focus on the About Us and Social Proof section. A split-screen layout. Left side: An aesthetic collage of happy couples, champagne clinking, and tropical flora. Right side: Minimalist text blocks with high typographic hierarchy, featuring a stylish testimonial slider. Include subtle UI micro-interaction cues like active dots and custom arrows. Clean interface, luxurious feel --ar 16:9 --v 6.0"

---

## 4. Prompts Negativos (Lo que la IA DEBE evitar)
Para asegurar que la interfaz sea usable y no un simple póster de arte abstracto, es obligatorio incluir estos parámetros excluyentes:

> **Negative Prompt:** "--no messy UI, cluttered layout, heavy drop shadows, cartoonish elements, saturated neon colors, generic stock photos, deformed buttons, illegible text, crowded space, 3d render icons, cheap gradients, out of frame."

---

## 5. Especificaciones de Diseño UI (Para el Agente)
* **Grid System:** 12-column CSS Grid.
* **Elevaciones (Sombras):** Estilo "Soft UI". Sombras amplias y muy difuminadas (`box-shadow: 0 20px 40px rgba(0,0,0,0.05);`) para dar sensación de levitación en las tarjetas.
* **Botones (Estados):** Diseño primario con padding amplio (ej. 16px 32px), texto en mayúsculas espaciado (letter-spacing: 2px) para dar ese toque "Premium".
* **Formas Orgánicas:** Uso de vectores sutiles en el fondo que asemejen hojas de palma o el movimiento del agua, pero con una opacidad máxima del 3% para no interferir con la legibilidad.