# KWGTHub – Refactor Técnico

**Versión:** 1.1 | **Estado:** Listo para producción | **Deploy:** GitHub Pages + Vercel

---

## 🎯 Cambios Principales

### 1. **Tipografía: Orelo + Evoque**

- **Orelo** (Google Fonts): Headings (`h1-h6`, títulos)
  - Geométrica, moderna, 700 weight máximo
  - Excelente para branding minimalista
- **Evoque** (Google Fonts): Body text
  - Editorial pero accesible
  - Pesos: 400 (normal), 500 (semi-bold), 700 (bold)
- **Sistema de escala:** Variables CSS (`--text-xs`, `--text-sm`, etc.)

### 2. **Sistema de Variables CSS Completo**

Todas las variables definidas en `:root`:

- **Light mode** (default): Colores claros, glassmorphism sutil
- **Dark mode** (`body.dark`): Colores oscuros, glassmorphism pronunciado
- **Transiciones:** Smooth 0.3s en cambio de tema

**Variables principales:**

```css
--bg-color           /* Fondo principal */
--text-color         /* Texto */
--primary-color      /* Azul (#3b82f6) */
--card-bg            /* Fondo de cards */
--glass-bg           /* Glassmorphism base */
--input-bg/border    /* Inputs */
--chip-bg/color      /* Filtros activos */
--widget-preview-bg  /* Fondo de preview del widget */
```

### 3. **Accesibilidad (A11y) Mejorada**

#### HTML Semántico

- `<button>` en lugar de `<div>` para filtros y sidebar items
- `<article>` para widget cards
- `<section>` para agrupar contenido
- `<nav>`, `<aside>`, `<main>` para estructura

#### ARIA Attributes

```html
<!-- Filtros como tabs accesibles -->
<button role="tab" aria-selected="true" aria-controls="widget-grid">
  <!-- Sidebar items con aria-pressed -->
  <button aria-pressed="false">
    <!-- Dark toggle con aria-pressed -->
    <button aria-pressed="true">
      <!-- Grid con region label -->
      <div role="region" aria-label="Grid de widgets"></div>
    </button>
  </button>
</button>
```

#### Keyboard Navigation

- **Tab:** Navega entre elementos interactivos
- **Enter/Space:** Activa botones
- **Arrows:** Navega entre filtros en el hero
- **Focus outline:** 2px solid con color primario

#### Screen Reader Support

- `.sr-only` para hints de búsqueda
- `aria-label` en botones sin texto visible
- `aria-describedby` en inputs
- `aria-hidden` en iconos decorativos

### 4. **JavaScript Refactorizado**

#### Arquitectura Modular

```javascript
// State Management
class AppState {
  setCategory(category)
  setSearchQuery(query)
  getFiltered()  // Lógica de filtrado centralizada
}

// Render Logic
renderWidgets(list)
updateView()

// Event Handlers
handleCardClick()
handleCardKeydown()
syncSidebar()
syncChips()
```

#### Cambios Clave

- ✅ **Sin repetición:** `syncSidebar()` + `syncChips()` en un solo lugar
- ✅ **Escape HTML:** `escapeHtml()` previene XSS
- ✅ **Listeners optimizados:** Attached después de render
- ✅ **DOMContentLoaded:** Espera a que el DOM esté listo
- ✅ **Keyboard support:** Filtros navegables con arrow keys

#### Antes vs Después

```javascript
// ANTES: Repetición innecesaria
filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    activeCategory = chip.dataset.category;
    syncSidebar(activeCategory);
    filterWidgets();
  });
});

sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    sidebarItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    activeCategory = item.dataset.category;
    syncChips(activeCategory);
    filterWidgets();
  });
});

// DESPUÉS: DRY + Centralizado
filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    setActiveTab("filter-chip", chip);
    appState.setCategory(chip.dataset.category);
    syncSidebar(chip.dataset.category);
    updateView();
  });
});
```

### 5. **Diseño & Animaciones**

#### Cambios Visuales

- **Blur effects:** Reducidos para mejor rendimiento (10px → blur)
- **Sombras:** Card shadow más realista (8px → 12px de spread)
- **Border radius:** Consistente (12px en cards, 8px en inputs)
- **Transiciones:** Curvas cubic-bezier optimizadas para UX
- **Gradientes:** Blobs con animaciones fluidas pero no distractoras

#### Responsive

- **Desktop (1024+):** Sidebar 230px, grid 4-5 columnas
- **Tablet (768-1024):** Sidebar 200px, grid 3-4 columnas
- **Mobile (480-768):** Sidebar inline, grid 2-3 columnas
- **Small (< 480px):** Stack completo, grid 1-2 columnas

### 6. **Performance**

