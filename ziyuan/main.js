/**
 * CHUNHUI_WEB · 春晖门业
 * ziyuan/main.js — 渲染引擎，无需修改
 */

document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  buildMobileMenu();
  buildHero();
  buildStats();
  buildProducts();
  buildAdvantages();
  buildAbout();
  buildNews();
  buildCtaBanner();
  buildContact();
  buildFooter();
  initScroll();
  initNavScroll();
  initProductFilter();
  initMobileMenu();
});

/* ── 导航 ── */
function buildNav() {
  const { company, nav } = SITE_DATA;
  document.getElementById('navbar').innerHTML = `
    <a href="index.html" class="nav-logo">
      <div class="nav-logo-icon">春</div>
      <span class="nav-logo-text"><em>春晖</em>${company.name.slice(2)}</span>
    </a>
    <nav class="nav-links">
      ${nav.map((n) => {
        if (n.label === '产品中心') {
          return `
            <div class="nav-item nav-product-item">
              <a href="${n.href}" class="nav-main-link${n.key === 'home' ? ' active' : ''}">${n.label}</a>
              ${buildProductMega()}
            </div>
          `;
        }
        return `<a href="${n.href}" class="nav-main-link${n.key === 'home' ? ' active' : ''}">${n.label}</a>`;
      }).join('')}
    </nav>
    <div class="hamburger" id="hamburger">
      <span></span><span></span><span></span>
    </div>
  `;
}

