const ALL = "全部";

const CATEGORY_META = {
  "实木烤漆门": {
    desc: "适合重视质感、造型和空间档次的客户，可用于别墅、酒店、公寓和中高端家装。",
    fit: "质感造型 / 门店主推 / 工程形象",
  },
  "生态门": {
    desc: "款式覆盖面广，适合现代家装、整装套餐、精装项目和装修公司主材配套。",
    fit: "现代木纹 / 家装整配 / 批量选型",
  },
  "铝木门": {
    desc: "兼顾结构稳定与简洁外观，适合关注耐用、防潮和统一交付的项目需求。",
    fit: "结构稳定 / 防潮耐用 / 工程配套",
  },
};

const BROCHURES = [
  {
    title: "产品图册 01",
    desc: "适合先快速浏览整体款式、门型与风格方向。",
    url: "https://book.yunzhan365.com/wxfu/oksx/mobile/index.html",
  },
  {
    title: "产品图册 02",
    desc: "适合查看不同系列的颜色、造型和空间搭配参考。",
    url: "https://book.yunzhan365.com/wxfu/urim/mobile/index.html",
  },
  {
    title: "产品图册 03",
    desc: "适合工程、经销和整装客户补充浏览更多产品款式。",
    url: "https://book.yunzhan365.com/wxfu/zrsw/mobile/index.html",
  },
  {
    title: "产品图册 04",
    desc: "适合继续补充查看更多门型、饰面和系列组合。",
    url: "https://book.yunzhan365.com/wxfu/zyzo/mobile/index.html",
  },
  {
    title: "产品图册 05",
    desc: "适合经销展示、工程选型和客户沟通时扩展参考。",
    url: "https://book.yunzhan365.com/wxfu/dufg/mobile/index.html",
  },
];

const state = {
  category: ALL,
  series: ALL,
  query: "",
  brochure: 0,
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  els.totalCount = document.getElementById("total-count");
  els.categoryCount = document.getElementById("category-count");
  els.seriesCount = document.getElementById("series-count");
  els.categoryOverview = document.getElementById("category-overview");
  els.brochureList = document.getElementById("brochure-list");
  els.brochureFrame = document.getElementById("brochure-frame");
  els.brochureTitle = document.getElementById("brochure-title");
  els.brochureLink = document.getElementById("brochure-link");
  els.categoryFilters = document.getElementById("category-filters");
  els.seriesFilters = document.getElementById("series-filters");
  els.searchInput = document.getElementById("search-input");
  els.productGrid = document.getElementById("product-grid");
  els.resultCount = document.getElementById("result-count");
  els.resultTitle = document.getElementById("result-title");
  els.emptyState = document.getElementById("empty-state");
  els.lightbox = document.getElementById("lightbox");
  els.lightboxImg = document.getElementById("lightbox-img");
  els.lightboxTitle = document.getElementById("lightbox-title");
  els.lightboxMeta = document.getElementById("lightbox-meta");

  hydrateStats();
  renderCategoryOverview();
  renderBrochures();
  renderFilters();
  renderProducts();
  bindEvents();
});

