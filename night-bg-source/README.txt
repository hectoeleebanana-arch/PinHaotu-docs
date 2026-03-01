请将夜晚背景图放在此目录下。

支持的文件名（任选其一）：
  - night-bg.apng（优先）
  - card-bg.apng（也会被用作夜晚背景图）

一键启动脚本会在每次构建前把该文件复制到 docs/assets/images/night-bg.apng，
这样即使 docs 被同步或还原，下次运行脚本也会自动恢复背景图。
