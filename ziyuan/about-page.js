document.addEventListener('DOMContentLoaded', () => {
  buildAboutTrustStrip();
  buildAboutScope();
  buildAboutProofList();
  buildAboutClients();
  buildAboutTimeline();
  buildAboutAnswers();
  buildAboutFooter();
});

function buildAboutTrustStrip() {
  const { company, about } = SITE_DATA;
  const facts = [
    { value: `${company.founded}年`, label: '成立时间', desc: '长期深耕室内门制造' },
    ...(about.quickFacts || []).slice(1),
    { value: '中山', label: '制造基地', desc: '服务华南及全国合作客户' },
  ];

  document.getElementById('about-trust-strip').innerHTML = facts.map((item) => `
    <article>
      <strong>${item.value}</strong>
      <span>${item.label}</span>
      <p>${item.desc}</p>
    </article>
  `).join('');
}

function buildAboutScope() {
  const items = [
    ['碳晶门', '适合现代家装、公寓和工程项目，表面耐磨易打理，风格克制。'],
    ['免漆门', '适合关注环保、效率和预算平衡的客户，维护成本低。'],
    ['生态门', '覆盖多种纹理与色系，适合年轻家居和批量选型。'],
    ['工程门', '面向酒店、公寓、精装项目，重点关注规格统一与交付节奏。'],
    ['实木烤漆门', '适合更重视质感、造型和高端家居氛围的空间。'],
    ['铝木门', '兼顾结构稳定、健康无漆和现代空间表达。'],
  ];

  document.getElementById('about-scope-grid').innerHTML = items.map(([title, desc], index) => `
    <article class="about-scope-card">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <h3>${title}</h3>
      <p>${desc}</p>
    </article>
  `).join('');
}

function buildAboutProofList() {
  const items = SITE_DATA.about.highlights || [];
  document.getElementById('about-proof-list').innerHTML = items.map((item) => `
    <article>
      <span>${item.icon}</span>
      <div>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </div>
    </article>
  `).join('');
}

function buildAboutClients() {
  const clients = [
    ['家装客户', '提供兼顾颜值、环保、预算、空间搭配与日常耐用的选门建议。'],
    ['工程客户', '支持数量、规格、交期、质检与分批交付等项目需求。'],
    ['酒店公寓', '支持统一风格、项目节点、后续补货与售后响应。'],
    ['经销商', '提供样品、图册、产品系列与长期稳定供货支持。'],
    ['装修公司', '配合方案沟通、项目选型与室内门产品配套。'],
  ];

  document.getElementById('about-client-grid').innerHTML = clients.map(([title, desc]) => `
    <article>
      <h3>${title}</h3>
      <p>${desc}</p>
    </article>
  `).join('');
}

function buildAboutTimeline() {
  const timeline = SITE_DATA.about.timeline || [];
  document.getElementById('about-timeline-list').innerHTML = timeline.map((item) => `
    <article>
      <span>${item.year}</span>
      <p>${item.event}</p>
    </article>
  `).join('');
}

function buildAboutAnswers() {
  const answers = [
    ['春晖门业主要做哪些门？', '春晖门业主营碳晶门、免漆门、生态门、工程门、实木烤漆门、铝木门和室内门定制，可覆盖家装、工程、酒店公寓、经销和装修公司配套需求。'],
    ['工程项目可以批量配套吗？', '可以。工程客户可以提供项目类型、数量、交付城市、风格和预算区间，春晖门业会根据产品系列、工艺配置和交付节点给出初步建议。'],
    ['经销商或装修公司适合合作吗？', '适合。春晖门业可围绕产品体系、样品、图册、供货周期和售后方式沟通长期合作，帮助渠道客户形成更清晰的销售方案。'],
  ];

  document.getElementById('about-answer-list').innerHTML = answers.map(([question, answer], index) => `
    <details ${index === 0 ? 'open' : ''}>
      <summary>
        <span>0${index + 1}</span>
        <strong>${question}</strong>
      </summary>
      <p>${answer}</p>
    </details>
  `).join('');
}

function buildAboutFooter() {
  const { company } = SITE_DATA;
  document.getElementById('about-page-footer').innerHTML = `
    <div>
      <strong>春晖门业</strong>
      <span>${company.name} · ${company.icp}</span>
    </div>
    <a href="../index.html">返回首页</a>
  `;
}
