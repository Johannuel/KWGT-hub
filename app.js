// ================================
// DATOS DE WIDGETS
// ================================
const widgets = [
  {
    id: 1,
    title: "Aether Clock",
    creator: "@darkUI",
    category: "reloj",
    downloads: "1.2k",
    likes: 340,
    tag: "Reloj",
    previewClass: "preview-clock",
  },
  {
    id: 2,
    title: "Vital Stats",
    creator: "@neoncraft",
    category: "salud",
    downloads: "890",
    likes: 210,
    tag: "Salud",
    previewClass: "preview-health",
  },
  {
    id: 3,
    title: "WeatherMin",
    creator: "@tucanito",
    category: "clima",
    downloads: "760",
    likes: 188,
    tag: "Clima",
    previewClass: "preview-weather",
  },
  {
    id: 4,
    title: "NowPlaying v2",
    creator: "@kwgtlabs",
    category: "musica",
    downloads: "2.1k",
    likes: 510,
    tag: "Música",
    previewClass: "preview-music",
  },
  {
    id: 5,
    title: "Minimal Date",
    creator: "@darkUI",
    category: "calendario",
    downloads: "640",
    likes: 150,
    tag: "Calendario",
    previewClass: "preview-clock",
  },
  {
    id: 6,
    title: "BatteryRing",
    creator: "@neoncraft",
    category: "bateria",
    downloads: "430",
    likes: 99,
    tag: "Batería",
    previewClass: "preview-health",
  },
  {
    id: 7,
    title: "SunSet Weather",
    creator: "@kwgtlabs",
    category: "clima",
    downloads: "510",
    likes: 130,
    tag: "Clima",
    previewClass: "preview-weather",
  },
  {
    id: 8,
    title: "LoFi Player",
    creator: "@tucanito",
    category: "musica",
    downloads: "980",
    likes: 275,
    tag: "Música",
    previewClass: "preview-music",
  },
];

// ================================
// PREVIEW HTML POR TIPO
// ================================
const previews = {
  "preview-clock": `
    <div class="phone-frame phone-dark-blue">
      <div class="widget-time">09:41</div>
      <div class="widget-date">Lunes, 7 jul</div>
      <div class="widget-bar"></div>
    </div>`,
  "preview-health": `
    <div class="phone-frame phone-dark">
      <div class="circle-widget">
        <div class="circle-ring">72%</div>
      </div>
      <div class="phone-label">Batería</div>
      <div class="phone-label small">Pasos: 6,240</div>
    </div>`,
  "preview-weather": `
    <div class="phone-frame phone-warm">
      <div class="weather-icon">☀️</div>
      <div class="weather-temp">24°</div>
      <div class="weather-desc">Santo Domingo · Despejado</div>
    </div>`,
  "preview-music": `
    <div class="phone-frame phone-black">
      <div class="music-song">Blinding Lights</div>
      <div class="music-artist">The Weeknd</div>
      <div class="music-progress">
        <div class="music-progress-fill"></div>
      </div>
      <div class="music-controls">
        <span>⏮</span>
        <span class="music-play">⏸</span>
        <span>⏭</span>
      </div>
    </div>`,
};

// ================================
// STATE MANAGEMENT
// ================================
class AppState {
  constructor() {
    this.activeCategory = "todos";
    this.searchQuery = "";
  }

  setCategory(category) {
    this.activeCategory = category;
  }

  setSearchQuery(query) {
    this.searchQuery = query;
  }

  getFiltered() {
    let result = widgets;

    if (this.activeCategory !== "todos") {
      result = result.filter((w) => w.category === this.activeCategory);
    }

    if (this.searchQuery.trim() !== "") {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.creator.toLowerCase().includes(q) ||
          w.tag.toLowerCase().includes(q),
      );
    }

    return result;
  }
}

const appState = new AppState();

