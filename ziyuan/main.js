/**
 * CHUNHUI_WEB · 春晖门业
 * ziyuan/main.js — 渲染引擎，无需修改
 */

document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  buildMobileMenu();
  buildHero();
  buildStats();
  buildSolutions();
  buildProducts();
  buildAdvantages();
  buildProcess();
  buildAbout();
  buildNews();
  buildFaq();
  buildCtaBanner();
  buildContact();
  buildFooter();
  initScroll();
  initNavScroll();
  initProductFilter();
  initMobileMenu();
});

function siteHref(href) {
  if (!href || href.startsWith('#') || /^(https?:|mailto:|tel:)/.test(href)) return href;
  return href;
}

/* ── 导航 ── */
function buildNav() {
  const { company, nav } = SITE_DATA;
  document.getElementById('navbar').innerHTML = `
    <a href="index.html" class="nav-logo" aria-label="${company.name}">
      <img class="nav-logo-mark" src="ziyuan/images/logo-mark.png" alt="${company.name}">
      <span class="nav-logo-company">${company.displayName || company.name}</span>
    </a>
    <nav class="nav-links">
      ${nav.map((n,i) => i === nav.length-1
        ? `<a href="${siteHref(n.href)}" class="nav-cta${i === 0 ? ' is-active' : ''}"${i === 0 ? ' aria-current="page"' : ''}>${n.label}</a>`
        : `<a href="${siteHref(n.href)}" class="${i === 0 ? 'is-active' : ''}"${i === 0 ? ' aria-current="page"' : ''}>${n.label}</a>`
      ).join('')}
    </nav>
    <div class="hamburger" id="hamburger">
      <span></span><span></span><span></span>
    </div>
  `;
}

