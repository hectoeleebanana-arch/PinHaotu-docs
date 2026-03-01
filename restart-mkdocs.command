#!/bin/bash
# 一键启动 MkDocs：先 cd 到脚本所在目录，再执行 restart-mkdocs.sh
# 双击 .command 时 Finder 可能不会把该目录当作工作目录，因此必须显式 cd

cd "$(dirname "$0")" || exit 1

# 设置本窗口标题，便于下次启动时只关「旧窗口」、保留当前窗口
printf '\e]0;%s\a' "PinHaotu MkDocs"

# 关闭其他已打开的同名一键启动窗口（保留当前这个）
if command -v osascript &>/dev/null; then
  CUR_ID=$(osascript -e 'tell application "Terminal" to get id of front window' 2>/dev/null)
  if [ -n "$CUR_ID" ]; then
    osascript -e 'tell application "Terminal"
      set myId to '"$CUR_ID"'
      repeat with w in (every window)
        try
          if (id of w) is not myId and (name of w) contains "PinHaotu MkDocs" then
            close w
          end if
        end try
      end repeat
    end tell' 2>/dev/null
  fi
fi

chmod +x restart-mkdocs.sh 2>/dev/null
./restart-mkdocs.sh

echo ""
read -n 1 -s -r -p "服务已停止，按任意键关闭此窗口..."
