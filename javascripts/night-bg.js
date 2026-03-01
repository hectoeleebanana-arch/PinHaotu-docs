(function() {
  var SCALE = 1;
  var OFFSET_TOP_PX = -365;
  var OFFSET_LEFT_PX = -10;
  var OPACITY = 0.9;
  var nightBgWidth = 0;
  var nightBgHeight = 0;

  function getBase() {
    var path = window.location.pathname.replace(/^\//, "").split("/").filter(Boolean);
    var depth = path.length > 0 ? path.length - 1 : 0;
    return depth === 0 ? "" : Array(depth).fill("..").join("/") + "/";
  }

  function getScrollHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      window.innerHeight || 0
    );
  }

  function ensureStyle() {
    if (document.getElementById("pinhaotu-night-bg")) return;
  var style = document.createElement("style");
  style.id = "pinhaotu-night-bg";
    style.textContent =
      "#pinhaotu-night-bg-wrap, #pinhaotu-day-bg-wrap { display: none; pointer-events: none; position: absolute; left: 0; top: 0; width: 100%; z-index: -1; overflow: hidden; opacity: 0; transition: opacity 2s ease, height 0.35s ease; } " +
      "#pinhaotu-night-bg-wrap.pinhaotu-bg-visible, #pinhaotu-day-bg-wrap.pinhaotu-bg-visible { opacity: 1; } " +
      "body[data-md-color-scheme=\"slate\"] #pinhaotu-night-bg-wrap { display: block; } " +
      "body[data-md-color-scheme=\"default\"] #pinhaotu-day-bg-wrap { display: block; } " +
      "#pinhaotu-night-bg-wrap .pinhaotu-night-bg-inner { position: absolute; left: 50%; top: 50%; transform: translate(calc(-50% + " + OFFSET_LEFT_PX + "px), calc(-50% + " + OFFSET_TOP_PX + "px)); } " +
      "#pinhaotu-day-bg-wrap .pinhaotu-day-bg-inner { position: absolute; left: 50%; top: 50%; transform: translate(calc(-50% + " + OFFSET_LEFT_PX + "px), calc(-50% + " + OFFSET_TOP_PX + "px)); opacity: " + OPACITY + "; } " +
      "#pinhaotu-night-bg-img, #pinhaotu-day-bg-img, #pinhaotu-day-bg-video { object-fit: contain; display: block; }";
  document.head.appendChild(style);
  }

  function updateWrapHeight() {
    var h = Math.max(getScrollHeight(), window.innerHeight || 0) + "px";
    var n = document.getElementById("pinhaotu-night-bg-wrap");
    var d = document.getElementById("pinhaotu-day-bg-wrap");
    if (n) n.style.height = h;
    if (d) d.style.height = h;
  }

  function scheduleHeightUpdates() {
    updateWrapHeight();
    setTimeout(updateWrapHeight, 50);
    setTimeout(updateWrapHeight, 150);
    setTimeout(updateWrapHeight, 350);
    setTimeout(updateWrapHeight, 600);
    window.addEventListener("load", function onLoad() {
      updateWrapHeight();
      window.removeEventListener("load", onLoad);
    });
    setTimeout(function showWhenReady() {
      updateWrapHeight();
      var n = document.getElementById("pinhaotu-night-bg-wrap");
      var d = document.getElementById("pinhaotu-day-bg-wrap");
      if (n) n.classList.add("pinhaotu-bg-visible");
      if (d) d.classList.add("pinhaotu-bg-visible");
      setTimeout(updateWrapHeight, 1000);
      setTimeout(updateWrapHeight, 2000);
      setTimeout(updateWrapHeight, 3000);
    }, 500);
  }

  function observeHeightChanges() {
    if (typeof ResizeObserver === "undefined") return;
    var raf = null;
    var observer = new ResizeObserver(function() {
      if (raf) return;
      raf = requestAnimationFrame(function() {
        raf = null;
        updateWrapHeight();
      });
    });
    observer.observe(document.body);
    observer.observe(document.documentElement);
  }

  function initNightBg() {
    ensureStyle();
    var existing = document.getElementById("pinhaotu-night-bg-wrap");
    if (existing) existing.remove();

    var base = getBase();
    var src = base + "assets/images/night-bg.apng";
    var wrap = document.createElement("div");
    wrap.id = "pinhaotu-night-bg-wrap";
    wrap.setAttribute("aria-hidden", "true");
    var inner = document.createElement("div");
    inner.className = "pinhaotu-night-bg-inner";
    var img = document.createElement("img");
    img.id = "pinhaotu-night-bg-img";
    img.alt = "";
    img.src = src;

    img.onload = function() {
      var w = Math.round(img.naturalWidth * SCALE);
      var h = Math.round(img.naturalHeight * SCALE);
      nightBgWidth = w;
      nightBgHeight = h;
      img.style.width = w + "px";
      img.style.height = h + "px";
    };

    inner.appendChild(img);
    wrap.appendChild(inner);
    document.body.insertBefore(wrap, document.body.firstChild);

    updateWrapHeight();
  }

  function initDayBg() {
    ensureStyle();
    var existing = document.getElementById("pinhaotu-day-bg-wrap");
    if (existing) {
      var oldImg = existing.querySelector("#pinhaotu-day-bg-img");
      if (oldImg && oldImg.src && oldImg.src.indexOf("blob:") === 0) URL.revokeObjectURL(oldImg.src);
      existing.remove();
    }

    var base = getBase();
    var mp4 = base + "assets/images/day-bg.mp4";
    var mp4Url = mp4 + (mp4.indexOf("?") >= 0 ? "&" : "?") + "t=" + Date.now();
    var wrap = document.createElement("div");
    wrap.id = "pinhaotu-day-bg-wrap";
    wrap.setAttribute("aria-hidden", "true");
    var inner = document.createElement("div");
    inner.className = "pinhaotu-day-bg-inner";
    var video = document.createElement("video");
    video.id = "pinhaotu-day-bg-video";
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("preload", "auto");
    video.muted = true;
    video.playsInline = true;

    function tryPlayDayVideo() {
      var v = document.getElementById("pinhaotu-day-bg-video");
      if (!v || v.readyState < 2) return;
      var p = v.play();
      if (p && p.then) {
        p.catch(function() {
          var once = function() {
            if (document.getElementById("pinhaotu-day-bg-video")) v.play().catch(function() {});
            document.removeEventListener("click", once);
            document.removeEventListener("touchstart", once);
          };
          document.addEventListener("click", once, { once: true });
          document.addEventListener("touchstart", once, { once: true });
        });
      }
    }

    video.onloadeddata = video.oncanplay = function() {
      var w = nightBgWidth > 0 ? nightBgWidth : (Math.round((video.videoWidth || 0) * SCALE) || 1920);
      var h = nightBgHeight > 0 ? nightBgHeight : (Math.round((video.videoHeight || 0) * SCALE) || 1080);
      video.style.width = w + "px";
      video.style.height = h + "px";
      updateWrapHeight();
      tryPlayDayVideo();
      setTimeout(tryPlayDayVideo, 200);
      setTimeout(tryPlayDayVideo, 600);
    };
    video.onerror = function() {
      tryApng();
      return;
    };

    inner.appendChild(video);
    wrap.appendChild(inner);
    document.body.insertBefore(wrap, document.body.firstChild);
    updateWrapHeight();
    video.src = mp4Url;

    function tryApng() {
      video.remove();
      var url = base + "assets/images/day-bg.apng";
      url = url + (url.indexOf("?") >= 0 ? "&" : "?") + "t=" + Date.now();
      var img = document.createElement("img");
      img.id = "pinhaotu-day-bg-img";
      img.alt = "";

      function finishDayInit(blobUrl) {
        img.onload = function() {
          var w = nightBgWidth > 0 ? nightBgWidth : Math.round(img.naturalWidth * SCALE);
          var h = nightBgHeight > 0 ? nightBgHeight : Math.round(img.naturalHeight * SCALE);
          img.style.width = w + "px";
          img.style.height = h + "px";
          if (img.decode) {
            img.decode().then(function() {
              wrap.offsetHeight;
              updateWrapHeight();
            }).catch(function() { updateWrapHeight(); });
          } else {
            wrap.offsetHeight;
            updateWrapHeight();
          }
        };
        inner.appendChild(img);
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            img.src = blobUrl;
          });
        });
      }

      fetch(url, { cache: "reload" })
        .then(function(r) { return r.blob(); })
        .then(function(blob) {
          finishDayInit(URL.createObjectURL(blob));
        })
        .catch(function() {
          img.onload = function() {
            var w = nightBgWidth > 0 ? nightBgWidth : Math.round(img.naturalWidth * SCALE);
            var h = nightBgHeight > 0 ? nightBgHeight : Math.round(img.naturalHeight * SCALE);
            img.style.width = w + "px";
            img.style.height = h + "px";
            wrap.offsetHeight;
            updateWrapHeight();
          };
          inner.appendChild(img);
          img.src = url;
        });
    }
  }

  /* 切换到白天时：先移除再重建白天背景，使 APNG 在可见状态下从头播放 */
  function reinitDayBg() {
    var wrap = document.getElementById("pinhaotu-day-bg-wrap");
    if (wrap) {
      var oldImg = wrap.querySelector("#pinhaotu-day-bg-img");
      if (oldImg && oldImg.src && oldImg.src.indexOf("blob:") === 0) URL.revokeObjectURL(oldImg.src);
      wrap.remove();
    }
    initDayBg();
    setTimeout(function showAfterSwitch() {
      var w = document.getElementById("pinhaotu-day-bg-wrap");
      if (w) w.classList.add("pinhaotu-bg-visible");
    }, 150);
  }

  /* 切换到夜间时：先移除再重建夜间背景（与白天对称） */
  function reinitNightBg() {
    var wrap = document.getElementById("pinhaotu-night-bg-wrap");
    if (wrap) wrap.remove();
    initNightBg();
    setTimeout(function showAfterSwitch() {
      var w = document.getElementById("pinhaotu-night-bg-wrap");
      if (w) w.classList.add("pinhaotu-bg-visible");
    }, 150);
  }

  function isIndexPage() {
    var path = (window.location.pathname || "").replace(/^\//, "").replace(/\/$/, "");
    var pathSegments = path.split("/").filter(Boolean);
    return pathSegments.length === 0 || (
      pathSegments.length === 1 && ["download", "install", "usage"].indexOf(pathSegments[0]) === -1
    );
  }

  function run() {
    if (!isIndexPage()) {
      var n = document.getElementById("pinhaotu-night-bg-wrap");
      var d = document.getElementById("pinhaotu-day-bg-wrap");
      if (n) n.remove();
      if (d) {
        var oldImg = d.querySelector("#pinhaotu-day-bg-img");
        if (oldImg && oldImg.src && oldImg.src.indexOf("blob:") === 0) URL.revokeObjectURL(oldImg.src);
        d.remove();
      }
    } else {
      var scheme = document.body.getAttribute("data-md-color-scheme");
      function runDay() {
        initDayBg();
        if (scheme === "default") setTimeout(reinitDayBg, 150);
      }
      function runNight() {
        initNightBg();
      }
      if (scheme === "default") {
        var base = getBase();
        var nightSrc = base + "assets/images/night-bg.apng";
        var probe = document.createElement("img");
        probe.onload = function() {
          nightBgWidth = Math.round(probe.naturalWidth * SCALE);
          nightBgHeight = Math.round(probe.naturalHeight * SCALE);
          runDay();
          scheduleHeightUpdates();
        };
        probe.onerror = function() {
          runDay();
          scheduleHeightUpdates();
        };
        probe.src = nightSrc;
      } else {
        runNight();
        scheduleHeightUpdates();
      }
    }
    window.addEventListener("resize", updateWrapHeight);
    window.addEventListener("pinhaotu-night-bg-update-height", updateWrapHeight);
    observeHeightChanges();
    var obs = new MutationObserver(function(mutations) {
      if (!isIndexPage()) return;
      var s = document.body.getAttribute("data-md-color-scheme");
      if (s === "default") {
        setTimeout(reinitDayBg, 30);
      } else if (s === "slate") {
        setTimeout(reinitNightBg, 30);
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });
    document.addEventListener("visibilitychange", function() {
      if (document.visibilityState !== "visible") return;
      if (document.body.getAttribute("data-md-color-scheme") !== "default") return;
      var v = document.getElementById("pinhaotu-day-bg-video");
      if (v && v.paused && v.readyState >= 2) v.play().catch(function() {});
    });
    if (typeof document$ !== "undefined") {
      document$.subscribe(function() {
        setTimeout(function() {
          if (!isIndexPage()) {
            var n = document.getElementById("pinhaotu-night-bg-wrap");
            var d = document.getElementById("pinhaotu-day-bg-wrap");
            if (n) n.remove();
            if (d) {
              var oldImg = d.querySelector("#pinhaotu-day-bg-img");
              if (oldImg && oldImg.src && oldImg.src.indexOf("blob:") === 0) URL.revokeObjectURL(oldImg.src);
              d.remove();
            }
            return;
          }
          var s = document.body.getAttribute("data-md-color-scheme");
          if (s === "default") reinitDayBg(); else reinitNightBg();
          scheduleHeightUpdates();
        }, 80);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
