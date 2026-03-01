#!/bin/bash
# 一键启动：终止已有 mkdocs serve → 在项目目录构建 → 启动 serve
# 保证始终在 PinHaotu-docs 目录下执行 build，避免构建到错误路径

# 切换到脚本所在目录（即 PinHaotu-docs 项目根）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || { echo "错误：无法进入目录 $SCRIPT_DIR"; exit 1; }

echo "项目目录: $SCRIPT_DIR"
echo ""

echo "正在终止已运行的 mkdocs serve（如有）..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
pkill -f "mkdocs serve" 2>/dev/null
sleep 1

# 从「源资源」目录恢复夜晚背景图（避免 docs 被同步/还原后 apng 丢失）
DST_DIR="docs/assets/images"
SRC_APNG=""
[ -f "night-bg-source/night-bg.apng" ] && SRC_APNG="night-bg-source/night-bg.apng"
[ -z "$SRC_APNG" ] && [ -f "night-bg-source/card-bg.apng" ] && SRC_APNG="night-bg-source/card-bg.apng"
if [ -n "$SRC_APNG" ]; then
  mkdir -p "$DST_DIR"
  cp "$SRC_APNG" "$DST_DIR/night-bg.apng"
  echo "已从 night-bg-source 复制夜晚背景图到 docs。"
fi

echo "正在构建 (mkdocs build)..."
if [ ! -f "mkdocs.yml" ]; then
  echo "错误：当前目录下未找到 mkdocs.yml，请确认在 PinHaotu-docs 目录运行本脚本。"
  read -n 1 -s -r -p "按任意键退出..."
  exit 1
fi

if [ -x "./venv/bin/mkdocs" ]; then
  ./venv/bin/mkdocs build
else
  echo "错误：未找到 ./venv/bin/mkdocs，请先在此目录创建虚拟环境并安装 mkdocs。"
  read -n 1 -s -r -p "按任意键退出..."
  exit 1
fi

if [ $? -ne 0 ]; then
  echo "构建失败，请检查上方错误信息。"
  read -n 1 -s -r -p "按任意键退出..."
  exit 1
fi

echo "构建完成。输出目录: $SCRIPT_DIR/site/"
echo ""
echo "正在启动 mkdocs serve..."
echo "请在浏览器打开: http://127.0.0.1:8000/"
echo "若样式未更新，请使用 强制刷新: Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac)"
echo "按 Ctrl+C 可停止服务。"
echo ""
exec ./venv/bin/mkdocs serve
