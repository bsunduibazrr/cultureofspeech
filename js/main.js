/* ══════════════════════════════════════════════════════════════════════
   МЭНДЛЭХ ЁС — слайд дэкийн хөдөлгүүр
   Гадны сан ашиглаагүй. Офлайн, file:// дээр ч ажиллана.
   Удирдлага:  ↓ ↑ Space PageUp/Dn  · ← →  · Home/End · 1–9 · F
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var $ = function (s, c) {
    return (c || document).querySelector(s);
  };
  var $$ = function (s, c) {
    return Array.prototype.slice.call((c || document).querySelectorAll(s));
  };
  var clamp = function (v, a, b) {
    return v < a ? a : v > b ? b : v;
  };
  var pad2 = function (n) {
    return (n < 10 ? "0" : "") + n;
  };

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var root = document.documentElement;

  /* ═══ 1. ГЭРЭЛ ЗУРГИЙН ЭХ СУРВАЛЖ (Wikimedia Commons) ═══ */
  var PHOTOS = [
    ["Marcin Konsek", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Niebieskie_khadagi_w_klasztorze_Erdene_Dzuu.jpg"],
    ["Mark Fischer", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Mongolian_Ger.jpg"],
    ["Taylor Weidman/The Vanishing Cultures Project", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Mongolia_Naadam_Spectator.JPG"],
    ["MN5", "CC0", "https://commons.wikimedia.org/wiki/File:Ulaanbaatar_city_Mongolia_20230926_102617.jpg"],
    ["istolethetv", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Lil%27_riders_(5956869199).jpg"],
    ["Bernard Gagnon", "CC0", "https://commons.wikimedia.org/wiki/File:Erdene_Zuu_Monastery_13.jpg"],
    ["Hugues", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Anniversaire_de_mariage,_50_ans_(4941408480).jpg"],
    ["Nrantuya", "CC0", "https://commons.wikimedia.org/wiki/File:Herd_of_horses_in_Mongolia.jpg"],
    ["Chongkian", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Gandantegchinlen_Monastery_(2024).jpg"],
    ["Alexkom000", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:2024-10-18_Ulaanbaatar,_S%C3%BCkhbaatar_Square.jpg"],
    ["Arabsalam", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Baga_Gazaryn_Chuluu2.JPG"],
    ["MongoliaToday", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Mongolian_man.jpg"],
    ["CeeGee", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:PeopleMongolia_(2).jpg"],
    ["Нийтийн эзэмшил", "PD", "https://commons.wikimedia.org/wiki/File:%C4%8Coyijod_Dagini_manuscript_02.jpg"],
  ];
  (function () {
    var el = $("#photoCredits");
    if (!el) return;
    el.innerHTML =
      "Гэрэл зураг (Wikimedia Commons): " +
      PHOTOS.map(function (p) {
        return '<a href="' + p[2] + '" target="_blank" rel="noopener">' +
               p[0] + " (" + p[1] + ")</a>";
      }).join(", ");
  })();

  /* ═══ 2. ТЕКСТ ЗАДЛАХ ═══ */
  $$("[data-split]").forEach(function (el) {
    var words = el.textContent.trim().replace(/\s+/g, " ").split(" ");
    el.innerHTML = words
      .map(function (w, i) {
        return (
          '<span class="split-line"><span class="split-w" style="--wi:' +
          i +
          '">' +
          w.replace(/&/g, "&amp;").replace(/</g, "&lt;") +
          "</span></span>"
        );
      })
      .join(" ");
  });

  /* ═══ 3. СЛАЙДУУД ═══ */
  var slides = $$(".slide");
  var TOTAL = slides.length;
  var cur = 0;

  slides.forEach(function (s, si) {
    s.setAttribute('aria-hidden', 'true');
    $$('[data-anim]', s).forEach(function (el, i) { el.style.setProperty('--i', i); });
    var num = $('[data-num]', s);
    if (num) num.textContent = pad2(si + 1);
  });

  /* Мөнхийн хөдөлгөөн — элемент бүр өөрийн хэмнэлтэй */
  if (!reduced) {
    $$('.float, .float-ic, .ph img').forEach(function (el) {
      var base = el.classList.contains('float-ic') ? 5.4 : (el.tagName === 'IMG' ? 12 : 6.4);
      var d = base + Math.random() * base * 0.75;
      el.style.animationDuration = d.toFixed(2) + 's';
      el.style.animationDelay = (-Math.random() * d).toFixed(2) + 's';
    });
  }

  /* ─ хажуугийн цэс ─ */
  var dotsWrap = $("#dots"),
    secName = $("#secName"),
    secNum = $("#secNum"),
    secTot = $("#secTot"),
    bar = $("#progressBar");
  secTot.textContent = "/ " + pad2(TOTAL);

  var dots = slides.map(function (s, i) {
    var b = document.createElement("button");
    b.className = "dot";
    b.type = "button";
    b.setAttribute("aria-label", s.dataset.name);
    b.innerHTML = "<span>" + s.dataset.name + "</span><i></i>";
    b.addEventListener("click", function () {
      go(i);
    });
    dotsWrap.appendChild(b);
    return b;
  });

  var busy = false,
    busyT;
  function go(i) {
    i = clamp(i, 0, TOTAL - 1);
    if (i === cur) return;
    cur = i;
    render();
    busy = true;
    clearTimeout(busyT);
    busyT = setTimeout(
      function () {
        busy = false;
      },
      reduced ? 60 : 640,
    );
    dimHint();
  }

  function render() {
    slides.forEach(function (s, i) {
      s.classList.toggle("is-active", i === cur);
      s.classList.toggle("is-above", i < cur);
      s.setAttribute("aria-hidden", i === cur ? "false" : "true");
      dots[i].classList.toggle("is-active", i === cur);
    });
    secName.textContent = slides[cur].dataset.name;
    secNum.textContent = pad2(cur + 1);
    document.body.classList.toggle("is-hero", cur === 0);
    bar.style.width = (((cur + 1) / TOTAL) * 100).toFixed(2) + "%";
    ringSlideActive = slides[cur].classList.contains("slide--ring");
    /* төгсгөлийн слайд дээр налалт огт ажиллахгүй */
    flatSlide = slides[cur].classList.contains("slide--outro");
    if (tiltOn || tiltBack) tiltStop(true);
    tiltScan();
  }

  /* ═══ 4. ҮЛДЭХ УДИРДЛАГА — дугуй, товчлуур, хуруу ═══ */
  var acc = 0,
    lastEvt = 0,
    lastFire = 0;
  window.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault();
      var now = performance.now();
      if (now - lastEvt > 260) acc = 0; // шинэ хөдөлгөөн
      lastEvt = now;
      acc += e.deltaY * (e.deltaMode === 1 ? 18 : 1);
      if (now - lastFire > 900 && Math.abs(acc) > 58) {
        lastFire = now;
        go(cur + (acc > 0 ? 1 : -1));
        acc = 0;
      }
    },
    { passive: false },
  );

  var tY = 0,
    tX = 0;
  window.addEventListener(
    "touchstart",
    function (e) {
      tY = e.touches[0].clientY;
      tX = e.touches[0].clientX;
    },
    { passive: true },
  );
  window.addEventListener(
    "touchend",
    function (e) {
      var dy = tY - e.changedTouches[0].clientY;
      var dx = tX - e.changedTouches[0].clientX;
      if (Math.abs(dy) > 55 && Math.abs(dy) > Math.abs(dx))
        go(cur + (dy > 0 ? 1 : -1));
      else if (Math.abs(dx) > 55 && ringSlideActive) ringStep(dx > 0 ? 1 : -1);
    },
    { passive: true },
  );

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === "ArrowDown" || k === "PageDown" || k === " " || k === "Enter") {
      e.preventDefault();
      go(cur + 1);
    } else if (k === "ArrowUp" || k === "PageUp" || k === "Backspace") {
      e.preventDefault();
      go(cur - 1);
    } else if (k === "ArrowRight" || k === "ArrowLeft") {
      e.preventDefault();
      arrowDown(k);
    } else if (k === "Home") {
      e.preventDefault();
      go(0);
    } else if (k === "End") {
      e.preventDefault();
      go(TOTAL - 1);
    } else if (k >= "1" && k <= "9") {
      e.preventDefault();
      go(parseInt(k, 10) - 1);
    } else if (k === "f" || k === "F" || k === "ф" || k === "Ф") {
      e.preventDefault();
      if (!document.fullscreenElement) {
        if (root.requestFullscreen) { var fs = root.requestFullscreen(); if (fs && fs.catch) fs.catch(function () {}); }
      } else { var ex = document.exitFullscreen(); if (ex && ex.catch) ex.catch(function () {}); }
    }
  });

  $("#homeBtn").addEventListener("click", function () {
    go(0);
  });

  var hintEl = $("#hint"),
    dimmed = false;
  function dimHint() {
    if (dimmed || !hintEl) return;
    dimmed = true;
    hintEl.classList.add("is-dim");
  }

  /* ═══ 5. ТООНО ХҮРД — сонголт тойргоор эргэнэ ═══ */
  var ring = $("#ring");
  var cards = ring ? $$(".tn-card", ring) : [];
  var marks = ring ? $$(".tn-lb", ring) : [];
  var nodes = ring ? $$(".tn-nd circle", ring) : [];
  var FACE_N = cards.length || 1,
    STEP = 360 / FACE_N;
  var ringIdx = 0,
    ringSlideActive = false,
    flatSlide = false,
    ringFace = -1,
    ringOutT = 0;
  /* Автоматаар эргэдэггүй — үзэгч бүрэн уншиж амжина.
     Эргэлт нь зөвхөн ← →, дугаар товшилт, хуруу шудрахад л болно. */

  /* хэмжээг CSS өөрөө зохицуулдаг тул зөвхөн нийцэл хадгалахад */
  function layoutRing() {}

  function ringClearOut() {
    for (var i = 0; i < cards.length; i++) cards[i].classList.remove("is-out");
  }

  function ringPaint(dir) {
    if (!ring) return;
    var a = ((ringIdx % FACE_N) + FACE_N) % FACE_N;
    ring.style.setProperty("--ang", (ringIdx * STEP).toFixed(2) + "deg");
    ring.style.setProperty("--dir", dir < 0 ? -1 : 1);
    ring.dataset.active = a;

    /* гарч буй хөзрийг түр тэмдэглэнэ — эсрэг тал руугаа нисч оддог */
    if (a !== ringFace) {
      clearTimeout(ringOutT);
      ringClearOut();
      if (ringFace >= 0 && cards[ringFace]) cards[ringFace].classList.add("is-out");
      ringFace = a;
      ringOutT = setTimeout(ringClearOut, 820);
    }

    for (var i = 0; i < cards.length; i++)
      cards[i].classList.toggle("is-on", i === a);
    for (var j = 0; j < marks.length; j++) {
      /* идэвхтэйгээс хэдэн алхмын зайтай вэ — бүдгэрэлтийг тооцоход */
      var dd = Math.abs(j - a);
      if (dd > FACE_N / 2) dd = FACE_N - dd;
      marks[j].style.setProperty("--dist", dd);
      marks[j].classList.toggle("is-on", j === a);
    }
    for (var k = 0; k < nodes.length; k++)
      nodes[k].classList.toggle("is-on", k === a);
  }

  function ringStep(d) {
    if (!d) return;
    ringIdx += d;
    ringPaint(d);
    dimHint();
  }

  /* дугаар дээр дарахад хамгийн ойр талаар нь эргэнэ */
  marks.forEach(function (m, k) {
    m.addEventListener("click", function () {
      var a = ((ringIdx % FACE_N) + FACE_N) % FACE_N;
      var d = k - a;
      if (d > FACE_N / 2) d -= FACE_N;
      if (d < -FACE_N / 2) d += FACE_N;
      ringStep(d);
    });
  });
  ringPaint();

  /* ═══ 6. КУРСОР ═══
     Курсорын цэг ба тойрог зөвхөн жинхэнэ хулганыг дагана.
     Слайдын налалт үүнээс хамаарахаа больсон — доорх 7-р хэсгийг үз. */
  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var rx = mx, ry = my;

  var curEl = coarse ? null : $("#cursor");
  var cdot = curEl ? $(".cursor__dot", curEl) : null;
  var cring = curEl ? $(".cursor__ring", curEl) : null;

  var HOT =
    "a,button,.trio__i,.face,.season,.meme,.mcard,.member,.tone,.sticky-note,.ph,.vcol li";

  if (!coarse && curEl) {
    window.addEventListener(
      "mousemove",
      function (e) {
        mx = e.clientX;
        my = e.clientY;
        curEl.classList.add("is-on");
      },
      { passive: true },
    );
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest && e.target.closest(HOT))
        curEl.classList.add("is-hot");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest(HOT))
        curEl.classList.remove("is-hot");
    });
  }

  /* ═══ 7. НАЛАЛТ — ← → ТОВЧЛУУРААР ЭРГҮҮЛНЭ ═══
     Товшвол слайд солино, дарж барьвал налалт тэр зүг рүүгээ эргэнэ.
     Товчийг тавихад налалт голдоо зөөлөн буцаж ирнэ. */
  var TAP_MS = 190;     // үүнээс богино дарахыг "товшилт" гэж үзнэ
  var TILT_SPD = 1.45;  // 1 секундэд налалтын бүтэн хэмжээний хэдийг туулах
  var TILT_DEG = 3.4;   // слайдын хамгийн их эргэлт
  var tiltOn = false, tiltBack = false, tiltDir = 0, tiltA = 0;
  var tiltEls = [];     // идэвхтэй слайд дээрх налдаг хөзрүүд
  var arrows = {};

  /* идэвхтэй слайд солигдоход налдаг элементүүдийг дахин цуглуулна */
  function tiltScan() {
    for (var i = 0; i < tiltEls.length; i++) tiltEls[i].tiltOff();
    tiltEls = $$(".tilt", slides[cur]);
    for (var j = 0; j < tiltEls.length; j++) if (!tiltEls[j].tiltOff) tiltInit(tiltEls[j]);
  }

  function tiltInit(el) {
    el.tiltOff = function () {
      el.classList.remove("is-tilt");
      el.style.transform = "";
    };
  }

  /* a ∈ [-1 … 1] — бүх налалтыг нэг өнцгөөс жолоодно */
  function tiltPaint(a) {
    root.style.setProperty("--mx", (a * TILT_DEG).toFixed(3) + "deg");
    for (var i = 0; i < tiltEls.length; i++) {
      var el = tiltEls[i];
      if (!a) { el.tiltOff(); continue; }
      el.classList.add("is-tilt");
      el.style.transform =
        "perspective(900px) rotateY(" + (a * 8).toFixed(2) +
        "deg) rotateX(" + (-Math.abs(a) * 2).toFixed(2) +
        "deg) translateZ(" + (Math.abs(a) * 18).toFixed(1) + "px)";
    }
  }

  function tiltStart(d) {
    tiltOn = true;
    tiltBack = false;
    tiltDir = d;
    document.body.classList.add("is-tilting");
    dimHint();
  }

  /* hard=true — шууд таслана, hard=false — голдоо зөөлөн буцна */
  function tiltStop(hard) {
    tiltOn = false;
    tiltDir = 0;
    if (hard) {
      tiltBack = false;
      tiltA = 0;
      tiltPaint(0);
      document.body.classList.remove("is-tilting");
    } else {
      tiltBack = true;
    }
  }

  function arrowDown(k) {
    if (arrows[k]) return; // товчны auto-repeat-ыг үл тоомсорлоно
    var d = k === "ArrowRight" ? 1 : -1;
    if (ringSlideActive) { arrows[k] = { m: "done" }; ringStep(d); return; }
    if (reduced || coarse || flatSlide) {
      arrows[k] = { m: "done" };
      go(cur + d);
      return;
    }
    var a = (arrows[k] = { m: "tap" });
    a.t = setTimeout(function () {
      a.m = "hold";
      tiltStart(d);
    }, TAP_MS);
  }

  function arrowUp(k) {
    var a = arrows[k];
    if (!a) return;
    arrows[k] = null;
    clearTimeout(a.t);
    if (a.m === "tap") go(cur + (k === "ArrowRight" ? 1 : -1));
    else if (a.m === "hold") {
      var o = k === "ArrowRight" ? "ArrowLeft" : "ArrowRight";
      if (arrows[o] && arrows[o].m === "hold")
        tiltDir = o === "ArrowRight" ? 1 : -1; // нөгөө нь үргэлжлүүлнэ
      else tiltStop(false);
    }
  }

  document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") arrowUp(e.key);
  });
  window.addEventListener("blur", function () {
    ["ArrowRight", "ArrowLeft"].forEach(function (k) {
      if (arrows[k]) { clearTimeout(arrows[k].t); arrows[k] = null; }
    });
    if (tiltOn || tiltBack) tiltStop(true);
  });

  /* ═══ 9. ГОЛ ЦИКЛ ═══ */
  var lastT = 0, pdx = -1, pdy = -1;
  function frame(now) {
    var dt = lastT ? Math.min((now - lastT) / 1000, 0.05) : 0;
    lastT = now;

    if (tiltOn || tiltBack) {
      if (tiltOn && tiltDir) {
        tiltA = clamp(tiltA + tiltDir * TILT_SPD * dt, -1, 1);
      } else {
        tiltA += (0 - tiltA) * 0.11;
        if (Math.abs(tiltA) < 0.005) {
          tiltA = 0;
          tiltBack = false;
          document.body.classList.remove("is-tilting");
        }
      }
      tiltPaint(tiltA);
    }

    if (cdot && (mx !== pdx || my !== pdy)) {
      pdx = mx;
      pdy = my;
      cdot.style.transform =
        "translate(" + mx.toFixed(1) + "px," + my.toFixed(1) +
        "px) translate(-50%,-50%)";
    }
    if (cring) {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      cring.style.transform =
        "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) +
        "px) translate(-50%,-50%)";
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener(
    "resize",
    function () {
      layoutRing();
      if (tiltOn || tiltBack) tiltStop(true);
    },
    { passive: true },
  );

  var loader = $("#loader"),
    lbar = $("#loaderBar"),
    lnum = $("#loaderNum");
  var pct = 0,
    loaded = false,
    started = false;

  var iv = setInterval(function () {
    pct += Math.random() * 12 + 5;
    if (pct >= (loaded ? 100 : 88)) pct = loaded ? 100 : 88;
    lbar.style.width = pct + "%";
    lnum.textContent = Math.floor(pct);
    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(start, 200);
    }
  }, 100);

  function ready() {
    loaded = true;
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready);
  window.addEventListener("load", ready);
  setTimeout(ready, 3000);

  function start() {
    if (started) return;
    started = true;
    loader.classList.add("is-done");
    document.body.classList.add("is-ready");
    layoutRing();
    render();
    requestAnimationFrame(frame);
    setTimeout(layoutRing, 500);
  }

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
})();
