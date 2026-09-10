/*
 * Tovernet embeddable footer strip.
 * Usage: <script src="https://tovernet.online/embed/footer-strip.js" data-client="kolorowa-pasja" async></script>
 * Optional attrs:
 *   data-lang="en"                 explicit language for the strip's copy (see "Language" below);
 *                                   omit to auto-detect.
 *   data-mobile-safe-bottom="80"   extra px to force-reserve on mobile, on top of whatever is
 *                                   auto-detected — most sites won't need this, see below.
 *   data-config-url="https://tovernet.online/embed/footer-strip.config.json"
 *
 * Content (headline/tagline/logo/url) is fetched live from data-config-url so editing that
 * file on tovernet.online updates every site embedding this script, no client redeploy needed.
 *
 * Language: every string in the config (default AND per-client overrides) may be either a plain
 * string (shown regardless of language — this is how every pre-existing single-language client
 * config still works, unchanged) or an object keyed by locale, e.g. { "pl": "...", "en": "..." }.
 * The active locale is resolved once at render time, in order:
 *   1. this script tag's data-lang attribute (an embedding SPA that already tracks a locale
 *      should just pass it, e.g. data-lang="{{currentLocale}}");
 *   2. the host page's <html lang="…"> attribute;
 *   3. the browser's navigator.language;
 *   4. "pl" (matches every existing client site, all Polish).
 * Unrecognised/unsupported values fall back the same way. For a host whose language changes
 * without a full page reload (a client-rendered SPA that flips <html lang> or calls
 * data-lang), the strip updates in place — see "Live language updates" below.
 *
 * Live language updates: this script watches document.documentElement's lang attribute
 * (MutationObserver) and re-renders the strip's text/link whenever it changes, so a host that
 * updates <html lang> on a client-side language switch gets the strip updated for free — no
 * remount needed. A host that instead tracks its own locale state can call
 * window.TovernetStrip.setLang("en") directly, which does the same thing without touching
 * <html lang> at all.
 *
 * Mobile sticky bars: many client sites have a fixed call/WhatsApp bar pinned to the bottom
 * of the viewport on mobile, which would otherwise sit on top of this strip. The script
 * auto-detects any fixed/sticky element hugging the bottom of the viewport at render time and
 * reserves that much extra bottom padding — no per-site config needed. data-mobile-safe-bottom
 * is only a manual top-up for cases the heuristic misses (e.g. the bar mounts later than us).
 */
