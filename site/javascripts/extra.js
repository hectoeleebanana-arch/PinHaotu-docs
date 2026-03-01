/*
 * 在 header 内插入一份三个导航链接的克隆，并隐藏原 .md-tabs；挂到 .md-header 上保证始终相对整条 header 居中。
 */
function injectHeaderTabs() {
  try {
    var tabs = document.querySelector(".md-tabs");
    var headerOuter = document.querySelector(".md-header");
    var existing = document.getElementById("pinhaotu-header-tabs-wrap");
    if (existing) existing.remove();
    if (!tabs || !headerOuter) return;
    var list = tabs.querySelector(".md-tabs__list");
    if (!list) return;
    var clone = list.cloneNode(true);
    clone.id = "pinhaotu-header-tabs";
    clone.removeAttribute("class");
    clone.setAttribute("aria-label", "导航");
    clone.style.setProperty("display", "flex", "important");
    clone.style.setProperty("flex-wrap", "nowrap", "important");
    clone.style.setProperty("margin", "0", "important");
    clone.style.setProperty("padding", "0", "important");
    clone.style.setProperty("list-style", "none", "important");
    clone.style.setProperty("gap", "0", "important");
    var links = clone.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].style.setProperty("padding", "0.1rem 0.2rem", "important");
      links[i].style.setProperty("color", "inherit", "important");
      links[i].style.setProperty("text-decoration", "none", "important");
      links[i].style.setProperty("white-space", "nowrap", "important");
    }
    var wrap = document.createElement("div");
    wrap.id = "pinhaotu-header-tabs-wrap";
    wrap.style.cssText = "position:absolute;left:50%;top:50%;transform:translate(-50%,calc(-50% - 4px));z-index:2;max-width:100%;";
    wrap.appendChild(clone);
    headerOuter.style.position = "relative";
    headerOuter.appendChild(wrap);
    tabs.style.setProperty("display", "none", "important");
    injectHeaderTabsStyle();
  } catch (e) {}
}

/* 通过 JS 注入导航间距样式，避免 extra.css 未加载或缓存导致不生效 */
function injectHeaderTabsStyle() {
  var id = "pinhaotu-header-tabs-injected-style";
  if (document.getElementById(id)) return;
  var style = document.createElement("style");
  style.id = id;
  style.textContent =
    ".md-tabs .md-tabs__list, #pinhaotu-header-tabs { gap: 0 !important; } " +
    ".md-tabs .md-tabs__list a, #pinhaotu-header-tabs a { padding: 0.1rem 0.2rem !important; }";
  document.head.appendChild(style);
}

/* 把 header 中图标（logo）+ 抽屉 + 标题包在一起：整体右移 30px，图标再相对标题右移 10px
 * 已改为纯 CSS 偏移，见 extra.css，不再移动 DOM，避免标题/搜索错位或消失
 */
function wrapHeaderLeftShift() {
  /* 不再移动 DOM，由 CSS .md-header__inner > .md-header__button.md-logo 等实现 */
}

/* 把日夜模式 + 搜索包在一个 wrapper 里整体右移 50px
 * 已改为纯 CSS 偏移，见 extra.css，不再移动 DOM
 */
function wrapHeaderRightShift() {
  /* 不再移动 DOM，由 CSS form[data-md-component="palette"] margin-left 实现 */
}

function removeContentListDots() {
  try {
    var content = document.querySelector(".md-content .md-content__inner") || document.querySelector("article.md-typeset");
    if (!content) return;
    var uls = content.querySelectorAll("ul, ol");
    for (var i = 0; i < uls.length; i++) {
      uls[i].style.listStyle = "none";
      uls[i].style.paddingLeft = "0";
      uls[i].style.paddingInlineStart = "0";
      var lis = uls[i].getElementsByTagName("li");
      for (var j = 0; j < lis.length; j++) {
        lis[j].style.listStyle = "none";
        lis[j].style.listStyleType = "none";
        lis[j].style.paddingLeft = "0";
        lis[j].style.paddingInlineStart = "0";
      }
    }
  } catch (e) {}
}

/* 首页：标题“Pin好图”与副标题加粗；颜色由 CSS 按日夜主题控制 */
function applyIndexTitleStyles() {
  try {
    var title = document.querySelector(".pinhaotu-index-title") || document.querySelector(".md-content__inner h1#pin");
    if (title) {
      title.style.setProperty("font-weight", "800", "important");
      title.style.setProperty("opacity", "1", "important");
    }
    var subtitle = document.querySelector(".pinhaotu-index-title + p") || document.querySelector(".md-content__inner h1#pin + p");
    if (subtitle) subtitle.style.setProperty("font-weight", "700", "important");
  } catch (e) {}
}

