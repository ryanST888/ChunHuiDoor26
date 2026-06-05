const CATEGORY_META = {
  "实木烤漆门": {
    desc: "适合重视质感、造型和空间档次的客户，可用于别墅、酒店、公寓和中高端家装。",
    fit: "质感造型 / 门店主推 / 工程形象",
    audience: "家装客户、别墅项目、酒店公寓、经销渠道",
    custom: "颜色、尺寸、门套、五金与表面工艺",
  },
  "生态门": {
    desc: "款式覆盖面广，适合现代家装、整装套餐、精装项目和装修公司主材配套。",
    fit: "现代木纹 / 家装整配 / 批量选型",
    audience: "家装客户、精装项目、装修公司、经销渠道",
    custom: "门型、饰面颜色、尺寸、门套与五金配置",
  },
  "铝木门": {
    desc: "兼顾结构稳定与简洁外观，适合关注耐用、防潮和统一交付的项目需求。",
    fit: "结构稳定 / 防潮耐用 / 工程配套",
    audience: "现代家装、工程配套、酒店公寓、装修公司",
    custom: "门型、颜色、尺寸、结构配置与五金方案",
  },
};

const params = new URLSearchParams(window.location.search);
const items = Array.isArray(window.PRODUCT_MANIFEST) ? window.PRODUCT_MANIFEST : PRODUCT_MANIFEST;

document.addEventListener("DOMContentLoaded", () => {
  const product = resolveProduct();
  if (!product) {
    showNotFound();
    return;
  }

  renderProduct(product);
  renderJsonLd(product);
});

function resolveProduct() {
  const id = Number(params.get("id"));
  const image = params.get("image");

  if (Number.isInteger(id) && id >= 0 && id < items.length) {
    return { ...items[id], id };
  }

  if (image) {
    const decoded = decodeURIComponent(image);
    const index = items.findIndex(item => item.image === decoded);
    if (index >= 0) return { ...items[index], id: index };
  }

  return items.length ? { ...items[0], id: 0 } : null;
}

function renderProduct(product) {
  const title = cleanTitle(product.title);
  const meta = getCategoryMeta(product.category);

  document.title = `${title} — 春晖门业产品详情`;
  setText("breadcrumb-current", title);
  setText("product-category", `${product.category} / ${product.series}`);
  setText("product-title", title);
  setText("product-summary", buildSummary(product));

  const image = document.getElementById("product-image");
  image.src = encodeURI(product.image);
  image.alt = title;

  document.getElementById("tag-row").innerHTML = [
    product.category,
    product.series,
    meta.fit,
    "询价定制",
  ].map(tag => `<span>${escapeHtml(tag)}</span>`).join("");

  document.getElementById("decision-strip").innerHTML = [
    ["适用客户", meta.audience],
    ["报价方式", "按尺寸 / 数量 / 配置询价"],
    ["咨询建议", "发送型号或截图更快确认"],
  ].map(([label, value]) => `
    <div class="decision-item">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `).join("");

  renderSpecs(product);
  renderScenes(product);
  renderRelated(product);
}

function buildSummary(product) {
  const title = cleanTitle(product.title);
  const meta = getCategoryMeta(product.category);
  return `${title} 属于春晖门业${product.category}产品，${meta.desc} 可根据项目尺寸、数量、风格和五金配置沟通定制方案。`;
}

function renderSpecs(product) {
  const meta = getCategoryMeta(product.category);
  const specs = [
    ["产品名称", cleanTitle(product.title)],
    ["产品类别", product.category],
    ["产品系列", product.series],
    ["风格定位", meta.fit],
    ["适配客户", meta.audience],
    ["可定制项", meta.custom],
    ["报价方式", "按尺寸、数量、材质与配置询价"],
    ["交付沟通", "支持家装单套与工程批量需求确认"],
  ];

  document.getElementById("spec-grid").innerHTML = specs.map(([label, value]) => `
    <div class="spec-item">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `).join("");
}

function renderScenes(product) {
  const scenes = getScenes(product.category);
  document.getElementById("scene-list").innerHTML = scenes.map(scene => `
    <div class="scene-item">
      <strong>${escapeHtml(scene.title)}</strong>
      <span>${escapeHtml(scene.desc)}</span>
    </div>
  `).join("");
}

function renderRelated(product) {
  const related = items
    .map((item, index) => ({ ...item, id: index }))
    .filter(item => item.id !== product.id && item.category === product.category)
    .slice(0, 4);

  document.getElementById("related-grid").innerHTML = related.map(item => `
    <a class="related-card" href="product-detail.html?id=${item.id}">
      <div class="related-card__media">
        <img src="${encodeURI(item.image)}" alt="${escapeHtml(cleanTitle(item.title))}" loading="lazy">
      </div>
      <div class="related-card__body">
        <span>${escapeHtml(item.category)} / ${escapeHtml(item.series)}</span>
        <h3>${escapeHtml(cleanTitle(item.title))}</h3>
      </div>
    </a>
  `).join("");
}

function getScenes(category) {
  if (category.includes("烤漆")) {
    return [
      { title: "中高端家装", desc: "适合卧室、书房、套房等需要质感表达的空间。" },
      { title: "酒店与公寓", desc: "适合统一风格、批量采购和稳定交付的项目需求。" },
      { title: "经销门店展示", desc: "适合作为门店样品和高关注度主推系列。" },
    ];
  }

  if (category.includes("生态")) {
    return [
      { title: "现代家居空间", desc: "适合简约、轻奢、自然木纹等多种室内风格。" },
      { title: "精装与工程项目", desc: "适合关注预算、交付效率和款式统一的批量项目。" },
      { title: "装修公司配套", desc: "适合作为整装套餐或主材配套方案的一部分。" },
    ];
  }

  if (category.includes("铝木")) {
    return [
      { title: "现代住宅空间", desc: "适合注重结构稳定、简洁外观和日常耐用性的室内空间。" },
      { title: "工程批量配套", desc: "适合统一配置、统一交付和售后沟通的项目需求。" },
      { title: "酒店公寓项目", desc: "适合需要耐用、易维护和风格统一的批量空间。" },
    ];
  }

  return [
    { title: "现代室内门定制", desc: "适合注重结构稳定和简洁外观的住宅空间。" },
    { title: "工程批量配套", desc: "适合统一配置、统一交付和售后沟通的项目需求。" },
    { title: "渠道合作展示", desc: "适合经销商或装修公司作为差异化产品补充。" },
  ];
}

function renderJsonLd(product) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: cleanTitle(product.title),
    description: buildSummary(product),
    category: product.category,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: "春晖门业",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "CNY",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "CNY",
        description: "按尺寸、数量、材质与配置询价",
      },
    },
  });
  document.head.appendChild(script);
}

function showNotFound() {
  document.getElementById("detail-root").hidden = true;
  document.getElementById("not-found").hidden = false;
}

function getCategoryMeta(category) {
  return CATEGORY_META[category] || {
    desc: "适合家装、工程、酒店公寓、经销商和装修公司按需选型。",
    fit: "定制 / 配套 / 交付稳定",
    audience: "家装客户、工程客户、经销商和装修公司",
    custom: "尺寸、颜色、门套、五金与项目配置",
  };
}

function cleanTitle(value) {
  return String(value)
    .replace(/\.(jpg|jpeg|png|webp)$/i, "")
    .replace(/_1$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