#### Optimizaciones

- ✅ **Preconnect fonts:** `<link rel="preconnect">` en `<head>`
- ✅ **Font display:** `display=swap` (Google Fonts)
- ✅ **CSS variables:** Reducen repetición
- ✅ **Stagger animations:** No bloquean main thread
- ✅ **Lazy listeners:** Attached solo cuando necesario
- ✅ **No duplicados:** Sincronización eficiente

#### Lighthouse Score Esperado

- Performance: 85+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 100

---

## 📁 Estructura de Archivos

```
kwgt-hub/
├── index.html          # HTML refactorizado con a11y
├── styles.css          # CSS modular, variables, responsive
├── app.js              # JS modular, state management
├── README.md           # Este archivo
└── [assets/]           # (Opcional) Imágenes, logos, etc.
```

---

## 🚀 Deploy

### Opción 1: GitHub Pages (Free, Static)

```bash
# 1. Crear repo en GitHub
git init
git add .
git commit -m "Initial commit: KWGTHub v1.1"
git branch -M main
git remote add origin https://github.com/tu-usuario/kwgt-hub.git
git push -u origin main

# 2. Settings > Pages > Source: main branch > Save
# Tu sitio está en: https://tu-usuario.github.io/kwgt-hub
```

### Opción 2: Vercel (Recomendado para KWGTHub)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
vercel
# Selecciona project settings cuando pregunte

# 3. Sitio en: https://kwgt-hub.vercel.app (o tu dominio)
```

### Opción 3: Cloudflare Pages

```bash
# 1. Push a GitHub (vía opción 1)
# 2. Conectar repo en https://pages.cloudflare.com
# 3. Build settings: Leave blank (es HTML/CSS/JS puro)
# Sitio en: https://kwgt-hub.pages.dev
```

### Environment Setup para Supabase (Cuando integres backend)

```javascript
// app.js - Ready for Supabase auth
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Pero actualmente no se requiere, todo es client-side
```

---

## 🔒 Seguridad

- ✅ **XSS Prevention:** `escapeHtml()` en datos dinámicos
- ✅ **No inline scripts:** Todo en `app.js`
- ✅ **CSP Ready:** Puedes agregar headers en Vercel
- ✅ **No sensitive data:** Todo es público

```html
<!-- Si quieres CSP headers en Vercel -->
<!-- Crear vercel.json -->
```

### `vercel.json` (Seguridad)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 📝 Testing

### Manual Testing Checklist

- [ ] Dark mode toggle funciona (persiste en localStorage)
- [ ] Búsqueda case-insensitive (mayúsculas/minúsculas)
- [ ] Filtros por categoría se syncan (sidebar ↔ chips)
- [ ] Cards clickeables (animación push)
- [ ] Keyboard nav: Tab → Enter/Space
- [ ] Responsive en mobile (sidebar → inline)
- [ ] Fuentes cargadas (Orelo + Evoque visibles)
- [ ] Empty state aparece si no hay resultados

### Axe DevTools (A11y)

```bash
# Chrome: Instala Axe DevTools
# Corre accessibility scan
# Esperado: 0 issues críticos
```

---

## 🔄 Próximos Pasos (Roadmap)

### Fase 2: Backend

- [ ] Integrar Supabase (widgets en DB)
- [ ] Upload de widgets (creator dashboard)
- [ ] Auth (GitHub OAuth)
- [ ] Comments + ratings

### Fase 3: Features Avanzadas

- [ ] Infinite scroll
- [ ] Search con fuzzy matching (Fuse.js)
- [ ] Creator profiles
- [ ] Analytics (trending widgets)
- [ ] Export como JSON (para Obsidian sync)

### Fase 4: Deployment

- [ ] Cloudflare R2 (almacenamiento de .kwgt files)
- [ ] GitHub Actions CI/CD
- [ ] Performance monitoring (Sentry)
- [ ] Email newsletter (Resend)

---

## 🐛 Known Issues

(Ninguno actualmente. Reporta issues en GitHub.)

---

## 📄 Licencia

MIT – Úsalo libremente en KWGTHub.

---

## 👨‍💻 Tech Stack

| Layer          | Tech                | Reasoning                                 |
| -------------- | ------------------- | ----------------------------------------- |
| **Typography** | Orelo + Evoque      | Modern, distinctive, legible              |
| **Styling**    | CSS3 (no framework) | Lightweight, full control, learn by doing |
| **JS**         | Vanilla ES6         | No dependencies, fast                     |
| **A11y**       | WCAG 2.1 AA         | Inclusive for all users                   |
| **Hosting**    | Vercel/GitHub Pages | Free, fast, Vercel → easy backend later   |

---

**v1.1 – Refactored by Claude | July 2026**
