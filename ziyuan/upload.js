const UPLOAD_ENDPOINT = "";
const AUTH_KEY = "chunhui_admin_auth";
const DRAFT_KEY = "chunhui_admin_content_draft";
const ACTIVITY_KEY = "chunhui_admin_activity";
const PREVIEW_KEY = "chunhui_product_preview";
const DEMO_PASSWORD = window.CHUNHUI_ADMIN_DEMO_PASSWORD || "";

const loginView = document.getElementById("admin-login");
const appView = document.getElementById("admin-app");
const loginForm = document.getElementById("admin-login-form");
const loginError = document.getElementById("admin-login-error");
const statusText = document.getElementById("upload-status");
const productForm = document.getElementById("product-upload-form");
const imageInput = document.getElementById("product-images");
const fileInput = document.getElementById("product-files");
const imagePreview = document.getElementById("image-preview");
const fileList = document.getElementById("file-list");
const jsonOutput = document.getElementById("json-output");
const previewImage = document.getElementById("preview-main-image");
const previewCategory = document.getElementById("preview-category");
const previewName = document.getElementById("preview-name");
const previewSummary = document.getElementById("preview-summary");
const previewTags = document.getElementById("preview-tags");
const activityList = document.getElementById("admin-activity");

let productImages = [];
let productFiles = [];

function initAdmin() {
  if (localStorage.getItem(AUTH_KEY) === "1") showApp();

  loginForm?.addEventListener("submit", handleLogin);
  document.getElementById("admin-logout")?.addEventListener("click", logout);
  document.getElementById("admin-export")?.addEventListener("click", exportAllData);

  document.querySelectorAll("[data-admin-tab]").forEach(button => {
    button.addEventListener("click", () => switchTab(button.dataset.adminTab));
  });

  productForm?.addEventListener("input", () => {
    updateProductPreview();
    updateStatus("编辑中");
  });

  imageInput?.addEventListener("change", event => {
    productImages = [...event.target.files];
    renderImagePreview();
    updateStatus("图片已选择");
  });

  fileInput?.addEventListener("change", event => {
    productFiles = [...event.target.files];
    renderFileList();
    updateStatus("附件已选择");
  });

  document.querySelectorAll(".admin-content-form").forEach(form => {
    form.addEventListener("input", () => updateStatus("编辑中"));
  });

  document.getElementById("save-draft")?.addEventListener("click", saveDraft);
  document.getElementById("generate-json")?.addEventListener("click", generateJson);
  document.getElementById("preview-product")?.addEventListener("click", openProductPreview);
  document.getElementById("download-json")?.addEventListener("click", downloadJson);
  document.getElementById("publish-current")?.addEventListener("click", publishCurrent);
  document.getElementById("reset-current")?.addEventListener("click", resetCurrentTab);
  document.getElementById("copy-json")?.addEventListener("click", copyJson);

  setupDropzones();
  loadDraft();
  renderActivity();
  updateProductPreview();
}

function handleLogin(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(loginForm).entries());

  if (data.username === "admin" && DEMO_PASSWORD && data.password === DEMO_PASSWORD) {
    localStorage.setItem(AUTH_KEY, "1");
    loginError.textContent = "";
    showApp();
    addActivity("登录后台", "内容管理员进入后台工作台");
    return;
  }

  loginError.textContent = "账号或密码不正确。";
}

function showApp() {
  if (loginView) loginView.hidden = true;
  if (appView) appView.hidden = false;
  renderActivity();
  updateStatus("已登录");
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  if (appView) appView.hidden = true;
  if (loginView) loginView.hidden = false;
  loginForm?.reset();
}

function switchTab(tab) {
  document.querySelectorAll(".admin-menu button").forEach(button => {
    button.classList.toggle("active", button.dataset.adminTab === tab);
  });
  document.querySelectorAll(".admin-tab").forEach(panel => {
    panel.classList.toggle("active", panel.id === `tab-${tab}`);
  });
  updateStatus(`正在编辑${getTabLabel(tab)}`);
}

function getActiveTab() {
  const panel = document.querySelector(".admin-tab.active");
  return panel ? panel.id.replace("tab-", "") : "overview";
}

function getTabLabel(tab = getActiveTab()) {
  const map = {
    overview: "工作台",
    home: "首页内容",
    products: "产品",
    news: "新闻",
    about: "关于春晖",
    join: "招商加盟",
    contact: "联系方式",
  };
  return map[tab] || tab;
}

function updateStatus(text) {
  if (statusText) statusText.textContent = text;
}

function collectForm(form) {
  if (!form) return {};
  const data = {};
  new FormData(form).forEach((value, key) => {
    if (value instanceof File) return;
    data[key] = value;
  });
  return data;
}