function buildProductMega() {
  const productCenter = SITE_DATA.productCenter || {};
  const groups = productCenter.navGroups || [];

  return `
    <div class="nav-product-mega">
      <div class="nav-product-mega-inner">
        <div class="nav-product-intro">
          <span>PRODUCTS</span>
          <strong>产品中心</strong>
          <p>按品类与系列快速进入产品矩阵，先看风格，再预约定制。</p>
        </div>
        ${groups.map(group => `
          <div class="nav-product-group">
            <div class="nav-product-group-title">${group.title}</div>
            <div class="nav-product-list">
              ${group.items.map(item => `
                <a href="products.html?cat=${encodeURIComponent(item.cat)}" class="product-nav-link" data-cat="${item.cat}">
                  <span>${item.label.slice(0, 1)}</span>
                  <div>
                    <strong>${item.label}</strong>
                    <small>${item.desc}</small>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function buildMobileMenu() {
  const { nav } = SITE_DATA;
  document.getElementById('mobile-menu').innerHTML = `
    <span class="mobile-close" id="mobile-close">✕</span>
    ${nav.map(n => `<a href="${n.href}" class="mobile-link">${n.label}</a>`).join('')}
  `;
}

/* ── Hero ── */
function buildHero() {
  const { company } = SITE_DATA;
  document.getElementById('hero-content').innerHTML = `
    <p class="hero-eyebrow">${company.nameEn} &nbsp;·&nbsp; SINCE ${company.founded}</p>
    <h1 class="hero-title">
      <span class="zhu">${company.slogan.slice(0,2)}</span><span class="jin">${company.slogan.slice(2,3)}</span>${company.slogan.slice(3)}
    </h1>
    <div class="hero-divider">
      <div class="hero-divider-line"></div>
      <div class="hero-divider-dot"></div>
      <div class="hero-divider-line"></div>
    </div>
    <p class="hero-sub">${company.sloganSub}</p>
    <div class="hero-btns">
      <a href="#contact" class="btn-red">免费预约量房</a>
      <a href="products.html" class="btn-ghost">查看产品</a>
    </div>
  `;
}

/* ── 数据条 ── */
function buildStats() {
  document.getElementById('stats').innerHTML =
    SITE_DATA.stats.map(s => `
      <div class="stat-item reveal">
        <div class="stat-num">${s.number}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');
}

/* ── 产品 ── */
function buildProducts() {
  const productCenter = SITE_DATA.productCenter || {};
  const catalog = getProductCatalog();
  const hero = productCenter.hero || {};
  const featured = catalog[0] || {};

  document.getElementById('products').innerHTML = `
    <div class="product-center-hero">
      <div class="product-center-hero-copy reveal">
        <p class="section-eyebrow">${hero.eyebrow || 'PRODUCT CENTER'}</p>
        <h2 class="section-title">${hero.title || '产品中心'}</h2>
        <div class="section-title-rule"></div>
        <p class="product-center-desc">${hero.desc || ''}</p>
        <div class="product-center-actions">
          <a href="#contact" class="btn-red">预约产品顾问</a>
          <a href="#product-list" class="btn-ghost btn-ghost-dark">浏览产品</a>
        </div>
      </div>
      <div class="product-center-hero-media reveal reveal-delay-1">
        <img src="${hero.image || featured.image}" alt="${featured.name || '春晖产品中心'}" loading="lazy">
        <div class="product-center-statbar">
          ${(hero.highlights || []).map(item => `
            <div>
              <strong>${item.value}</strong>
              <span>${item.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="product-category-strip">
      ${(productCenter.categories || []).map((cat, i) => `
        <button class="product-category-card product-nav-link reveal reveal-delay-${(i % 4) + 1}" data-cat="${cat.title}">
          <span class="product-category-count">${cat.count}</span>
          <span class="product-category-img">
            <img src="${cat.image}" alt="${cat.title}" loading="lazy">
          </span>
          <span class="product-category-body">
            <small>${cat.subtitle}</small>
            <strong>${cat.title}</strong>
            <em>${cat.desc}</em>
          </span>
        </button>
      `).join('')}
    </div>

    <div class="product-shell" id="product-list">
      <aside class="product-side reveal">
        <div class="product-side-title">筛选产品</div>
        ${(productCenter.filters || []).map(group => `
          <div class="product-filter-group">
            <div class="product-filter-title">${group.title}</div>
            <div class="product-filter-options">
              ${group.values.map(value => `
                <button class="product-filter-chip product-nav-link" ${SITE_DATA.productCategories.includes(value) ? `data-cat="${value}"` : `data-query="${value}"`}>${value}</button>
              `).join('')}
            </div>
          </div>
        `).join('')}
        <div class="product-recommend-list">
          ${(productCenter.recommendations || []).map(item => `
            <a href="#contact" class="product-recommend">
              <span>
                <img src="${item.image}" alt="${item.name}" loading="lazy">
              </span>
              <div>
                <small>${item.title}</small>
                <strong>${item.name}</strong>
              </div>
            </a>
          `).join('')}
        </div>
      </aside>

      <div class="product-list-panel">
        <div class="product-list-head reveal">
          <div>
            <p class="section-eyebrow">CATALOG</p>
            <h3 class="section-title" id="product-list-title">${productCenter.catalogTitle || '全部产品'}</h3>
            <p class="product-list-desc">${productCenter.catalogDesc || ''}</p>
          </div>
          <div class="product-filter" id="product-filter"></div>
        </div>
        <div class="products-grid" id="products-grid"></div>
      </div>
    </div>
  `;

  document.getElementById('product-filter').innerHTML =
    SITE_DATA.productCategories.map((c,i) =>
      `<button class="filter-btn${i===0?' active':''}" data-cat="${c}">${c}</button>`
    ).join('');

  renderProductCards(catalog);
}

function getProductCatalog() {
  return (SITE_DATA.productCenter && SITE_DATA.productCenter.catalog) || SITE_DATA.products || [];
}

function renderProductCards(list) {
  document.getElementById('products-grid').innerHTML = list.map((p, i) => `
    <article class="product-card reveal reveal-delay-${(i%3)+1}" data-series="${p.series}">
      <a href="#contact" aria-label="咨询${p.name}">
        <div class="product-card-img" style="--product-accent:${p.accent || '#8B3A2A'};">
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
          ${p.tag ? `<span class="product-badge">${p.tag}</span>` : ''}
        </div>
        <div class="product-card-body">
          <div class="product-series">${p.series}</div>
          <h4 class="product-name">${p.name}</h4>
          <p class="product-desc">${p.desc}</p>
          <div class="product-price-row">
            <span class="product-price">${p.price}</span>
            <span class="product-enquire">立即咨询</span>
          </div>
        </div>
      </a>
    </article>
  `).join('');
  // 重新触发滚动动画
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      if (isInView(el)) el.classList.add('visible');
    });
  }, 80);
}

function initProductFilter() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    const navLink = e.target.closest('.product-nav-link');
    if (!btn && !navLink) return;

    const target = btn || navLink;
    selectProductCategory(target.dataset.cat || '全部', target.dataset.query || '');
  });
}

function selectProductCategory(cat, query = '') {
  const catalog = getProductCatalog();
  const nextCat = cat || '全部';
  const normalizedQuery = query.trim();
  const filtered = normalizedQuery
    ? catalog.filter(p => [p.name, p.series, p.desc, p.tag].some(v => (v || '').includes(normalizedQuery)))
    : nextCat === '全部'
      ? catalog
      : catalog.filter(p => p.series === nextCat);

  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', !normalizedQuery && b.dataset.cat === nextCat);
  });

  const title = document.getElementById('product-list-title');
  if (title) title.textContent = normalizedQuery || (nextCat === '全部' ? '全部产品' : nextCat);

  renderProductCards(filtered.length ? filtered : catalog);
}

/* ── 优势板块 ── */
function buildAdvantages() {
  const { advantages, contact } = SITE_DATA;
  document.getElementById('advantages-grid').innerHTML =
    advantages.map((a, i) => `
      <div class="advantage-item reveal reveal-delay-${i+1}">
        <div class="advantage-icon">${a.icon}</div>
        <div class="advantage-title">${a.title}</div>
        <div class="advantage-desc">${a.desc}</div>
      </div>
    `).join('');
}

/* ── 关于我们 ── */
function buildAbout() {
  const { about } = SITE_DATA;

  document.getElementById('about-img-area').innerHTML = `
    <div class="about-img-frame reveal">
      <div class="about-img-border"></div>
      <div class="about-img-wrap">
        <div class="about-img-placeholder">
          <span>匠</span>
          <small>替换为工厂/实景图</small>
        </div>
        <img src="${about.image}" alt="春晖工厂" loading="lazy"
             style="position:absolute;inset:0;" onerror="this.style.display='none'">
      </div>
    </div>
  `;

  document.getElementById('about-text-area').innerHTML = `
    <div class="reveal">
      <p class="section-eyebrow">ABOUT CHUNHUI</p>
      <h2 class="section-title">${about.title}</h2>
      <div class="section-title-rule"></div>
    </div>
    <p class="about-content-body reveal reveal-delay-1">${about.content}</p>
    <div class="about-highlights reveal reveal-delay-2">
      ${about.highlights.map(h => `
        <div class="highlight-item">
          <div class="highlight-icon">${h.icon}</div>
          <div class="highlight-title">${h.title}</div>
          <div class="highlight-desc">${h.desc}</div>
        </div>
      `).join('')}
    </div>
    <div class="reveal reveal-delay-3">
      <div class="timeline-title">发展历程</div>
      <div class="timeline">
        ${about.timeline.map(t => `
          <div class="timeline-item">
            <div class="timeline-left">
              <div class="timeline-year">${t.year}</div>
              <div class="timeline-dot"></div>
              <div class="timeline-line"></div>
            </div>
            <div class="timeline-event">${t.event}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ── 新闻动态 ── */
function buildNews() {
  const { news } = SITE_DATA;
  const [main, ...rest] = news;

  document.getElementById('news-grid').innerHTML = `
    <div class="news-card news-card-main reveal">
      <div class="news-card-img-wrap">
        <div class="news-card-img-placeholder">📰</div>
        <img src="${main.image}" alt="${main.title}" loading="lazy" onerror="this.style.display='none'">
      </div>
      <div class="news-card-body">
        <div class="news-meta">
          <span class="news-cat">${main.category}</span>
          <span class="news-date">${main.date}</span>
        </div>
        <h3 class="news-title">${main.title}</h3>
        <p class="news-summary">${main.summary}</p>
        <a href="#" class="news-link">阅读全文 →</a>
      </div>
    </div>
    ${rest.map((n, i) => `
      <div class="news-card reveal reveal-delay-${i+1}">
        <div class="news-card-img-wrap">
          <div class="news-card-img-placeholder">📄</div>
          <img src="${n.image}" alt="${n.title}" loading="lazy" onerror="this.style.display='none'">
        </div>
        <div class="news-card-body">
          <div class="news-meta">
            <span class="news-cat">${n.category}</span>
            <span class="news-date">${n.date}</span>
          </div>
          <h3 class="news-title">${n.title}</h3>
          <p class="news-summary">${n.summary}</p>
          <a href="#" class="news-link">阅读全文 →</a>
        </div>
      </div>
    `).join('')}
  `;
}

/* ── CTA 横幅 ── */
function buildCtaBanner() {
  const { contact, company } = SITE_DATA;
  document.getElementById('cta-content').innerHTML = `
    <h2 class="cta-title">${contact.cta}</h2>
    <p class="cta-sub">${contact.ctaSub}</p>
    <div class="cta-btns">
      <a href="#contact" class="btn-white">在线预约</a>
      <div>
        <span class="cta-phone-label">或直接拨打</span>
        <a href="tel:${company.phone}" class="cta-phone">${company.phone}</a>
      </div>
    </div>
  `;
}

/* ── 联系我们 ── */
function buildContact() {
  const { company, contact } = SITE_DATA;
  document.getElementById('contact-info').innerHTML = `
    <div class="contact-items">
      <div class="contact-item">
        <div class="contact-icon-wrap">📞</div>
        <div>
          <div class="contact-label">销售热线</div>
          <div class="contact-value big">${contact.salesPhone}</div>
        </div>
      </div>
      <div class="contact-item">
        <div class="contact-icon-wrap">🛠️</div>
        <div>
          <div class="contact-label">售后服务</div>
          <div class="contact-value big">${contact.afterSalePhone}</div>
        </div>
      </div>
      <div class="contact-item">
        <div class="contact-icon-wrap">✉️</div>
        <div>
          <div class="contact-label">邮箱</div>
          <div class="contact-value">${company.email}</div>
        </div>
      </div>
      <div class="contact-item">
        <div class="contact-icon-wrap">📍</div>
        <div>
          <div class="contact-label">总部地址</div>
          <div class="contact-value">${company.address}</div>
        </div>
      </div>
      <div class="contact-item">
        <div class="contact-icon-wrap">🕐</div>
        <div>
          <div class="contact-label">服务时间</div>
          <div class="contact-value">${contact.workHours}</div>
        </div>
      </div>
    </div>
  `;
}

/* ── 页脚 ── */
function buildFooter() {
  const { company, nav } = SITE_DATA;
  document.getElementById('footer').innerHTML = `
    <div class="footer-inner">
      <div class="footer-logo"><em>春晖</em>${company.name.slice(2)}</div>
      <p class="footer-copy">© ${new Date().getFullYear()} ${company.name} · 版权所有 &nbsp;|&nbsp; ${company.icp}</p>
      <div class="footer-links">
        ${nav.slice(1).map(n => `<a href="${n.href}">${n.label}</a>`).join('')}
      </div>
    </div>
  `;
}

/* ── 滚动入场 ── */
function isInView(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight - 60;
}

function initScroll() {
  const check = () => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      if (isInView(el)) el.classList.add('visible');
    });
  };
  const revealHashSection = () => {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  };
  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('load', () => {
    check();
    revealHashSection();
  });
  window.addEventListener('hashchange', () => {
    setTimeout(check, 120);
    setTimeout(revealHashSection, 180);
  });
  setTimeout(check, 200);
  setTimeout(revealHashSection, 360);
  setTimeout(check, 800);
  setTimeout(revealHashSection, 1000);
  setTimeout(check, 1400);
}

/* ── 导航滚动 ── */
function initNavScroll() {
  const nb = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nb.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

/* ── 移动端菜单 ── */
function initMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  document.addEventListener('click', e => {
    if (e.target.closest('#hamburger')) menu.classList.add('open');
    if (e.target.id === 'mobile-close') menu.classList.remove('open');
    if (e.target.classList.contains('mobile-link')) menu.classList.remove('open');
  });
}
