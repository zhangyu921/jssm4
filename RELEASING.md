# 发布到 npm

推送以 `v` 开头的 tag（例如 `v2.0.1`）会触发 [npm-publish.yml](.github/workflows/npm-publish.yml)：先按 `.nvmrc` 跑测试与构建，再在 Node 22 上执行 `npm publish`。

## 本机操作（日常）

1. 在 `master`（或发版分支）上确认变更已合并。
2. 升级版本并打 tag（会生成一条 version commit）：

   ```bash
   npm version patch   # 或 minor / major
   git push origin master --follow-tags
   ```

   若不想自动生成 commit，可手改 `package.json` 的 `version` 后提交，再：

   ```bash
   git tag v$(node -p "require('./package.json').version")
   git push origin v$(node -p "require('./package.json').version")
   ```

3. **Tag 必须与 `package.json` 的 `version` 一致**（workflow 会校验，例如 tag `v2.0.1` 对应 version `2.0.1`）。

## 方式 A：OIDC Trusted Publisher（推荐）

无需长期保存 npm 发布 token。

1. 登录 [npmjs.com](https://www.npmjs.com/) → 进入包 **jssm4** → **Settings** → **Trusted publishing**。
2. 选择 **GitHub Actions**，填写仓库（如 `zhangyu921/jssm4`），**Workflow filename** 填：`npm-publish.yml`（与仓库内文件名一致）。
3. 保存。确认 GitHub 仓库 **未** 设置 `NPM_TOKEN` secret（或留空逻辑走 OIDC 的那条分支）。

要求见 [npm 文档：Trusted publishing](https://docs.npmjs.com/trusted-publishers)（含 Node / npm CLI 版本说明）。

## 方式 B：Automation token

1. npm 网站创建 **Granular access token** 或 **Automation token**（具备对该包的 **write**）。
2. 在 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions** 中新增 **`NPM_TOKEN`**。
3. 推送 tag 后，workflow 会使用 `NODE_AUTH_TOKEN` 发布。

配置 `NPM_TOKEN` 后，workflow 会在发布步骤导出 `NODE_AUTH_TOKEN`（走 token）；未配置时则不导出，由 npm 使用 Trusted Publisher（OIDC）。

## 发版后

- 在 GitHub 上为该 tag 写 **Release notes**（可选但建议）。
- 若已启用 Trusted Publisher，可按 npm 文档考虑收紧「仅允许 OIDC 发布、禁用 token 发布」。