function setFormValues(form, values = {}) {
  if (!form) return;
  Object.entries(values).forEach(([key, value]) => {
    const field = form.elements[key];
    if (!field || value === null || typeof value === "object") return;
    field.value = value;
  });
}

function getProductData() {
  const data = collectForm(productForm);
  return {
    id: data.model || `product-${Date.now()}`,
    name: data.name || "",
    model: data.model || "",
    category: data.category || "",
    series: data.series || "",
    material: data.material || "",
    price: data.price || "询价定制",
    status: data.status || "草稿",
    sort: data.sort ? Number(data.sort) : null,
    tags: splitTags(data.tags),
    summary: data.summary || "",
    detail: data.detail || "",
    specs: {
      height: data.height || "",
      width: data.width || "",
      thickness: data.thickness || "",
      space: data.space || "",
    },
    assets: {
      images: productImages.map(file => file.name),
      files: productFiles.map(file => file.name),
    },
    updatedAt: new Date().toISOString(),
  };
}

function getContentData() {
  const result = {
    home: collectForm(document.querySelector('[data-content-form="home"]')),
    news: collectForm(document.querySelector('[data-content-form="news"]')),
    about: collectForm(document.querySelector('[data-content-form="about"]')),
    join: collectForm(document.querySelector('[data-content-form="join"]')),
    contact: collectForm(document.querySelector('[data-content-form="contact"]')),
    product: getProductData(),
    updatedAt: new Date().toISOString(),
  };
  return result;
}

function getCurrentData() {
  const tab = getActiveTab();
  if (tab === "products") return { type: "product", data: getProductData() };
  const form = document.querySelector(`#tab-${tab} .admin-content-form`);
  if (form) return { type: tab, data: collectForm(form) };
  return { type: "all", data: getContentData() };
}

function splitTags(value = "") {
  return value
    .split(/[,，]/)
    .map(item => item.trim())
    .filter(Boolean);
}

function updateProductPreview() {
  if (!productForm) return;
  const data = getProductData();
  previewCategory.textContent = data.category || "未选择品类";
  previewName.textContent = data.name || "产品名称";
  previewSummary.textContent = data.summary || "填写短描述后，这里会同步显示产品卖点。";
  previewTags.innerHTML = data.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("");
}

function renderImagePreview() {
  imagePreview.innerHTML = "";
  previewImage.innerHTML = "<span>主图预览</span>";

  productImages.forEach((file, index) => {
    const url = URL.createObjectURL(file);
    const item = document.createElement("figure");
    item.innerHTML = `
      <img src="${url}" alt="${escapeHtml(file.name)}">
      <figcaption>${index === 0 ? "主图" : `图${index + 1}`}</figcaption>
    `;
    imagePreview.appendChild(item);

    if (index === 0) {
      previewImage.innerHTML = `<img src="${url}" alt="${escapeHtml(file.name)}">`;
    }
  });
}

function renderFileList() {
  fileList.innerHTML = productFiles.map(file => `
    <li>
      <span>${escapeHtml(file.name)}</span>
      <small>${formatSize(file.size)}</small>
    </li>
  `).join("");
}

function formatSize(size) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function generateJson() {
  const payload = getCurrentData();
  jsonOutput.value = JSON.stringify(payload, null, 2);
  updateStatus(`${getTabLabel()}数据已生成`);
  return payload;
}

function saveDraft() {
  const data = getContentData();
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  addActivity("保存草稿", `已保存${getTabLabel()}草稿`);
  updateStatus("草稿已保存");
}

function loadDraft() {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    setFormValues(document.querySelector('[data-content-form="home"]'), data.home);
    setFormValues(document.querySelector('[data-content-form="news"]'), data.news);
    setFormValues(document.querySelector('[data-content-form="about"]'), data.about);
    setFormValues(document.querySelector('[data-content-form="join"]'), data.join);
    setFormValues(document.querySelector('[data-content-form="contact"]'), data.contact);
    setProductTextValues(data.product);
    updateProductPreview();
  } catch {
    localStorage.removeItem(DRAFT_KEY);
  }
}

function setProductTextValues(product = {}) {
  if (!productForm) return;
  const flat = {
    ...product,
    height: product.specs?.height || "",
    width: product.specs?.width || "",
    thickness: product.specs?.thickness || "",
    space: product.specs?.space || "",
    tags: (product.tags || []).join(","),
  };
  setFormValues(productForm, flat);
}

function downloadJson() {
  const payload = jsonOutput.value ? JSON.parse(jsonOutput.value) : generateJson();
  const fileName = `${payload.type || "content"}-${new Date().toISOString().slice(0, 10)}.json`;
  downloadObject(payload, fileName);
  updateStatus("数据已下载");
}

