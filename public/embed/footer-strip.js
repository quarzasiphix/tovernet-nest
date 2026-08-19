/*
 * Tovernet embeddable footer strip.
 * Usage: <script src="https://tovernet.online/embed/footer-strip.js" data-client="kolorowa-pasja" async></script>
 * Optional attrs: data-mobile-safe-bottom="80" (px reserved on mobile for e.g. a sticky call button)
 *                 data-config-url="https://tovernet.online/embed/footer-strip.config.json"
 * Content (headline/tagline/logo/url) is fetched live from data-config-url so editing that
 * file on tovernet.online updates every site embedding this script, no client redeploy needed.
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

  function render(cfg) {
    var a = document.createElement('a');
    a.className = 'tvn-strip';
    a.href = cfg.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    if (mobileSafeBottom > 0 && window.matchMedia('(max-width: 639px)').matches) {
      a.style.paddingBottom = (16 + mobileSafeBottom) + 'px';
    }

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