function buildMobileMenu() {
  const { nav } = SITE_DATA;
  document.getElementById('mobile-menu').innerHTML = `
    <span class="mobile-close" id="mobile-close">✕</span>
    ${nav.map((n, i) => `<a href="${siteHref(n.href)}" class="mobile-link${i === 0 ? ' is-active' : ''}"${i === 0 ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}
  `;
}

/* ── Hero ── */
function buildHero() {
  const { company } = SITE_DATA;
  document.getElementById('hero-content').innerHTML = `
    <p class="hero-eyebrow">${company.nameEn} · SINCE ${company.founded}</p>
    <h1 class="hero-title">春晖门业</h1>
    <p class="hero-sub">面向家装、工程、酒店公寓与经销渠道的中高端室内门制造商</p>
    <div class="hero-proof">
      <span>碳晶门 / 生态门 / 免漆门</span>
      <span>工程批量配套</span>
      <span>中山工厂交付</span>
      <span>室内门定制</span>
    </div>
    <div class="hero-btns">
      <a href="lianxiwomen/index.html" class="btn-red">获取产品方案</a>
      <a href="product-center.html" class="btn-ghost">查看产品系列</a>
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

/* ── 客户方案入口 ── */
function buildSolutions() {
  const { solutions } = SITE_DATA;
  document.getElementById('solutions-content').innerHTML = `
    <div class="solutions-head reveal">
      <p class="section-eyebrow">SOLUTIONS</p>
      <h2 class="section-title">为不同需求，提供合适的室内门方案</h2>
      <p class="solutions-sub">无论是家庭装修、工程配套还是渠道合作，我们都可根据空间、预算、数量与交付需求提供产品建议。</p>
    </div>
    <div class="solutions-grid">
      ${solutions.map((s, i) => `
        <a href="lianxiwomen/index.html" class="solution-card reveal reveal-delay-${i + 1}">
          <div class="solution-index">0${i + 1}</div>
          <div class="solution-audience">${s.audience}</div>
          <h3>${s.title}</h3>
          <p>${s.desc}</p>
          <div class="solution-points">
            ${s.points.map(p => `<span>${p}</span>`).join('')}
          </div>
          <div class="solution-cta">${s.cta}</div>
        </a>
      `).join('')}
    </div>
  `;
}

/* ── 产品 ── */
function buildProducts() {
  const { products } = SITE_DATA;
  // 分类标签
  document.getElementById('product-filter').innerHTML =
    SITE_DATA.productCategories.map((c,i) =>
      `<button class="filter-btn${i===0?' active':''}" data-cat="${c}">${c}</button>`
    ).join('');

  // 产品卡片
  renderProductCards(products);
}

function renderProductCards(list) {
  document.getElementById('products-grid').innerHTML = list.map((p, i) => `
    <a class="product-card reveal reveal-delay-${(i%3)+1}" data-series="${p.series}" href="product-center.html">
      <div class="product-placeholder" style="background: linear-gradient(135deg, ${p.accent}55 0%, ${p.accent}22 100%);">
        <div class="product-placeholder-icon">CH</div>
        <div class="product-placeholder-label">${p.series}</div>
      </div>
      <img src="${p.image}" alt="${p.name}" loading="lazy"
           onerror="this.style.display='none'">
      ${p.tag ? `<div class="product-badge">${p.tag}</div>` : ''}
      <div class="product-info">
        <div class="product-series">${p.series.toUpperCase()}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-price-row">
          <span class="product-price">${p.price}</span>
          <span class="product-enquire">立即咨询</span>
        </div>
      </div>
    </a>
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
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    const filtered = cat === '全部'
      ? SITE_DATA.products
      : SITE_DATA.products.filter(p => p.series === cat);
    renderProductCards(filtered);
  });
}

/* ── 优势板块 ── */
function buildAdvantages() {
  const { advantages } = SITE_DATA;
  document.getElementById('advantages-grid').innerHTML =
    advantages.map((a, i) => `
      <div class="advantage-item reveal reveal-delay-${i+1}">
        <div class="advantage-icon">${a.icon}</div>
        <div class="advantage-title">${a.title}</div>
        <div class="advantage-desc">${a.desc}</div>
      </div>
    `).join('');
}

/* ── 交付流程 ── */
function buildProcess() {
  const { process } = SITE_DATA;
  document.getElementById('process-grid').innerHTML = process.map((p, i) => `
    <div class="process-item reveal reveal-delay-${(i % 4) + 1}">
      <div class="process-step">${p.step}</div>
      <div class="process-body">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>
    </div>
  `).join('');
}

/* ── 关于我们 ── */
function buildAbout() {
  const { about } = SITE_DATA;
  const serviceScope = about.serviceScope || [];
  const targetClients = about.targetClients || [];
  const quickFacts = about.quickFacts || [];
  const proofPoints = about.proofPoints || [];

  document.getElementById('about-heading-area').innerHTML = `
    <div class="about-heading reveal">
      <p class="section-eyebrow">ABOUT CHUNHUI</p>
      <h2 class="section-title">${about.title}</h2>
      <div class="section-title-rule"></div>
      <div class="about-intro">
        <p class="about-lead">${about.lead || about.content}</p>
        <p class="about-content-body">${about.content}</p>
      </div>
      <div class="about-tags">
        ${serviceScope.map(item => `<span>${item}</span>`).join('')}
      </div>
      <div class="about-clients">
        <span>服务对象</span>
        ${targetClients.map(item => `<em>${item}</em>`).join('')}
      </div>
    </div>
  `;

  document.getElementById('about-img-area').innerHTML = `
    <div class="about-img-frame reveal">
      <div class="about-img-border"></div>
      <div class="about-img-wrap">
        <div class="about-img-placeholder">
          <span>匠</span>
          <small>春晖门业</small>
        </div>
        <img src="${about.image}" alt="春晖工厂" loading="lazy"
             style="position:absolute;inset:0;" onerror="this.style.display='none'">
      </div>
    </div>
  `;

  document.getElementById('about-text-area').innerHTML = `
    <div class="about-facts reveal reveal-delay-1">
      ${quickFacts.map(f => `
        <div class="about-fact">
          <strong>${f.value}</strong>
          <span>${f.label}</span>
          <small>${f.desc}</small>
        </div>
      `).join('')}
    </div>
    <div class="about-highlights reveal reveal-delay-1">
      ${about.highlights.map(h => `
        <div class="highlight-item">
          <div class="highlight-icon">${h.icon}</div>
          <div class="highlight-title">${h.title}</div>
          <div class="highlight-desc">${h.desc}</div>
        </div>
      `).join('')}
    </div>
    <div class="about-proof reveal reveal-delay-2">
      <div>
        <div class="about-proof-title">${about.proofTitle}</div>
        <ul>
          ${proofPoints.map(point => `<li>${point}</li>`).join('')}
        </ul>
      </div>
      <a class="about-proof-cta" href="${siteHref(about.ctaHref || 'lianxiwomen/index.html')}">${about.ctaText || '联系我们'}</a>
    </div>
  `;
}

/* ── 新闻动态 ── */
function buildNews() {
  const newsGrid = document.getElementById('news-grid');
  if (!newsGrid) return;
  const { news } = SITE_DATA;
  const [main, ...rest] = news;

  newsGrid.innerHTML = `
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
        <a href="#" class="news-link">阅读全文</a>
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
          <a href="#" class="news-link">阅读全文</a>
        </div>
      </div>
    `).join('')}
  `;
}

/* ── FAQ ── */
function buildFaq() {
  const { faqs } = SITE_DATA;
  document.getElementById('faq-list').innerHTML = faqs.map((f, i) => `
    <details class="faq-item reveal reveal-delay-${(i % 4) + 1}" ${i === 0 ? 'open' : ''}>
      <summary>${f.question}</summary>
      <p>${f.answer}</p>
    </details>
  `).join('');
}

/* ── CTA 横幅 ── */
function buildCtaBanner() {
  const { contact, company } = SITE_DATA;
  document.getElementById('cta-content').innerHTML = `
    <h2 class="cta-title">${contact.cta}</h2>
    <p class="cta-sub">${contact.ctaSub}</p>
    <div class="cta-btns">
      <a href="lianxiwomen/index.html" class="btn-white">在线预约</a>
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
        <div class="contact-icon-wrap">TEL</div>
        <div>
          <div class="contact-label">产品与工程咨询</div>
          <div class="contact-value big">${contact.salesPhone}</div>
        </div>
      </div>
      <div class="contact-item">
        <div class="contact-icon-wrap">MOB</div>
        <div>
          <div class="contact-label">移动电话</div>
          <div class="contact-value big">${contact.mobilePhone}</div>
        </div>
      </div>
      <div class="contact-item">
        <div class="contact-icon-wrap">MAIL</div>
        <div>
          <div class="contact-label">邮箱</div>
          <div class="contact-value contact-email-list">
            <a href="mailto:${company.email}">${company.email}</a>
            <a href="mailto:${company.secondaryEmail}">${company.secondaryEmail}</a>
          </div>
        </div>
      </div>
      <div class="contact-item">
        <div class="contact-icon-wrap">ADD</div>
        <div>
          <div class="contact-label">总部地址</div>
          <div class="contact-value">${company.address}</div>
        </div>
      </div>
      <div class="contact-item">
        <div class="contact-icon-wrap">TIME</div>
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
        ${nav.slice(1).map(n => `<a href="${siteHref(n.href)}">${n.label}</a>`).join('')}
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
  window.addEventListener('scroll', check, { passive: true });
  setTimeout(check, 200);
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
