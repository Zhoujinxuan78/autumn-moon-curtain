# 免费域名 + 部署绑定指南

本项目零成本全家桶：**Vue 3 + Vite + Tailwind + Vant + Supabase + Vercel/Cloudflare Pages**。
下面是申请免费域名并把本项目上线、绑定自己域名的步骤。

## 一、申请免费域名（FreeDomain / DigitalPlat）

> 仓库：https://github.com/DigitalPlatDev/FreeDomain
> 免费后缀示例：`.us.kg`、`.xx.kg`、`.qzz.io`、`.dpdns.org`、`.qd.je`（以官网当前可注册列表为准）

1. 打开 FreeDomain 官网/控制台，注册并登录。
2. 搜索你想要的二级域名，例如 `curtain-showcase.us.kg`，提交申请。
3. 按提示完成验证（通常绑定 GitHub 账号或邮箱验证）。
4. **FreeDomain 只支持「注册 + 外部 NS 委派」**，不支持直接在它那里改 DNS 解析记录。
   也就是说：域名到手后，你需要把它的 **Nameserver（NS）** 指向你自己的 DNS 服务商（推荐 Cloudflare）。

## 二、把域名交给 Cloudflare 管理（推荐，Vercel / Pages 都通用）

1. 注册 https://cloudflare.com，进入 **Websites → Add a Site**，填入你的免费域名。
2. Cloudflare 会给你两组 NS（如 `xxx.ns.cloudflare.com` / `yyy.ns.cloudflare.com`）。
3. 回到 FreeDomain 控制台，把该域名的 Nameserver 改成 Cloudflare 给的这两组，保存。
4. 等 5~30 分钟 NS 生效，Cloudflare 显示 **Active**。

## 三、绑定到部署平台

### 方案 A：Vercel
1. 在 Vercel 导入本仓库 GitHub 仓库，Framework 选 Vite，构建命令 `npm run build`，输出目录 `dist`。
2. 项目设置 → **Domains**，添加你的免费域名（如 `curtain-showcase.us.kg`）。
3. 由于 FreeDomain 只支持 NS 委派，最稳妥做法：在 Cloudflare 里加一条 **CNAME** 记录，
   名称 `@` 和 `www`，指向 Vercel 给你的 `.vercel.app` 地址，并开启橙色云（Proxy）。
   （Vercel 的 TXT 验证记录也在 Cloudflare 里添加即可。）

### 方案 B：Cloudflare Pages
1. 本仓库已包含 `.github/workflows/deploy-cloudflare.yml`，推送 `main` 分支即自动部署。
2. Cloudflare Pages 控制台创建项目，关联 GitHub 仓库；在 **Custom domains** 添加免费域名。
3. 在 Cloudflare DNS 中自动生成/确认一条 CNAME 指向 `*.pages.dev` 即可。
4. 部署所需的环境变量（`VITE_SUPABASE_URL` 等）在仓库 **Settings → Secrets** 中配置，
   对应 GitHub Actions 的 `secrets.*`。

## 四、上线前置检查

- 已在 Supabase 执行 `supabase/migrations/0001_init.sql`。
- 已复制 `.env.example` 为 `.env` 并填入真实 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`。
- 已在 Supabase Storage 创建 `curtain-assets` 公共桶（脚本里已含 INSERT）。
- 首个注册账号默认是普通用户，需用 SQL 将其提升为 `super_admin`（见后台首页提示）。

> 提示：免费域名偶尔有政策变动，具体可注册后缀与控制台入口以 FreeDomain 官方仓库/README 为准。
