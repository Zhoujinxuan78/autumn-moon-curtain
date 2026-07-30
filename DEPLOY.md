# 部署指南 · Cloudflare Pages + FreeDomain（零成本闭环）

本项目是纯静态 SPA（Vite 构建到 `dist/`），唯一后端是 Supabase（已托管）。
前端部署 = 「免费静态托管（Cloudflare Pages）+ 免费域名（FreeDomain `.us.kg`）」。

仓库已内置：
- `wrangler.toml` —— Cloudflare Pages 项目配置（`name = curtain-showcase`，输出 `dist`）
- `.github/workflows/deploy.yml` —— push 到 `main` 自动 `npm install` → `build` → 部署到 Pages

---

## 第 1 步：准备 Cloudflare 凭证（写进 GitHub Secrets）

1. 登录 Cloudflare → 右侧头像下方复制 **Account ID**。
2. `My Profile → API Tokens → Create Token`：
   - 模板选 **Edit Cloudflare Workers**
   - 权限加一项：`Account → Cloudflare Pages → Edit`
   - 创建后复制 token。
3. 到 GitHub 仓库 `Settings → Secrets and variables → Actions → New repository secret`，添加：
   - `CLOUDFLARE_API_TOKEN` = 上面的 token
   - `CLOUDFLARE_ACCOUNT_ID` = 上面的 Account ID

## 第 2 步：把前端环境变量写进 GitHub Secrets

`VITE_` 前缀变量在**构建时**被 Vite 打进前端包，必须在 CI 里提供（不能只留本地 `.env`）。
在 GitHub Secrets 再添加以下 5 条（值取自本地 `.env`）：

| Secret 名 | 说明 |
|---|---|
| `VITE_SUPABASE_URL` | Supabase 项目 URL |
| `VITE_SUPABASE_ANON_KEY` | anon / publishable key |
| `VITE_SUPABASE_BUCKET` | 存储桶名（默认 `curtain-assets`） |
| `VITE_ADMIN_EMAIL` | 登录邮箱（仅展示用） |
| `VITE_ADMIN_PASSWORD` | 前端登录密码 |

> 改密码 = 更新这个 Secret + 重新跑一次部署（或本地改 `.env` 重启 dev server）。

## 第 3 步：推送即自动上线

把代码推到 `main` 分支：

```bash
git add -A
git commit -m "feat: ready for deploy"
git push origin main
```

GitHub Actions 会自动构建并部署到 Cloudflare Pages，产物在 `https://curtain-showcase.pages.dev`。
（也可在仓库 `Actions` 页手动 `Run workflow` 触发。）

## 第 4 步：FreeDomain 申请免费域名

1. 到 FreeDomain（DigitalPlatDev/FreeDomain）申请一个二级域名，例如 `curtain.us.kg`。
2. 在其 DNS 面板添加一条 **CNAME** 记录：
   - 主机名：`curtain`（或 `@`）
   - 目标：`curtain-showcase.pages.dev`
   - 代理/小云朵：开启（走 Cloudflare CDN，免费加速）

## 第 5 步：在 Pages 绑定自定义域

Cloudflare Pages 控制台 → `curtain-showcase` → `Custom domains` → 添加 `curtain.us.kg`。
由于域名本身就在 Cloudflare 上，验证通常自动完成，片刻后即可用自定义域名访问。

---

## 闭环总结

```
本地改代码 → git push main
   → GitHub Actions：npm install → npm run build（注入 VITE_ 变量）
   → wrangler pages deploy dist → Cloudflare Pages
   → curtain.us.kg（CNAME 指向 .pages.dev）对外访问
```

之后任何改动只需 `git push`，全自动零成本上线。

## 注意事项

- **管理员密码进前端包**：`VITE_ADMIN_PASSWORD` 会写进浏览器 JS，公开部署后任何人可查源码看到。
  私人项目可接受；若以后要公开，需换回带后端校验的登录方案。
- **`.us.kg` 稳定性**：免费二级域名偶有政策/可用性变数，长期生产请留意。
- 若改用 Vercel，已备好 `vercel.json`，删掉 `wrangler.toml` 并在 Vercel 导入仓库即可（环境变量同样需在 Vercel 后台配置）。
