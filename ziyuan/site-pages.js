document.addEventListener("DOMContentLoaded", () => {
  buildSiteHeader();
  buildSiteFooter();
  buildPageContent();
  initSiteMenu();
});

function buildSiteHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const active = header.dataset.active || "";
  const { company, nav } = SITE_DATA;

  header.innerHTML = `
    <div class="site-header-inner">
      <a href="index.html" class="site-logo" aria-label="返回首页">
        <span>春</span>
        <strong><em>春晖</em>${company.name.replace(/^中山/, "")}</strong>
      </a>
      <nav class="site-nav" aria-label="主导航">
        ${nav.map(item => `
          <a href="${item.href}" class="${item.key === active ? "active" : ""}">${item.label}</a>
        `).join("")}
      </nav>
      <a class="site-header-phone" href="tel:${company.phone}">${company.phone}</a>
      <button class="site-menu-btn" type="button" aria-label="打开菜单" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="site-mobile-panel">
      ${nav.map(item => `<a href="${item.href}" class="${item.key === active ? "active" : ""}">${item.label}</a>`).join("")}
      <a href="tel:${company.phone}" class="site-mobile-phone">${company.phone}</a>
    </div>
  `;
}

function buildSiteFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;

  const { company, nav } = SITE_DATA;
  footer.innerHTML = `
    <div class="site-footer-inner">
      <div>
        <div class="site-footer-logo"><em>春晖</em>${company.name.replace(/^中山/, "")}</div>
        <p>${company.sloganSub}</p>
      </div>
      <div class="site-footer-nav">
        ${nav.map(item => `<a href="${item.href}">${item.label}</a>`).join("")}
      </div>
      <div class="site-footer-contact">
        <strong>${company.phone}</strong>
        <span>${company.address}</span>
      </div>
    </div>
    <div class="site-footer-copy">© ${new Date().getFullYear()} ${company.name} · ${company.icp}</div>
  `;
}

function buildPageContent() {
  if (document.getElementById("products-page-root")) buildProductsPage();
  if (document.getElementById("about-page-root")) buildAboutPage();
  if (document.getElementById("news-page-root")) buildNewsPage();
  if (document.getElementById("join-page-root")) buildJoinPage();
}