function getItems() {
  return Array.isArray(window.PRODUCT_MANIFEST) ? window.PRODUCT_MANIFEST : PRODUCT_MANIFEST;
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

function hydrateStats() {
  if (!els.totalCount || !els.categoryCount || !els.seriesCount) return;
  const items = getItems();
  els.totalCount.textContent = items.length;
  els.categoryCount.textContent = new Set(items.map(item => item.category)).size;
  els.seriesCount.textContent = new Set(items.map(item => item.series)).size;
}

function renderCategoryOverview() {
  const items = getItems();
  const categoryCounts = Object.entries(countBy(items, "category")).sort((a, b) => b[1] - a[1]);

  els.categoryOverview.innerHTML = categoryCounts.map(([category, count]) => {
    const meta = getCategoryMeta(category);
    return `
      <article class="category-card ${state.category === category ? "is-active" : ""}" role="button" tabindex="0" data-category="${escapeHtml(category)}">
        <span class="category-card__count">${count}</span>
        <div>
          <h3>${escapeHtml(category)}</h3>
          <p>${escapeHtml(meta.desc)}</p>
          <span class="category-card__meta">${escapeHtml(meta.fit)}</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderFilters() {
  const items = getItems();
  const categoryCounts = countBy(items, "category");
  const seriesSource = state.category === ALL ? items : items.filter(item => item.category === state.category);
  const seriesCounts = countBy(seriesSource, "series");

  els.categoryFilters.innerHTML = renderFilterButtons("category", categoryCounts, state.category);
  els.seriesFilters.innerHTML = renderFilterButtons("series", seriesCounts, state.series);
}

function renderFilterButtons(type, counts, activeValue) {
  const total = type === "series" && state.category !== ALL
    ? getItems().filter(item => item.category === state.category).length
    : getItems().length;
  const entries = [[ALL, total], ...Object.entries(counts).sort((a, b) => b[1] - a[1])];

  return entries.map(([label, count]) => `
    <button class="filter-btn ${activeValue === label ? "is-active" : ""}" type="button" data-filter-type="${type}" data-value="${escapeHtml(label)}">
      <span>${escapeHtml(label)}</span>
      <span>${count}</span>
    </button>
  `).join("");
}

function bindEvents() {
  document.addEventListener("click", event => {
    const categoryCard = event.target.closest(".category-card");
    if (categoryCard) {
      state.category = categoryCard.dataset.category;
      state.series = ALL;
      renderCategoryOverview();
      renderFilters();
      renderProducts();
      document.getElementById("catalog").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const filter = event.target.closest(".filter-btn");
    if (filter) {
      const type = filter.dataset.filterType;
      state[type] = filter.dataset.value;
      if (type === "category") state.series = ALL;
      renderCategoryOverview();
      renderFilters();
      renderProducts();
      return;
    }

    const brochureCard = event.target.closest(".brochure-card");
    if (brochureCard) {
      state.brochure = Number(brochureCard.dataset.index);
      renderBrochures();
      return;
    }

    const preview = event.target.closest(".preview-btn");
    if (preview) {
      event.preventDefault();
      event.stopPropagation();
      const item = getItems()[Number(preview.dataset.index)];
      openLightbox(item);
      return;
    }

    const card = event.target.closest(".product-card");
    if (card) {
      window.location.href = `product-detail.html?id=${card.dataset.index}`;
      return;
    }

    if (event.target.closest(".lightbox-close") || event.target.id === "lightbox") {
      closeLightbox();
    }
  });

  els.searchInput.addEventListener("input", event => {
    state.query = event.target.value.trim().toLowerCase();
    renderProducts();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Enter" && event.target.classList.contains("category-card")) {
      state.category = event.target.dataset.category;
      state.series = ALL;
      renderCategoryOverview();
      renderFilters();
      renderProducts();
      document.getElementById("catalog").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (event.key === "Enter" && event.target.classList.contains("product-card")) {
      window.location.href = `product-detail.html?id=${event.target.dataset.index}`;
      return;
    }
    if (event.key === "Escape") closeLightbox();
  });
}

function renderBrochures() {
  if (!els.brochureList || !els.brochureFrame) return;

  els.brochureList.innerHTML = BROCHURES.map((brochure, index) => `
    <button class="brochure-card ${state.brochure === index ? "is-active" : ""}" type="button" data-index="${index}">
      <span>0${index + 1}</span>
      <strong>${escapeHtml(brochure.title)}</strong>
      <small>${escapeHtml(brochure.desc)}</small>
    </button>
  `).join("");

  const current = BROCHURES[state.brochure] || BROCHURES[0];
  els.brochureTitle.textContent = current.title;
  els.brochureLink.href = current.url;
  els.brochureFrame.src = current.url;
}

function getFilteredItems() {
  return getItems().filter(item => {
    const matchesCategory = state.category === ALL || item.category === state.category;
    const matchesSeries = state.series === ALL || item.series === state.series;
    const haystack = `${item.title} ${item.description} ${item.category} ${item.series}`.toLowerCase();
    const translatedHaystack = window.CH_I18N
      ? window.CH_I18N.toEnglish(haystack).toLowerCase()
      : "";
    const matchesQuery = !state.query || haystack.includes(state.query) || translatedHaystack.includes(state.query);
    return matchesCategory && matchesSeries && matchesQuery;
  });
}

function renderProducts() {
  const items = getItems();
  const filtered = getFilteredItems();

  els.resultCount.textContent = filtered.length;
  els.resultTitle.textContent = buildResultTitle();
  els.emptyState.hidden = filtered.length > 0;

  els.productGrid.innerHTML = filtered.map(item => {
    const originalIndex = items.findIndex(source => source.image === item.image);
    const meta = getCategoryMeta(item.category);
    return `
      <article class="product-card" data-index="${originalIndex}" tabindex="0">
        <div class="product-media">
          <img src="${encodeURI(item.image)}" alt="${escapeHtml(cleanTitle(item.title))}" loading="lazy">
          <span class="product-badge">${escapeHtml(item.category)}</span>
          <button class="preview-btn" type="button" data-index="${originalIndex}">快速预览</button>
        </div>
        <div class="product-body">
          <div class="product-series">${escapeHtml(item.series)} · ${escapeHtml(meta.fit)}</div>
          <h3 class="product-title">${escapeHtml(cleanTitle(item.title))}</h3>
          <p class="product-desc">${escapeHtml(meta.desc)}</p>
    <div class="product-footer">
            <span>按需询价</span>
            <span>查看详情</span>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function buildResultTitle() {
  const parts = [];
  if (state.category !== ALL) parts.push(state.category);
  if (state.series !== ALL) parts.push(state.series);
  if (state.query) parts.push(`搜索：${state.query}`);
  return parts.length ? parts.join(" / ") : "全部产品";
}

function openLightbox(item) {
  if (!item) return;
  els.lightboxImg.src = encodeURI(item.image);
  els.lightboxImg.alt = cleanTitle(item.title);
  els.lightboxTitle.textContent = cleanTitle(item.title);
  els.lightboxMeta.textContent = `${item.category} / ${item.series} / 可按尺寸、数量与项目需求询价`;
  els.lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!els.lightbox || els.lightbox.hidden) return;
  els.lightbox.hidden = true;
  els.lightboxImg.src = "";
  document.body.style.overflow = "";
}

function getCategoryMeta(category) {
  return CATEGORY_META[category] || {
    desc: "适合家装、工程、酒店公寓、经销商和装修公司按需选型。",
    fit: "定制选型 / 配套交付 / 长期合作",
  };
}

function cleanTitle(value) {
  return String(value)
    .replace(/\.(jpg|jpeg|png|webp)$/i, "")
    .replace(/_1$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
