# Headless CMS 接入说明

这个项目现在有一个 CMS 数据入口：`src/content/cms.ts`。

默认没有配置 CMS 时，网站继续读取 `src/content/site.ts`。配置 `CHUNHUI_CMS_CONTENT_URL` 后，前端会优先从 Headless CMS 接口读取内容，接口不可用时自动回退本地内容，网站不会白屏。

## 当前本地 CMS

已经安装了 Directus 本地后台：

```text
后台地址：http://127.0.0.1:8055/admin
账号：admin@chunhui.com
密码：通过本地环境变量 ADMIN_PASSWORD 设置
```

启动 CMS：

```bash
npm run cms:dev
```

前端已经通过 `.env.local` 指向 Directus：

```env
CHUNHUI_CMS_CONTENT_URL=http://127.0.0.1:8055/items/site_content?fields=content&limit=1
CHUNHUI_CMS_REVALIDATE_SECONDS=0
CHUNHUI_STATIC_EXPORT=false
```

打开 Directus 后，在 `site_content` 集合里编辑“春晖官网主内容”的 `content` JSON 字段即可更新前台内容。

注意：当前为了适配这台机器的 Node 24 环境，安装的是 Directus 9.26.0。这个版本适合本地开发和内容验证；正式生产建议换 Node 22 后升级到 Directus 最新版，或部署在支持 Directus 最新版的服务器上。

## 推荐 CMS 内容模型

第一版建议在 Strapi、Directus、Sanity 或其他 Headless CMS 里建一个单例内容：

```text
名称：site-content
字段：content
类型：JSON
```

`content` 里放网站内容，可以是完整 `SiteData`，也可以只放需要覆盖的部分。例如只改联系电话：

```json
{
  "company": {
    "phone": "0760-8820 3678"
  },
  "contact": {
    "salesPhone": "0760-8820 3678"
  }
}
```

## 接口返回格式

前端支持这些常见格式：

```json
{
  "company": {},
  "products": [],
  "news": []
}
```

```json
{
  "data": {
    "content": {
      "company": {},
      "products": []
    }
  }
}
```

```json
{
  "data": {
    "attributes": {
      "content": {
        "company": {},
        "products": []
      }
    }
  }
}
```

## 环境变量

复制 `.env.example` 为 `.env.local`，然后填写：

```env
CHUNHUI_CMS_CONTENT_URL=https://cms.example.com/api/site-content
CHUNHUI_CMS_API_TOKEN=你的只读 API Token
CHUNHUI_CMS_REVALIDATE_SECONDS=60
CHUNHUI_STATIC_EXPORT=false
```

如果希望后台保存后尽快在前台看到，设置：

```env
CHUNHUI_CMS_REVALIDATE_SECONDS=0
CHUNHUI_STATIC_EXPORT=false
```

如果仍然要纯静态部署，设置：

```env
CHUNHUI_STATIC_EXPORT=true
```

纯静态部署下，CMS 内容会在 `next build` 时写入页面，后台更新后需要重新构建发布。

## 图片字段

图片字段可以继续使用站内路径：

```json
"image": "chanpinzhanshi/wuqimen/shengtaimen/国潮墨影系曲美101-烟熏柚木1_1.jpg"
```

也可以使用 CMS 上传后的完整 URL：

```json
"image": "https://cms.example.com/uploads/product.jpg"
```