/* 首页：从 GitHub 拉取最新 release 并渲染“版本”模块 */
function loadVersionFromGitHub() {
  var block = document.getElementById("pinhaotu-version-from-github");
  if (!block) return;
  var repo = (block.getAttribute("data-github-repo") || "").trim();
  if (!repo || repo === "OWNER/REPO") {
    block.innerHTML = "<p class=\"pinhaotu-version-loading\">请在 index.md 中设置 data-github-repo 为你的仓库，如：yanhaoli/PinHaotu</p>";
    return;
  }
  var url = "https://api.github.com/repos/" + repo + "/releases/latest";
  fetch(url, { headers: { "Accept": "application/vnd.github.v3+json" } })
    .then(function(r) { return r.ok ? r.json() : Promise.reject(new Error(r.status)); })
    .then(function(data) {
      var tag = data.tag_name || "";
      var date = data.published_at ? data.published_at.slice(0, 10) : "";
      var body = (data.body || "").trim();
      var html = "";
      html += "<p>当前版本：" + escapeHtml(tag) + "（Release: " + escapeHtml(date) + "）</p>";
      html += "<h3 id=\"pinhaotu-version-topic\" class=\"pinhaotu-version-h3\">" + escapeHtml(tag) + " 更新概要</h3>";
      var items = parseReleaseBodyToList(body);
      if (items.length) {
        html += "<ul>";
        for (var i = 0; i < items.length; i++) html += "<li>" + escapeHtml(items[i]) + "</li>";
        html += "</ul>";
      }
      block.innerHTML = html;
      removeContentListDots();
      window.dispatchEvent(new CustomEvent("pinhaotu-night-bg-update-height"));
    })
    .catch(function() {
      block.innerHTML = "<p class=\"pinhaotu-version-loading\">无法加载版本信息，请检查 data-github-repo 或网络。</p>";
    });
}
function escapeHtml(s) {
  var div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}
function parseReleaseBodyToList(body) {
  var lines = body.split(/\r?\n/);
  var items = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    var m = line.match(/^[\-\*•]\s*(.+)$/) || line.match(/^\d+\.\s+(.+)$/);
    if (m) items.push(m[1].trim());
  }
  return items;
}

/* 首页 / 下载页“下载插件”按钮：点击从 GitHub 仓库下载最新 release 的附件，并显示提示 */
function bindDownloadBtn(btn, hintId) {
  if (!btn || !hintId) return;
  var repo = (btn.getAttribute("data-github-repo") || "").trim();
  if (!repo || repo === "OWNER/REPO") {
    btn.setAttribute("href", "download/");
    return;
  }
  var releasesUrl = "https://github.com/" + repo + "/releases/latest";
  var hintObserver = null;
  function showDownloadHint() {
    if (document.getElementById(hintId)) return;
    if (!btn.parentNode) return;
    var hint = document.createElement("p");
    hint.id = hintId;
    hint.className = "pinhaotu-download-hint";
    var manual = document.createElement("a");
    manual.href = releasesUrl;
    manual.target = "_blank";
    manual.rel = "noopener";
    manual.textContent = "手动下载";
    hint.textContent = "已自动下载，如果未自动下载可选择";
    hint.appendChild(manual);
    hint.appendChild(document.createTextNode("。"));
    btn.parentNode.insertBefore(hint, btn.nextSibling);
    if (!hintObserver) {
      hintObserver = new MutationObserver(function(mutations) {
        if (document.getElementById(hintId)) return;
        for (var i = 0; i < mutations.length; i++) {
          var nodes = mutations[i].removedNodes;
          for (var j = 0; j < nodes.length; j++) {
            var n = nodes[j];
            if (n.id === hintId || (n.querySelector && n.querySelector("#" + hintId))) {
              if (btn.parentNode) setTimeout(showDownloadHint, 10);
              return;
            }
          }
        }
      });
      hintObserver.observe(document.body, { childList: true, subtree: true });
    }
  }
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    showDownloadHint();
    var label = btn.textContent;
    btn.textContent = "正在获取…";
    btn.style.pointerEvents = "none";
    var api = "https://api.github.com/repos/" + repo + "/releases/latest";
    var doFetch = function() {
      fetch(api, { headers: { "Accept": "application/vnd.github.v3+json" } })
        .then(function(r) { return r.ok ? r.json() : Promise.reject(new Error(r.status)); })
        .then(function(data) {
          var assets = data.assets || [];
          var url = assets.length > 0 ? assets[0].browser_download_url : null;
          if (url) {
            var a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            a.rel = "noopener";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            window.open(releasesUrl, "_blank");
          }
        })
        .catch(function() {
          window.open(releasesUrl, "_blank");
        })
        .then(function() {
          btn.textContent = label;
          btn.style.pointerEvents = "";
        });
    };
    setTimeout(doFetch, 50);
  });
}