// ================================
// RENDER LOGIC
// ================================
function renderWidgets(list) {
  const grid = document.getElementById("widget-grid");

  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        No se encontraron widgets para "<strong>${appState.searchQuery}</strong>"
      </div>
    `;
    return;
  }

  grid.innerHTML = list
    .map(
      (w) => `
    <article class="widget-card" data-id="${w.id}" tabindex="0" role="button">
      <div class="widget-preview">
        ${previews[w.previewClass]}
      </div>
      <div class="widget-info">
        <h3 class="widget-title">${escapeHtml(w.title)}</h3>
        <div class="widget-meta">
          <span class="creator-name">${escapeHtml(w.creator)}</span>
          <div class="widget-stats">
            <span class="stat" title="${w.downloads} descargas">
              <i class="ti ti-download" aria-hidden="true"></i> ${w.downloads}
            </span>
            <span class="stat" title="${w.likes} likes">
              <i class="ti ti-heart" aria-hidden="true"></i> ${w.likes}
            </span>
          </div>
        </div>
        <span class="tag">${escapeHtml(w.tag)}</span>
      </div>
    </article>
  `,
    )
    .join("");

  attachCardListeners();
}

function attachCardListeners() {
  document.querySelectorAll(".widget-card").forEach((card) => {
    card.addEventListener("click", handleCardClick);
    card.addEventListener("keydown", handleCardKeydown);
  });
}

function handleCardClick(e) {
  const card = e.currentTarget;
  card.classList.add("card-clicked");
  setTimeout(() => card.classList.remove("card-clicked"), 300);
}

function handleCardKeydown(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handleCardClick(e);
  }
}

function updateView() {
  renderWidgets(appState.getFiltered());
}

// ================================
// UTILITY
// ================================
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// ================================
// EVENT HANDLERS
// ================================

// Search
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    appState.setSearchQuery(e.target.value);
    updateView();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      appState.setSearchQuery(searchInput.value);
      updateView();
    }
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    appState.setSearchQuery(searchInput.value);
    updateView();
  });
}

// Filter Chips (en el hero)
const filterChips = document.querySelectorAll(".filter-chip");

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const category = chip.dataset.category;
    setActiveTab("filter-chip", chip);
    appState.setCategory(category);
    syncSidebar(category);
    updateView();
  });

  // Keyboard navigation
  chip.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const siblings = Array.from(filterChips);
      const currentIndex = siblings.indexOf(chip);
      const direction = e.key === "ArrowRight" ? 1 : -1;
      const nextIndex =
        (currentIndex + direction + siblings.length) % siblings.length;
      siblings[nextIndex].focus();
      siblings[nextIndex].click();
    }
  });
});

// Sidebar Items (categorías)
const sidebarItems = document.querySelectorAll(".sidebar-item[data-category]");

sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    const category = item.dataset.category;
    setActiveTab("sidebar-item", item);
    appState.setCategory(category);
    syncChips(category);
    updateView();
  });

  item.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      item.click();
    }
  });
});

// Sync sidebar cuando se cambia desde chips
function syncSidebar(category) {
  sidebarItems.forEach((item) => {
    const isActive = item.dataset.category === category;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", isActive.toString());
  });
}

// Sync chips cuando se cambia desde sidebar
function syncChips(category) {
  filterChips.forEach((chip) => {
    const isActive = chip.dataset.category === category;
    chip.classList.toggle("active", isActive);
    chip.setAttribute("aria-selected", isActive.toString());
  });
}

// Helper para establecer tab activo
function setActiveTab(selector, activeElement) {
  document.querySelectorAll(selector).forEach((el) => {
    el.classList.remove("active");
  });
  activeElement.classList.add("active");
}

// ================================
// DARK MODE
// ================================
const darkToggle = document.getElementById("dark-toggle");
const icon = darkToggle?.querySelector("i");

if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");

    if (icon) {
      icon.className = isDark ? "ti ti-sun" : "ti ti-moon";
    }

    darkToggle.setAttribute("aria-pressed", isDark.toString());
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // Restore preference
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    if (icon) {
      icon.className = "ti ti-sun";
    }
    darkToggle.setAttribute("aria-pressed", "true");
  }
}

// ================================
// INITIALIZATION
// ================================
document.addEventListener("DOMContentLoaded", () => {
  updateView();

  // Log para debugging (remover en producción)
  console.log("KWGTHub loaded. Widgets:", widgets.length);
});
