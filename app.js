// DATOS DE WIDGETS (simulados)
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

// ESTADO DE LA APP
let activeCategory = "todos";
let searchQuery = "";

// PREVIEWS HTML POR TIPO
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

// RENDERIZAR targetas
function renderWidgets(list) {
  const grid = document.getElementById("widget-grid");

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty-state">No se encontraron widgets para "<strong>${searchQuery}</strong>"</div>`;
    return;
  }

  grid.innerHTML = list
    .map(
      (w) => `
    <div class="widget-card" data-id="${w.id}">
      <div class="widget-preview">
        ${previews[w.previewClass]}
      </div>
      <div class="widget-info">
        <div class="widget-title">${w.title}</div>
        <div class="widget-meta">
          <span class="creator-name">${w.creator}</span>
          <div class="widget-stats">
            <span class="stat"><i class="ti ti-download"></i> ${w.downloads}</span>
            <span class="stat"><i class="ti ti-heart"></i> ${w.likes}</span>
          </div>
        </div>
        <span class="tag">${w.tag}</span>
      </div>
    </div>
  `,
    )
    .join("");
}

function filterWidgets() {
  let result = widgets;

  if (activeCategory !== "todos") {
    result = result.filter((w) => w.category === activeCategory);
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.creator.toLowerCase().includes(q) ||
        w.tag.toLowerCase().includes(q),
    );
  }

  renderWidgets(result);
}

// BÚSQUEDA

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  filterWidgets();
});

searchBtn.addEventListener("click", () => {
  searchQuery = searchInput.value;
  filterWidgets();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchQuery = searchInput.value;
    filterWidgets();
  }
});

// Filtros chips en el hero

const filterChips = document.querySelectorAll(".filter-chip");

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    activeCategory = chip.dataset.category;
    syncSidebar(activeCategory);
    filterWidgets();
  });
});

// Sidebar

const sidebarItems = document.querySelectorAll(".sidebar-item[data-category]");

sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    sidebarItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    activeCategory = item.dataset.category;
    syncChips(activeCategory);
    filterWidgets();
  });
});

function syncSidebar(category) {
  sidebarItems.forEach((i) => {
    i.classList.toggle("active", i.dataset.category === category);
  });
}

function syncChips(category) {
  filterChips.forEach((c) => {
    c.classList.toggle("active", c.dataset.category === category);
  });
}

// DARK MODE
const darkToggle = document.getElementById("dark-toggle");
const icon = darkToggle.querySelector("i");

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  icon.className = isDark ? "ti ti-sun" : "ti ti-moon";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Recordar preferencia
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  icon.className = "ti ti-sun";
}

// ANIMACIONES HOVER EN TARJETAS
// (se aplican via CSS, aquí manejamos el click)
document.getElementById("widget-grid").addEventListener("click", (e) => {
  const card = e.target.closest(".widget-card");
  if (!card) return;
  card.classList.add("card-clicked");
  setTimeout(() => card.classList.remove("card-clicked"), 300);
});

// INIT
renderWidgets(widgets);
