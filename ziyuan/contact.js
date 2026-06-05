document.addEventListener('DOMContentLoaded', () => {
  buildContactIntent();
  buildContactDetails();
  buildContactResponse();
  buildContactFooter();
  initContactForm();
});

function buildContactIntent() {
  const items = [
    {
      title: '家装选门',
      desc: '适合新房装修、旧房翻新、全屋门定制，重点沟通风格、预算、环保和交付时间。',
      meta: '碳晶门 / 免漆门 / 生态门',
    },
    {
      title: '工程配套',
      desc: '适合酒店、公寓、精装房、批量项目，重点沟通数量、交期、规格和稳定供货。',
      meta: '工程门 / 批量交付',
    },
    {
      title: '渠道合作',
      desc: '适合经销商、装修公司、设计师渠道，重点沟通产品体系、样品、图册和长期供货。',
      meta: '经销 / 装企 / 样品支持',
    },
  ];

  document.getElementById('contact-intent-grid').innerHTML = items.map((item, index) => `
    <a href="#inquiry" class="contact-intent-card">
      <span>0${index + 1}</span>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
      <small>${item.meta}</small>
    </a>
  `).join('');
}

function buildContactDetails() {
  const { company, contact } = SITE_DATA;
  const details = [
    ['产品与工程咨询', contact.salesPhone],
    ['移动电话', contact.mobilePhone],
    ['邮箱 1', company.email],
    ['邮箱 2', company.secondaryEmail],
    ['微信', company.wechat],
    ['联系人', contact.contactPerson],
    ['服务时间', contact.workHours],
  ];

  document.getElementById('contact-detail-list').innerHTML = details.map(([label, value]) => `
    <div class="contact-detail-item">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join('');

  document.getElementById('contact-address-text').textContent = company.address;
}

function buildContactResponse() {
  const steps = [
    ['01', '确认需求', '先确认产品类型、客户类型、数量、城市与交付时间。'],
    ['02', '初步建议', '根据家装、工程或渠道需求，推荐对应产品系列与配置方向。'],
    ['03', '报价沟通', '结合尺寸、工艺、数量、五金和物流信息，进一步沟通报价。'],
    ['04', '样品与资料', '如需经销或工程合作，可进一步沟通图册、样品和项目资料。'],
  ];

  document.getElementById('contact-response-grid').innerHTML = steps.map(([num, title, desc]) => `
    <div class="contact-response-item">
      <span>${num}</span>
      <h3>${title}</h3>
      <p>${desc}</p>
    </div>
  `).join('');
}

function buildContactFooter() {
  const { company } = SITE_DATA;
  document.getElementById('contact-footer').innerHTML = `
    <div>
      <strong>春晖门业</strong>
      <span>${company.name} · ${company.icp}</span>
    </div>
    <a href="../index.html">返回首页</a>
  `;
}

function initContactForm() {
  const form = document.getElementById('contact-inquiry-form');
  const button = document.getElementById('contact-submit');
  const status = document.getElementById('contact-form-status');
  const defaultText = button.textContent;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    button.disabled = true;
    button.textContent = '正在提交，请稍候...';
    status.textContent = '';
    status.className = 'form-status';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json',
        },
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || '提交失败');
      }

      form.reset();
      button.classList.add('is-submitted');
      status.textContent = '询盘已发送，销售将尽快与您联系。';
      status.classList.add('is-success');
    } catch (error) {
      status.textContent = '提交未成功，请稍后重试，或直接拨打 0760-8820 3678。';
      status.classList.add('is-error');
    } finally {
      button.textContent = defaultText;
      button.disabled = false;
    }
  });
}