function buildProductsPage() {
  const root = document.getElementById("products-page-root");
  const { productCenter } = SITE_DATA;
  const catalog = SITE_DATA.products || [];
  const params = new URLSearchParams(window.location.search);
  const initialCat = params.get("cat") || "全部";

  root.innerHTML = `
    <section id="products" class="section product-page-section">
      <div class="product-center-hero">
        <div class="product-center-hero-copy">
          <p class="section-eyebrow">${productCenter.hero.eyebrow}</p>
          <h1 class="section-title">${productCenter.hero.title}</h1>
          <div class="section-title-rule"></div>
          <p class="product-center-desc">${productCenter.hero.desc}</p>
          <div class="product-center-actions">
            <a href="#product-list" class="btn-red">浏览产品</a>
            <a href="index.html#contact" class="btn-ghost btn-ghost-dark">预约咨询</a>
          </div>
        </div>
        <div class="product-center-hero-media">
          <img src="${productCenter.hero.image}" alt="春晖产品中心" loading="lazy">
          <div class="product-center-statbar">
            ${productCenter.hero.highlights.map(item => `
              <div><strong>${item.value}</strong><span>${item.label}</span></div>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="product-category-strip">
        ${productCenter.categories.map(cat => `
          <button class="product-category-card site-product-filter" type="button" data-cat="${cat.title}">
            <span class="product-category-count">${cat.count}</span>
            <span class="product-category-img"><img src="${cat.image}" alt="${cat.title}" loading="lazy"></span>
            <span class="product-category-body">
              <small>${cat.subtitle}</small>
              <strong>${cat.title}</strong>
              <em>${cat.desc}</em>
            </span>
          </button>
        `).join("")}
      </div>
      <div class="product-shell" id="product-list">
        <aside class="product-side">
          <div class="product-side-title">筛选产品</div>
          ${productCenter.filters.map(group => `
            <div class="product-filter-group">
              <div class="product-filter-title">${group.title}</div>
              <div class="product-filter-options">
                ${group.values.map(value => `
                  <button class="product-filter-chip site-product-filter" type="button" ${SITE_DATA.productCategories.includes(value) ? `data-cat="${value}"` : `data-query="${value}"`}>${value}</button>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </aside>
        <div class="product-list-panel">
          <div class="product-list-head">
            <div>
              <p class="section-eyebrow">CATALOG</p>
              <h2 class="section-title" id="site-product-title">全部产品</h2>
              <p class="product-list-desc">${productCenter.catalogDesc}</p>
            </div>
            <div class="product-filter" id="site-product-tabs">
              ${SITE_DATA.productCategories.map(cat => `<button class="filter-btn site-product-filter" type="button" data-cat="${cat}">${cat}</button>`).join("")}
            </div>
          </div>
          <div class="products-grid" id="site-products-grid"></div>
        </div>
      </div>
    </section>
  `;

  const renderProductGrid = list => {
    document.getElementById("site-products-grid").innerHTML = list.map(item => `
      <article class="product-card">
        <a href="index.html#contact" aria-label="咨询${item.name}">
          <div class="product-card-img" style="--product-accent:${item.accent || "#8B3A2A"};">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            ${item.tag ? `<span class="product-badge">${item.tag}</span>` : ""}
          </div>
          <div class="product-card-body">
            <div class="product-series">${item.series}</div>
            <h3 class="product-name">${item.name}</h3>
            <p class="product-desc">${item.desc}</p>
            <div class="product-price-row">
              <span class="product-price">${item.price}</span>
              <span class="product-enquire">立即咨询</span>
            </div>
          </div>
        </a>
      </article>
    `).join("");
  };

  const select = (cat = "全部", query = "") => {
    const normalizedCat = SITE_DATA.productCategories.includes(cat) ? cat : "全部";
    const list = query
      ? catalog.filter(item => [item.name, item.series, item.desc, item.tag].some(value => (value || "").includes(query)))
      : normalizedCat === "全部"
        ? catalog
        : catalog.filter(item => item.series === normalizedCat);

    document.getElementById("site-product-title").textContent = query || (normalizedCat === "全部" ? "全部产品" : normalizedCat);
    document.querySelectorAll(".site-product-filter[data-cat]").forEach(btn => {
      btn.classList.toggle("active", !query && btn.dataset.cat === normalizedCat);
    });
    document.querySelectorAll(".site-product-filter[data-query]").forEach(btn => {
      btn.classList.toggle("active", query && btn.dataset.query === query);
    });
    renderProductGrid(list.length ? list : catalog);
  };

  root.addEventListener("click", event => {
    const btn = event.target.closest(".site-product-filter");
    if (!btn) return;
    select(btn.dataset.cat || "全部", btn.dataset.query || "");
  });

  select(initialCat);
}

function buildAboutPage() {
  const root = document.getElementById("about-page-root");
  const { about, stats, productCenter } = SITE_DATA;

  root.innerHTML = `
    <section class="site-page-hero">
      <p class="section-eyebrow">ABOUT CHUNHUI</p>
      <h1>${about.title}</h1>
      <p>${getExcerpt(about.content, 180)}</p>
    </section>
    <section class="site-stat-band">
      ${stats.map(item => `<div><strong>${item.number}</strong><span>${item.label}</span></div>`).join("")}
    </section>
    <section class="site-split-section">
      <div class="site-image-panel">
        <img src="${about.image}" alt="春晖门业展示" loading="lazy" onerror="this.onerror=null;this.src='${productCenter.hero.image}';">
      </div>
      <div>
        <p class="section-eyebrow">MANUFACTURING</p>
        <h2 class="section-title">进口设备与稳定工艺，支撑长期品质</h2>
        <div class="section-title-rule"></div>
        <div class="site-feature-grid">
          ${about.highlights.map(item => `
            <article>
              <span>${item.icon}</span>
              <h3>${item.title}</h3>
              <p>${item.desc}</p>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
    <section class="site-about-copy">
      <p>${about.content}</p>
    </section>
    <section class="site-timeline-section">
      <p class="section-eyebrow">HISTORY</p>
      <h2 class="section-title">发展历程</h2>
      <div class="site-timeline">
        ${about.timeline.map(item => `
          <div>
            <strong>${item.year}</strong>
            <p>${item.event}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function getExcerpt(text, maxLength) {
  if (!text || text.length <= maxLength) return text || "";
  return `${text.slice(0, maxLength)}...`;
}

function buildNewsPage() {
  const root = document.getElementById("news-page-root");
  const { news } = SITE_DATA;

  root.innerHTML = `
    <section class="site-page-hero site-page-hero-compact">
      <p class="section-eyebrow">NEWS</p>
      <h1>新闻动态</h1>
      <p>聚焦春晖门业品牌资讯、木门保养知识与家居空间趋势。</p>
    </section>
    <section class="site-news-list">
      ${news.map((item, index) => `
        <article class="${index === 0 ? "featured" : ""}">
          <a href="javascript:;">
            <span class="site-news-image"><img src="${item.image}" alt="${item.title}" loading="lazy"></span>
            <span class="site-news-copy">
              <small>${item.category} · ${item.date}</small>
              <strong>${item.title}</strong>
              <em>${item.summary}</em>
            </span>
          </a>
        </article>
      `).join("")}
    </section>
  `;
}

function buildJoinPage() {
  const root = document.getElementById("join-page-root");
  const { advantages, company, contact } = SITE_DATA;

  root.innerHTML = `
    <section class="site-page-hero join-hero">
      <p class="section-eyebrow">JOIN US</p>
      <h1>招商加盟 · 共建春晖木门市场版图</h1>
      <p>${contact.ctaSub}</p>
      <div class="site-hero-actions">
        <a href="tel:${company.phone}" class="btn-red">拨打招商热线</a>
        <a href="#join-form" class="btn-ghost btn-ghost-dark">提交加盟意向</a>
      </div>
    </section>
    <section class="site-feature-grid site-join-grid">
      ${advantages.map(item => `
        <article>
          <span>${item.icon}</span>
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
        </article>
      `).join("")}
    </section>
    <section class="site-join-process">
      <p class="section-eyebrow">PROCESS</p>
      <h2 class="section-title">加盟流程</h2>
      <div>
        ${["咨询沟通", "区域评估", "门店选址", "设计开业", "持续扶持"].map((item, index) => `
          <article><strong>0${index + 1}</strong><span>${item}</span></article>
        `).join("")}
      </div>
    </section>
    <section class="site-form-section" id="join-form">
      <div>
        <p class="section-eyebrow">CONTACT</p>
        <h2 class="section-title">提交加盟意向</h2>
        <p>留下您的联系方式，春晖招商团队将与您沟通区域机会与门店支持政策。</p>
      </div>
      <form id="join-intent-form">
        <input type="text" placeholder="姓名" required>
        <input type="tel" placeholder="联系电话" required>
        <input type="text" placeholder="意向城市">
        <textarea placeholder="请简单说明您的门店资源或合作想法"></textarea>
        <button type="submit">提交意向</button>
      </form>
    </section>
  `;

  root.querySelector("#join-intent-form")?.addEventListener("submit", event => {
    event.preventDefault();
    alert("已收到加盟意向，我们会尽快联系您。");
    event.currentTarget.reset();
  });
}

function initSiteMenu() {
  const header = document.getElementById("site-header");
  if (!header) return;

  header.addEventListener("click", event => {
    const button = event.target.closest(".site-menu-btn");
    if (!button) return;

    const isOpen = header.classList.toggle("menu-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
}
