const PREVIEW_KEY = "chunhui_product_preview";

const emptyState = document.getElementById("preview-empty");
const content = document.getElementById("preview-content");
const mainImg = document.getElementById("preview-main-img");
const thumbs = document.getElementById("preview-thumbs");
const category = document.getElementById("preview-category");
const nameEl = document.getElementById("preview-name");
const summary = document.getElementById("preview-summary");
const tags = document.getElementById("preview-tags");
const specs = document.getElementById("preview-specs");
const card = document.getElementById("preview-card");
const detail = document.getElementById("preview-detail");

const raw = sessionStorage.getItem(PREVIEW_KEY);

if (raw) {
  const product = JSON.parse(raw);
  renderPreview(product);
}

function renderPreview(product) {
  const image = product.previewImages?.[0]?.src || "";
  emptyState.hidden = true;
  content.hidden = false;

  category.textContent = product.category || "PRODUCT";
  nameEl.textContent = product.name || "未命名产品";
  summary.textContent = product.summary || "暂无产品描述。";
  tags.innerHTML = (product.tags || []).map(tag => `<span>${tag}</span>`).join("");
  renderGallery(product.previewImages || []);
  renderSpecs(product);
  renderCard(product, image);
  renderDetail(product);
}

function renderGallery(images) {
  if (!images.length) {
    mainImg.innerHTML = "<span>暂无产品图片</span>";
    thumbs.innerHTML = "";
    return;
  }

  setMainImage(images[0].src, images[0].name);
  thumbs.innerHTML = images.map((image, index) => `
    <button type="button" class="${index === 0 ? "active" : ""}" data-index="${index}">
      <img src="${image.src}" alt="${image.name}">
    </button>
  `).join("");

  thumbs.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      const image = images[Number(button.dataset.index)];
      setMainImage(image.src, image.name);
      thumbs.querySelectorAll("button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

function setMainImage(src, alt) {
  mainImg.innerHTML = `<img src="${src}" alt="${alt}">`;
}

function renderSpecs(product) {
  const rows = [
    ["产品品类", product.category],
    ["产品型号", product.model],
    ["系列名称", product.series],
    ["材质工艺", product.material],
    ["门扇高度", product.specs?.height],
    ["门扇宽度", product.specs?.width],
    ["门扇厚度", product.specs?.thickness],
    ["适用空间", product.specs?.space],
    ["价格显示", product.price],
  ].filter(([, value]) => value);

  specs.innerHTML = rows.map(([label, value]) => `
    <div>
      <dt>${label}</dt>
      <dd>${value}</dd>
    </div>
  `).join("");
}

function renderCard(product, image) {
  card.innerHTML = `
    <a href="#preview-contact" aria-label="咨询${product.name}">
      <div class="product-card-img" style="--product-accent:#8B3A2A;">
        ${image ? `<img src="${image}" alt="${product.name}">` : "<span>暂无图片</span>"}
        ${(product.tags || [])[0] ? `<span class="product-badge">${product.tags[0]}</span>` : ""}
      </div>
      <div class="product-card-body">
        <div class="product-series">${product.category || "产品"}</div>
        <h4 class="product-name">${product.name || "未命名产品"}</h4>
        <p class="product-desc">${product.summary || "暂无产品描述。"}</p>
        <div class="product-price-row">
          <span class="product-price">${product.price || "询价定制"}</span>
          <span class="product-enquire">立即咨询</span>
        </div>
      </div>
    </a>
  `;
}

function renderDetail(product) {
  detail.innerHTML = `
    <h3>${product.name || "未命名产品"}</h3>
    <p>${product.detail || product.summary || "暂无详细说明。"}</p>
    <ul>
      ${(product.tags || []).map(tag => `<li>${tag}</li>`).join("") || "<li>待补充产品卖点</li>"}
    </ul>
  `;
}
