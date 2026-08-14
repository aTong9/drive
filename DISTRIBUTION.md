# RoadLens Planner 分发指南

## Chrome PWA

生产构建会自动生成 Web App Manifest 与 Service Worker。GitHub Pages 发布完成后，在 Chrome 打开站点，通过地址栏的“安装”按钮即可作为独立应用安装。

```bash
npm run build
npm run dev
```

PWA 的离线缓存包含应用外壳与本地路线目录。高德地图、天气和地点图片依赖在线服务，离线时不会更新。

## Electron 本地开发

```bash
npm run dev:electron
```

命令会同时启动 Vite 开发服务器和 Electron 窗口。桌面端继续使用浏览器兼容的本地存储，因此计划、项目和核验数据保存在当前系统用户的 Electron 应用数据目录中。

## 本机打包

在对应操作系统运行：

```bash
npm run package:mac
npm run package:win
npm run package:linux
```

生成文件位于 `release/`。未配置开发者证书时，安装包不会进行 Apple notarization 或 Windows 代码签名，系统可能显示未知开发者提示。

## GitHub Releases

推送 `v` 开头的版本标签后，`.github/workflows/release-electron.yml` 会在 macOS、Windows 和 Linux 上分别打包，并把安装文件上传到该标签对应的 GitHub Release：

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub 仓库的 Actions secrets 中可配置 `AMAP_KEY` 和 `AMAP_SECURITY_CODE`。正式公开分发前还应配置平台签名证书；签名信息不得提交到仓库。
