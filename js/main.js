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
})();