(function () {
  var currentScript = document.currentScript;
  if (!currentScript || !currentScript.parentNode) return;

  var clientId = currentScript.getAttribute('data-client') || 'default';
  var mobileSafeBottom = parseInt(currentScript.getAttribute('data-mobile-safe-bottom') || '0', 10) || 0;
  var configUrl = currentScript.getAttribute('data-config-url') ||
    'https://tovernet.online/embed/footer-strip.config.json';

  var SUPPORTED_LOCALES = ['pl', 'en'];
  var DEFAULT_LOCALE = 'pl';

  var FALLBACK = {
    headline: { pl: 'Strona stworzona przez', en: 'Site built by' },
    brand: 'Tovernet',
    tagline: {
      pl: 'Nowoczesne strony i systemy dla hodowli & biznesu',
      en: 'Modern websites and systems for kennels & business'
    },
    url: 'https://tovernet.online',
    logo: 'https://tovernet.online/embed/tovernet-logo.png'
  };

  function normalizeLocale(raw) {
    if (!raw) return null;
    var code = String(raw).slice(0, 2).toLowerCase();
    return SUPPORTED_LOCALES.indexOf(code) !== -1 ? code : null;
  }

  function resolveLocale() {
    var explicit = normalizeLocale(currentScript.getAttribute('data-lang'));
    if (explicit) return explicit;
    var htmlLang = normalizeLocale(document.documentElement.getAttribute('lang'));
    if (htmlLang) return htmlLang;
    var navLangs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (var i = 0; i < navLangs.length; i++) {
      var navLocale = normalizeLocale(navLangs[i]);
      if (navLocale) return navLocale;
    }
    return DEFAULT_LOCALE;
  }

  // A config value is either a plain string (locale-independent, the pre-existing shape every
  // deployed client config still uses) or a { pl, en, ... } map — pick the active locale out of
  // the latter, falling back to DEFAULT_LOCALE, then to whatever locale IS present.
  function pick(value, locale) {
    if (value && typeof value === 'object') {
      if (value[locale] != null) return value[locale];
      if (value[DEFAULT_LOCALE] != null) return value[DEFAULT_LOCALE];
      for (var k in value) if (value[k] != null) return value[k];
      return '';
    }
    return value;
  }

  function resolveCfg(base, locale) {
    var out = {};
    for (var k in base) out[k] = pick(base[k], locale);
    return out;
  }

  var STYLE_ID = 'tovernet-strip-styles';
  if (!document.getElementById(STYLE_ID)) {
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.tvn-strip{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;' +
      'gap:16px;padding:16px;width:100%;box-sizing:border-box;text-decoration:none;cursor:pointer;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      'background:linear-gradient(90deg,#4c3fd7,#6b5fff,#8b5cf6,#a78bfa,#8b5cf6,#6b5fff,#4c3fd7);' +
      'background-size:300% 100%;animation:tvn-shimmer 8s ease-in-out infinite;' +
      'box-shadow:0 -1px 0 0 rgba(167,139,250,.4) inset,0 0 30px 0 rgba(139,92,246,.35);' +
      'transition:transform .3s ease;box-sizing:border-box;}' +
      '.tvn-strip:hover{transform:scale(1.01);}' +
      '.tvn-strip::before{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 20%,rgba(255,255,255,.16) 35%,rgba(255,255,255,.28) 42%,rgba(255,255,255,.16) 49%,transparent 65%);background-size:250% 100%;animation:tvn-shine 5s ease-in-out infinite;pointer-events:none;}' +
      '.tvn-strip::after{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.5) 1px,transparent 1px);background-size:22px 22px;opacity:.08;pointer-events:none;}' +
      '.tvn-logo{position:relative;z-index:1;flex-shrink:0;width:44px;height:44px;border-radius:9999px;background:#fff;box-shadow:0 4px 10px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;transition:transform .3s ease;}' +
      '.tvn-strip:hover .tvn-logo{transform:rotate(6deg);}' +
      '.tvn-logo img{width:28px;height:28px;object-fit:contain;}' +
      '.tvn-text{position:relative;z-index:1;display:flex;flex-direction:column;line-height:1.25;align-items:center;text-align:center;}' +
      '.tvn-headline{font-size:14px;font-weight:700;color:#fff;letter-spacing:.02em;}' +
      '.tvn-brand{text-decoration:underline;text-decoration-color:rgba(255,255,255,.5);text-underline-offset:2px;}' +
      '.tvn-strip:hover .tvn-brand{text-decoration-color:#fff;}' +
      '.tvn-tagline{font-size:12px;color:rgba(255,255,255,.7);margin-top:2px;}' +
      '.tvn-arrow{position:relative;z-index:1;flex-shrink:0;color:rgba(255,255,255,.8);transition:all .3s ease;}' +
      '.tvn-strip:hover .tvn-arrow{transform:translate(4px,-4px);color:#fff;}' +
      '@keyframes tvn-shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}' +
      '@keyframes tvn-shine{0%{background-position:150% 0}60%,100%{background-position:-50% 0}}' +
      '@media(min-width:640px){.tvn-text{align-items:flex-start;text-align:left;}}';
    document.head.appendChild(style);
  }

  function detectStickyBottomHeight(stripEl) {
    if (window.innerWidth > 639) return 0;
    var maxH = 0;
    var candidates = document.querySelectorAll('body *');
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      if (el === stripEl || stripEl.contains(el) || el.contains(stripEl)) continue;
      var cs = window.getComputedStyle(el);
      if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) continue;
      var rect = el.getBoundingClientRect();
      if (rect.height <= 0 || rect.height > 200) continue;
      if (rect.width < window.innerWidth * 0.5) continue;
      var distFromBottom = window.innerHeight - rect.bottom;
      if (distFromBottom < -2 || distFromBottom > 24) continue;
      if (rect.height > maxH) maxH = rect.height;
    }
    return maxH;
  }

  function applyMobileSafeBottom(a) {
    if (window.innerWidth > 639) {
      a.style.paddingBottom = '';
      return;
    }
    var detected = detectStickyBottomHeight(a);
    var extra = Math.max(detected, mobileSafeBottom);
    a.style.paddingBottom = extra > 0 ? (16 + extra) + 'px' : '';
  }

  // Module state shared between the initial render and later language updates.
  var rawBase = null; // { headline, brand, tagline, url, logo } with unresolved (possibly per-locale) values
  var currentLocale = resolveLocale();
  var els = null; // { a, img, headline, brandSpan, tagline }

  function mount(cfg) {
    var a = document.createElement('a');
    a.className = 'tvn-strip';
    a.href = cfg.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    var logo = document.createElement('span');
    logo.className = 'tvn-logo';
    var img = document.createElement('img');
    img.src = cfg.logo;
    img.alt = cfg.brand + ' Logo';
    logo.appendChild(img);

    var text = document.createElement('span');
    text.className = 'tvn-text';
    var headline = document.createElement('span');
    headline.className = 'tvn-headline';
    var brandSpan = document.createElement('span');
    brandSpan.className = 'tvn-brand';
    brandSpan.textContent = cfg.brand;
    headline.appendChild(document.createTextNode(cfg.headline + ' '));
    headline.appendChild(brandSpan);
    text.appendChild(headline);

    var tagline = document.createElement('span');
    tagline.className = 'tvn-tagline';
    tagline.textContent = cfg.tagline || '';
    tagline.style.display = cfg.tagline ? '' : 'none';
    text.appendChild(tagline);

    var arrow = document.createElement('span');
    arrow.className = 'tvn-arrow';
    arrow.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>';

    a.appendChild(logo);
    a.appendChild(text);
    a.appendChild(arrow);

    currentScript.parentNode.insertBefore(a, currentScript);

    els = { a: a, img: img, headline: headline, brandSpan: brandSpan, tagline: tagline };

    applyMobileSafeBottom(a);
    setTimeout(function () { applyMobileSafeBottom(a); }, 500);
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { applyMobileSafeBottom(a); }, 150);
    });
  }

  // Patches the already-mounted strip in place for a locale change — no remount/flicker.
  function patch(cfg) {
    if (!els) return;
    els.a.href = cfg.url;
    els.img.src = cfg.logo;
    els.img.alt = cfg.brand + ' Logo';
    els.headline.replaceChildren(document.createTextNode(cfg.headline + ' '), els.brandSpan);
    els.brandSpan.textContent = cfg.brand;
    els.tagline.textContent = cfg.tagline || '';
    els.tagline.style.display = cfg.tagline ? '' : 'none';
  }

  function renderForLocale(locale) {
    currentLocale = locale;
    var cfg = resolveCfg(rawBase, locale);
    if (els) patch(cfg); else mount(cfg);
  }

  // Public API for a host that manages its own locale state (an SPA that doesn't want to touch
  // <html lang>) — e.g. window.TovernetStrip.setLang("en").
  window.TovernetStrip = window.TovernetStrip || {};
  window.TovernetStrip.setLang = function (lang) {
    var normalized = normalizeLocale(lang) || DEFAULT_LOCALE;
    if (rawBase) renderForLocale(normalized);
    else currentLocale = normalized; // config hasn't loaded yet; resolveLocale() re-checked below
  };

  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(function () {
      var next = normalizeLocale(document.documentElement.getAttribute('lang'));
      if (next && next !== currentLocale && rawBase) renderForLocale(next);
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  fetch(configUrl, { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var base = {};
      for (var k in FALLBACK) base[k] = FALLBACK[k];
      if (data.default) for (var k1 in data.default) base[k1] = data.default[k1];
      var override = (data.clients && data.clients[clientId]) || {};
      for (var k2 in override) base[k2] = override[k2];
      rawBase = base;
      renderForLocale(resolveLocale());
    })
    .catch(function () {
      rawBase = FALLBACK;
      renderForLocale(resolveLocale());
    });
})();
