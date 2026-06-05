document.addEventListener('DOMContentLoaded', () => {
  buildFeaturedNews();
  buildJournalFilter();
  renderJournalNews('全部');
  buildCaseGrid();
  buildTopicList();
  buildFaqList();
  buildJournalFooter();
});

function resolveAsset(path) {
  if (path.startsWith('ziyuan/') || path.startsWith('xinwendongtai/') || path.startsWith('chanpinzhanshi/')) {
    return `../${path}`;
  }
  return path;
}

function buildFeaturedNews() {
  const item = SITE_DATA.news[0];
  document.getElementById('journal-featured-card').innerHTML = `
    <article class="journal-feature-card">
      <div class="journal-feature-image">
        <img src="${resolveAsset(item.image)}" alt="${item.title}">
      </div>
      <div class="journal-feature-body">
        <span>${item.category} · ${item.date}</span>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <a href="../lianxiwomen/index.html" aria-label="咨询与${item.title}相关的产品">咨询相关产品</a>
      </div>
    </article>
  `;
}

function buildJournalFilter() {
  const categories = Array.from(new Set([
    ...(SITE_DATA.newsCategories || []),
    ...SITE_DATA.news.map((item) => item.category),
  ]));

  document.getElementById('journal-filter').innerHTML = categories.map((category, index) => `
    <button class="journal-filter-btn${index === 0 ? ' active' : ''}" data-category="${category}">${category}</button>
  `).join('');

  document.getElementById('journal-filter').addEventListener('click', (event) => {
    const button = event.target.closest('.journal-filter-btn');
    if (!button) return;
    document.querySelectorAll('.journal-filter-btn').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    renderJournalNews(button.dataset.category);
  });
}

function renderJournalNews(category) {
  const source = category === '全部'
    ? SITE_DATA.news
    : SITE_DATA.news.filter((item) => item.category === category);
  const list = source.length ? source : SITE_DATA.news;

  document.getElementById('journal-news-grid').innerHTML = list.map((item) => `
    <article class="journal-news-card">
      <div class="journal-news-image">
        <img src="${resolveAsset(item.image)}" alt="${item.title}">
      </div>
      <div class="journal-news-body">
        <div class="journal-news-meta">
          <span>${item.category}</span>
          <time>${item.date}</time>
        </div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <a class="journal-card-link" href="../lianxiwomen/index.html" aria-label="咨询${item.title}相关内容">咨询相关产品</a>
      </div>
    </article>
  `).join('');
}

function buildCaseGrid() {
  document.getElementById('journal-case-grid').innerHTML = SITE_DATA.caseStudies.map((item) => `
    <article class="journal-case-card">
      <div class="journal-case-image">
        <img src="${resolveAsset(item.image)}" alt="${item.title}">
      </div>
      <div class="journal-case-body">
        <span>${item.type} · ${item.scene}</span>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div>
          ${item.tags.map((tag) => `<small>${tag}</small>`).join('')}
        </div>
        <a class="journal-card-link" href="../lianxiwomen/index.html" aria-label="咨询${item.title}案例合作">咨询类似项目</a>
      </div>
    </article>
  `).join('');
}

function buildTopicList() {
  document.getElementById('journal-topic-list').innerHTML = SITE_DATA.contentTopics.map((item, index) => `
    <article class="journal-topic-item">
      <span>0${index + 1}</span>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    </article>
  `).join('');
}

function buildFaqList() {
  const target = document.getElementById('journal-faq-list');
  if (!target || !SITE_DATA.faqs) return;

  target.innerHTML = SITE_DATA.faqs.map((item, index) => `
    <details class="journal-faq-item"${index === 0 ? ' open' : ''}>
      <summary>
        <span>${String(index + 1).padStart(2, '0')}</span>
        <strong>${item.question}</strong>
      </summary>
      <p>${item.answer}</p>
    </details>
  `).join('');
}

function buildJournalFooter() {
  const { company } = SITE_DATA;
  document.getElementById('journal-footer').innerHTML = `
    <div>
      <strong>春晖门业新闻中心</strong>
      <span>${company.name} · ${company.icp}</span>
    </div>
    <a href="../index.html">返回首页</a>
  `;
}
