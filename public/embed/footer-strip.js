/*
 * Tovernet embeddable footer strip.
 * Usage: <script src="https://tovernet.online/embed/footer-strip.js" data-client="kolorowa-pasja" async></script>
 * Optional attrs: data-mobile-safe-bottom="80" (extra px to force-reserve on mobile, on top of
 *                 whatever is auto-detected — most sites won't need this, see below)
 *                 data-config-url="https://tovernet.online/embed/footer-strip.config.json"
 * Content (headline/tagline/logo/url) is fetched live from data-config-url so editing that
 * file on tovernet.online updates every site embedding this script, no client redeploy needed.
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

  var FALLBACK = {
    headline: 'Strona stworzona przez',
    brand: 'Tovernet',
    tagline: 'Nowoczesne strony i systemy dla hodowli & biznesu',
    url: 'https://tovernet.online',
    logo: 'https://tovernet.online/embed/tovernet-logo.png'
  };

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

  function render(cfg) {
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
    headline.innerHTML = cfg.headline + ' <span class="tvn-brand">' + cfg.brand + '</span>';
    text.appendChild(headline);
    if (cfg.tagline) {
      var tagline = document.createElement('span');
      tagline.className = 'tvn-tagline';
      tagline.textContent = cfg.tagline;
      text.appendChild(tagline);
    }

    var arrow = document.createElement('span');
    arrow.className = 'tvn-arrow';
    arrow.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>';

    a.appendChild(logo);
    a.appendChild(text);
    a.appendChild(arrow);

    currentScript.parentNode.insertBefore(a, currentScript);

    applyMobileSafeBottom(a);
    setTimeout(function () { applyMobileSafeBottom(a); }, 500);
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { applyMobileSafeBottom(a); }, 150);
    });
  }

  fetch(configUrl, { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var base = {};
      for (var k in FALLBACK) base[k] = FALLBACK[k];
      if (data.default) for (var k1 in data.default) base[k1] = data.default[k1];
      var override = (data.clients && data.clients[clientId]) || {};
      for (var k2 in override) base[k2] = override[k2];
      render(base);
    })
    .catch(function () {
      render(FALLBACK);
    });
})();
