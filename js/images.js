/* =========================================================
   ページを開くたびに、写真をランダムに配る
   - フォルダーごとにシャッフルし、1 回の表示で同じ写真を 2 回使わない
     （枚数が足りないときだけ、配り直して続ける）
   - ファーストビューは、前回と同じ写真が続けて出ないようにする
   ========================================================= */
(function () {
  'use strict';

  var config = (window.LP_CONFIG && window.LP_CONFIG.images) || {};

  function safePath(v) {
    if (typeof v !== 'string') return null;
    if (/^(?:\.{0,2}\/)?[\w\-./]*\/$/.test(v) && v.indexOf('..') === -1 && v.indexOf(':') === -1) return v;
    try {
      var u = new URL(v);
      return u.protocol === 'https:' && /\/$/.test(u.pathname) ? u.href : null;
    } catch (e) { return null; }
  }

  function pool(def) {
    if (!def) return null;
    var path = safePath(def.path);
    var prefix = typeof def.prefix === 'string' && /^[\w\-]*$/.test(def.prefix) ? def.prefix : null;
    var ext = /^\.(webp|jpe?g|png|avif)$/i.test(def.ext || '') ? def.ext : null;
    var count = parseInt(def.count, 10);
    if (!path || prefix === null || !ext || !(count >= 1 && count <= 9999)) {
      if (window.console) console.warn('[LP] 写真の設定（images）を確認してください');
      return null;
    }
    var order = [], i = 0;
    function shuffle() {
      order = [];
      for (var n = 1; n <= count; n++) order.push(n);
      for (var j = order.length - 1; j > 0; j--) {          // 偏りのないシャッフル（Fisher–Yates）
        var k = Math.floor(Math.random() * (j + 1));
        var t = order[j]; order[j] = order[k]; order[k] = t;
      }
      i = 0;
    }
    shuffle();
    return {
      count: count,
      url: function (n) {
        var num = String(n);
        while (num.length < 3) num = '0' + num;
        return path + prefix + num + ext;
      },
      draw: function () {
        if (i >= order.length) shuffle();
        return order[i++];
      }
    };
  }

  var P = {
    hero: pool(config.hero),
    wideLandscape: pool(config.wideLandscape),
    widePortrait: pool(config.widePortrait),
    scenePc: pool(config.scenePc),
    sceneSp: pool(config.sceneSp)
  };

  function setImgs(slot, url) {
    slot.querySelectorAll('img').forEach(function (img) {
      if (!img.closest('noscript')) img.src = url;
    });
  }

  // ---- ファーストビュー ----
  var hero = document.querySelector('[data-pool-slot="hero"]');
  if (hero && P.hero) {
    var LAST = 'lp-last-hero', last = null, n = P.hero.draw();
    try { last = localStorage.getItem(LAST); } catch (e) { /* 使えなくても動く */ }
    if (String(n) === last && P.hero.count > 1) n = P.hero.draw();   // 前回と同じなら引き直す
    setImgs(hero, P.hero.url(n));
    try { localStorage.setItem(LAST, String(n)); } catch (e) { /* 使えなくても動く */ }
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: 'lp_hero_image', image: n });
  }

  // ---- 全幅の山場（上から順に） ----
  document.querySelectorAll('[data-pool-slot="wide-portrait"], [data-pool-slot="wide-landscape"]').forEach(function (slot) {
    if (slot.getAttribute('data-pool-slot') === 'wide-portrait') {
      if (P.widePortrait) setImgs(slot, P.widePortrait.url(P.widePortrait.draw()));
      return;
    }
    var source = slot.querySelector('source');
    var img = slot.querySelector('img');
    if (source && P.widePortrait) source.srcset = P.widePortrait.url(P.widePortrait.draw());   // スマホ
    if (img && P.wideLandscape) img.src = P.wideLandscape.url(P.wideLandscape.draw());         // PC
  });

  // ---- 左右交互のシーン ----
  document.querySelectorAll('[data-pool-slot="scene"]').forEach(function (slot) {
    var source = slot.querySelector('source');
    var img = slot.querySelector('img');
    if (source && P.sceneSp) source.srcset = P.sceneSp.url(P.sceneSp.draw());   // スマホ
    if (img && P.scenePc) img.src = P.scenePc.url(P.scenePc.draw());           // PC
  });

  // ---- 作品の棚（scene-sp から、シーンと重ならない写真を配る） ----
  document.querySelectorAll('[data-pool-slot="shelf"] img').forEach(function (img) {
    if (P.sceneSp) img.src = P.sceneSp.url(P.sceneSp.draw());
  });
})();