function bindIndexDownloadBtn() {
  var btn = document.getElementById("pinhaotu-index-download-btn");
  if (btn) bindDownloadBtn(btn, "pinhaotu-download-hint-index");
  var pageBtn = document.getElementById("pinhaotu-download-page-btn");
  if (pageBtn) bindDownloadBtn(pageBtn, "pinhaotu-download-hint-page");
}

document.addEventListener("DOMContentLoaded", function() {
  injectHeaderTabs();
  injectHeaderTabsStyle();
  wrapHeaderLeftShift();
  wrapHeaderRightShift();
  removeContentListDots();
  applyIndexTitleStyles();
  loadVersionFromGitHub();
  bindIndexDownloadBtn();
  try {
    var path = window.location.pathname.replace(/^\//, "").split("/").filter(Boolean);
    var depth = Math.max(0, path.length - 1);
    var root = depth === 0 ? "." : Array(depth).fill("..").join("/");
    var logo = document.querySelector(".md-header__button.md-logo");
    if (logo && logo.tagName === "A") logo.setAttribute("href", root);
    var titleLink = document.querySelector(".md-header__title a");
    if (titleLink) titleLink.setAttribute("href", root);
  } catch (e) {}

  /* 下载插件页 / 安装教程页 / 使用教程页：标记 body，用于 CSS 布局与排版 */
  try {
    var p = (window.location.pathname || "").replace(/^\//, "").replace(/\/$/, "");
    if (p === "download" || p.endsWith("/download")) {
      document.body.classList.add("pinhaotu-page-download");
    } else {
      document.body.classList.remove("pinhaotu-page-download");
    }
    if (p === "install" || p.endsWith("/install")) {
      document.body.classList.add("pinhaotu-page-install");
    } else {
      document.body.classList.remove("pinhaotu-page-install");
    }
    if (p === "usage" || p.endsWith("/usage")) {
      document.body.classList.add("pinhaotu-page-usage");
    } else {
      document.body.classList.remove("pinhaotu-page-usage");
    }
  } catch (e) {}

  // 修复：当存在 label[for="__toc"] 但页面没有 id="__toc" 的表单控件时（如首页未在 nav 中），
  // 插入一个隐藏的 checkbox，避免 "Incorrect use of <label for=FORM_ELEMENT>" 的校验/无障碍问题。
  try {
    var tocLabel = document.querySelector('label[for="__toc"]');
    if (tocLabel && !document.getElementById("__toc")) {
      var tocInput = document.createElement("input");
      tocInput.type = "checkbox";
      tocInput.id = "__toc";
      tocInput.className = "md-nav__toggle md-toggle";
      tocInput.setAttribute("aria-hidden", "true");
      tocInput.style.cssText = "position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);border:0;";
      var main = document.querySelector(".md-main__inner") || document.body;
      main.insertBefore(tocInput, main.firstChild);
    }
  } catch (e) {}
  if (typeof document$ !== "undefined") {
    document$.subscribe(removeContentListDots);
    document$.subscribe(applyIndexTitleStyles);
    document$.subscribe(loadVersionFromGitHub);
    document$.subscribe(bindIndexDownloadBtn);
    document$.subscribe(function() { setTimeout(function() { injectHeaderTabs(); injectHeaderTabsStyle(); }, 80); });
    document$.subscribe(function() { setTimeout(wrapHeaderLeftShift, 80); });
    document$.subscribe(function() { setTimeout(wrapHeaderRightShift, 80); });
    document$.subscribe(function() {
      var p = (window.location.pathname || "").replace(/^\//, "").replace(/\/$/, "");
      if (p === "download" || p.endsWith("/download")) {
        document.body.classList.add("pinhaotu-page-download");
      } else {
        document.body.classList.remove("pinhaotu-page-download");
      }
      if (p === "install" || p.endsWith("/install")) {
        document.body.classList.add("pinhaotu-page-install");
      } else {
        document.body.classList.remove("pinhaotu-page-install");
      }
      if (p === "usage" || p.endsWith("/usage")) {
        document.body.classList.add("pinhaotu-page-usage");
      } else {
        document.body.classList.remove("pinhaotu-page-usage");
      }
    });
  }
});
