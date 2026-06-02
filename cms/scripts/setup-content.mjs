import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cmsRoot = resolve(__dirname, "..");
const siteRoot = resolve(cmsRoot, "..");
const adminEmail = process.env.ADMIN_EMAIL || "admin@chunhui.com";
const adminPassword = process.env.ADMIN_PASSWORD;
const directusUrl = process.env.PUBLIC_URL || "http://127.0.0.1:8055";

if (!adminPassword) {
  throw new Error("Set ADMIN_PASSWORD before running CMS content setup.");
}

const siteModule = await import(`file:///${resolve(siteRoot, "src/content/site.ts").replace(/\\/g, "/")}`);
const siteData = siteModule.siteData;

const server = spawn("npx directus start", {
  cwd: cmsRoot,
  env: process.env,
  shell: true,
  stdio: ["ignore", "pipe", "pipe"],
});

server.stdout.on("data", data => process.stdout.write(data));
server.stderr.on("data", data => process.stderr.write(data));

try {
  await waitForDirectus();
  const token = await login();

  await ensureCollection(token);
  await ensureField(token, {
    field: "title",
    type: "string",
    schema: {
      name: "title",
      data_type: "varchar",
      max_length: 255,
      is_nullable: true,
    },
    meta: {
      interface: "input",
      width: "full",
      note: "后台显示名称",
    },
  });
  await ensureField(token, {
    field: "content",
    type: "json",
    schema: {
      name: "content",
      data_type: "json",
      is_nullable: true,
    },
    meta: {
      interface: "input-code",
      options: {
        language: "json",
        lineWrapping: true,
      },
      width: "full",
      note: "网站内容 JSON。可以只填写需要覆盖的字段。",
    },
  });

  await upsertSiteContent(token);
  console.log("\nDirectus content is ready.");
} finally {
  server.kill();
}

async function waitForDirectus() {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${directusUrl}/server/health`);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }

    await delay(1000);
  }

  throw new Error("Timed out waiting for Directus to start.");
}

async function login() {
  const response = await fetch(`${directusUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword,
    }),
  });

  if (!response.ok) {
    throw new Error(`Directus login failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  return payload.data.access_token;
}

async function ensureCollection(token) {
  const exists = await fetch(`${directusUrl}/collections/site_content`, {
    headers: authHeaders(token),
  });

  if (exists.ok) return;

  const response = await fetch(`${directusUrl}/collections`, {
    method: "POST",
    headers: authHeaders(token, true),
    body: JSON.stringify({
      collection: "site_content",
      meta: {
        icon: "web",
        note: "春晖官网内容",
        singleton: false,
        display_template: "{{title}}",
      },
      schema: {
        name: "site_content",
      },
    }),
  });

  if (!response.ok && response.status !== 409) {
    throw new Error(`Creating collection failed: ${response.status} ${await response.text()}`);
  }
}

async function ensureField(token, field) {
  const exists = await fetch(`${directusUrl}/fields/site_content/${field.field}`, {
    headers: authHeaders(token),
  });

  if (exists.ok) return;

  const response = await fetch(`${directusUrl}/fields/site_content`, {
    method: "POST",
    headers: authHeaders(token, true),
    body: JSON.stringify(field),
  });

  if (!response.ok && response.status !== 409) {
    throw new Error(`Creating field ${field.field} failed: ${response.status} ${await response.text()}`);
  }
}

async function upsertSiteContent(token) {
  const current = await fetch(`${directusUrl}/items/site_content?limit=1`, {
    headers: authHeaders(token),
  });

  if (current.ok) {
    const payload = await current.json();
    const item = payload.data?.[0];

    if (item?.id) {
      await request(`${directusUrl}/items/site_content/${item.id}`, token, "PATCH", {
        title: "春晖官网主内容",
        content: siteData,
      });
      return;
    }
  }

  await request(`${directusUrl}/items/site_content`, token, "POST", {
    title: "春晖官网主内容",
    content: siteData,
  });
}

async function request(url, token, method, body) {
  const response = await fetch(url, {
    method,
    headers: authHeaders(token, true),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`${method} ${url} failed: ${response.status} ${await response.text()}`);
  }
}

function authHeaders(token, json = false) {
  return {
    Authorization: `Bearer ${token}`,
    ...(json ? { "Content-Type": "application/json" } : {}),
  };
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
