# 安装教程

<div class="pinhaotu-highlight-box">

【重要】 使用本插件时请确保在科学上网（挂 VPN）环境下，能正常浏览 Pinterest 网站即可正常使用。

</div>

## 一、环境要求

- 使用 Chromium 内核的浏览器（如 Google Chrome、Microsoft Edge、Brave 等）
- 已安装并可正常访问 Pinterest 网站（需科学上网/挂 VPN 时请先配置好）

## 二、安装步骤（开发者模式加载）

1. 解压或复制本发布包中的「Extension」文件夹到任意位置（路径中尽量无中文、无空格）。
2. 打开浏览器，在地址栏输入并回车：  
   - 若是用 Chrome 浏览器：`chrome://extensions/`  
   - 若是用 Edge 浏览器：`edge://extensions/`
3. 打开「开发者模式」开关。  
   - Chrome：在页面右上角。  
   - Edge：在页面左侧底部。
4. 点击「加载已解压的扩展程序」（Chrome）或「加载解压缩的扩展」（Edge）。
5. 在弹窗中选中刚才的「Extension」文件夹，直接点击「选择文件夹」或「选择」即可。
6. 若未报错，扩展列表中出现「Pin好图」即安装成功。可将扩展固定到工具栏以便使用。

### 更新已有版本（重要）

1. 解压新发布包，用其中的「Extension」文件夹覆盖原安装位置下的同名文件夹（或先删除旧 Extension，再放入新解压的 Extension 到同一路径）。
2. 打开 `chrome://extensions/` 或 `edge://extensions/`，找到 Pin好图，点击扩展卡片上的「刷新」图标即可生效。

**如何找到已安装插件的位置（更新前需确认 Extension 所在路径）**

- **Chrome**：打开 `chrome://extensions/` → 找到 Pin好图 → 点「详细」，下滑找到「来源」中的「加载来源：」即可找到安装路径。
- **Edge**：打开 `edge://extensions/` → 找到 Pin好图 → 点「详细信息」，在「来源」中找到「加载位置」即可找到安装路径。

<div class="pinhaotu-highlight-box">

按上述方式更新时，已保存的 API key 会保留，无需重新输入。

请勿先移除扩展再重新加载其他文件夹，否则会视为新扩展，已保存的密钥与设置会丢失。

</div>

## 三、侧边栏使用方式（推荐）

- 在扩展列表中找到 Pin好图，点击其右侧的「侧边栏」图标，或
- 在 Pinterest 页面按需打开侧边栏后选择 Pin好图。  

侧边栏会常驻在 Pinterest 页面一侧，无需每次弹窗。

## 四、首次使用前必做

- 在插件中点击「API key」展开，点击「申请密钥」旁的 ? 可查看获取教程。
- 在 Google AI Studio 申请 Gemini API 密钥后，粘贴到输入框并点击「保存」。
- 密钥仅存于本机，不会上传。

## 五、若安装后无法使用

- 确认「开发者模式」已开启且扩展已启用。
- 确认在 Pinterest 域名下使用（如 <https://www.pinterest.com/>）。
- 若提示权限或网络错误，请检查浏览器是否允许扩展访问相应网站。

