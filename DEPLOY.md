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

> `.us.kg` 域名由 DigitalPlatDev/FreeDomain 提供，其 DNS 本身就跑在 Cloudflare 上——
> 这正是它和 Cloudflare Pages 搭配「零配置」的原因。

1. 到 FreeDomain 注册入口（DigitalPlatDev/FreeDomain 仓库 README 会给出当前可用的申请门户，
   常见为 `https://freedomain.org`）申请一个二级域名，例如 `curtain.us.kg`。
   - 需先注册 FreeDomain 账号，搜索心仪前缀是否被占，提交后通常即时/几分钟生效。
2. 进入该域名的 **DNS 管理面板**，添加一条 **CNAME** 记录：
   - **类型**：`CNAME`
   - **名称 / 主机名**：`curtain`（即子域 `curtain.us.kg`；想用根域就填 `@` 或留空，视面板而定）
   - **目标 / 内容**：`curtain-showcase.pages.dev`（就是 Pages 给你的默认域名，**不要带 https://**）
   - **代理 / 橙色小云朵**：**开启**（走 Cloudflare CDN，免费加速 + 隐藏真实源站）
3. 保存后等 DNS 生效（几分钟，最长几十分钟）。可在本地验证：
   ```bash
   dig curtain.us.kg +short        # 应解析到 Cloudflare 的 IP（如 104.x / 172.x）
   # 或
   nslookup curtain.us.kg
   ```

## 第 5 步：在 Pages 绑定自定义域

两种方式任选其一：

**方式 A（仪表盘，推荐）**
Cloudflare 控制台 → `Workers & Pages` → `curtain-showcase` → `Custom domains`
→ 输入 `curtain.us.kg` → 添加。
因为域名本身就在 Cloudflare 上，所有权验证通常**自动通过**，几十秒到几分钟后状态变 `Active`，
即可用 `https://curtain.us.kg` 访问。

**方式 B（CLI，可放进脚本）**
本地已配好 `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` 后执行：
```bash
npx wrangler pages domain add curtain.us.kg --project-name=curtain-showcase
```
（前提是第 4 步的 CNAME 已生效，否则验证会失败。）

## 第 6 步：验证闭环

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://curtain.us.kg        # 期望 200
curl -sS -o /dev/null -w "%{http_code}\n" https://curtain.us.kg/admin/login  # SPA 回退，期望 200
```
浏览器打开 `https://curtain.us.kg` 应能正常渲染（不再白屏），后台用 `super@test.com` / `363935xhb` 登录可增删改查。

> **前置**：自定义域能访问的前提是 `curtain-showcase.pages.dev` 本身已能正常渲染。
> 若 `.pages.dev` 仍白屏，先回到「白屏排查」（详见已沉淀的 skill `cloudflare-pages-vite-deploy`），
> 域名绑了也只会把白屏搬过去。

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