function exportAllData() {
  const data = getContentData();
  downloadObject(data, `chunhui-content-${new Date().toISOString().slice(0, 10)}.json`);
  addActivity("导出数据", "已导出全站内容数据");
  updateStatus("全站内容已导出");
}

function downloadObject(data, fileName) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName.replace(/[\\/:*?"<>|]/g, "_");
  link.click();
  URL.revokeObjectURL(url);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function openProductPreview() {
  switchTab("products");
  if (!productForm.reportValidity()) return;

  const product = getProductData();
  const images = [];

  for (const file of productImages.slice(0, 6)) {
    images.push({
      name: file.name,
      src: await readFileAsDataUrl(file),
    });
  }

  const payload = {
    ...product,
    previewImages: images,
    previewedAt: new Date().toISOString(),
  };

  try {
    sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(payload));
    updateStatus("预览已生成");
    window.open("product-preview.html", "_blank");
  } catch {
    alert("图片文件较大，浏览器无法保存预览数据。请先选择较小的图片，或只保留一张主图后再预览。");
  }
}

async function publishCurrent() {
  const payload = getCurrentData();
  jsonOutput.value = JSON.stringify(payload, null, 2);

  if (!UPLOAD_ENDPOINT) {
    addActivity("模拟发布", `${getTabLabel()}已生成发布数据`);
    updateStatus("等待后台接口接入");
    alert("当前是前端演示：内容已经整理成数据。接入后端后，这个按钮会真正保存到数据库并发布到官网。");
    return;
  }

  const response = await fetch(UPLOAD_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("发布失败");
  addActivity("发布成功", `${getTabLabel()}已发布`);
  updateStatus("发布成功");
}

function resetCurrentTab() {
  const tab = getActiveTab();
  if (tab === "products") {
    productForm.reset();
    productImages = [];
    productFiles = [];
    imagePreview.innerHTML = "";
    fileList.innerHTML = "";
    previewImage.innerHTML = "<span>主图预览</span>";
    updateProductPreview();
  } else {
    document.querySelector(`#tab-${tab} form`)?.reset();
    document.querySelectorAll(`#tab-${tab} .admin-form-preview`).forEach(el => el.innerHTML = "");
  }
  jsonOutput.value = "";
  updateStatus("当前页已清空");
}

async function copyJson() {
  const value = jsonOutput.value || JSON.stringify(generateJson(), null, 2);
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    jsonOutput.select();
    document.execCommand("copy");
  }
  updateStatus("数据已复制");
}

function setupDropzones() {
  document.querySelectorAll(".upload-dropzone").forEach(zone => {
    const input = zone.querySelector("input[type='file']");
    if (!input) return;

    ["dragenter", "dragover"].forEach(eventName => {
      zone.addEventListener(eventName, event => {
        event.preventDefault();
        zone.classList.add("dragging");
      });
    });

    ["dragleave", "drop"].forEach(eventName => {
      zone.addEventListener(eventName, event => {
        event.preventDefault();
        zone.classList.remove("dragging");
      });
    });

    zone.addEventListener("drop", event => {
      input.files = event.dataTransfer.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    input.addEventListener("change", () => {
      if (!zone.classList.contains("admin-dropzone")) return;
      renderGenericImagePreview(input, zone.parentElement.querySelector(".admin-form-preview"));
      updateStatus("图片已选择");
    });
  });
}

function renderGenericImagePreview(input, target) {
  if (!target) return;
  target.innerHTML = "";

  [...input.files].slice(0, 4).forEach((file, index) => {
    const url = URL.createObjectURL(file);
    const item = document.createElement("figure");
    item.innerHTML = `
      <img src="${url}" alt="${escapeHtml(file.name)}">
      <figcaption>${index === 0 ? "封面" : `图${index + 1}`}</figcaption>
    `;
    target.appendChild(item);
  });
}

function addActivity(title, desc) {
  const logs = getActivity();
  logs.unshift({
    title,
    desc,
    time: new Date().toLocaleString("zh-CN", { hour12: false }),
  });
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(logs.slice(0, 8)));
  renderActivity();
}

function getActivity() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || [];
  } catch {
    return [];
  }
}

function renderActivity() {
  if (!activityList) return;
  const logs = getActivity();
  activityList.innerHTML = logs.length
    ? logs.map(log => `
      <li>
        <strong>${escapeHtml(log.title)}</strong>
        <span>${escapeHtml(log.desc)}</span>
        <small>${escapeHtml(log.time)}</small>
      </li>
    `).join("")
    : `<li><strong>暂无记录</strong><span>保存草稿或发布内容后会显示在这里。</span><small>--</small></li>`;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

initAdmin();
