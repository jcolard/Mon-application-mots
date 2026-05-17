/* ==========================================================================
   shared.js — Menu et Footer réutilisables pour Lienpourl'autre
   --------------------------------------------------------------------------
   Comment ça marche :
   - Toute page HTML doit contenir :
       <div id="site-nav"></div>     (placeholder pour le menu, en haut du <body>)
       <div id="site-footer"></div>  (placeholder pour le footer, en bas du <body>)
   - Et charger ce script en fin de <body> 
       <script src="shared.js"></script>
   - Le script détecte la page courante via window.location.pathname et
     applique automatiquement l'état "actif" sur le bon lien du menu.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Définition des liens de navigation ---------- */
  // Ordre = ordre d'apparition dans le menu.
  // `match` est un tableau de noms de fichiers que le lien doit "matcher"
  // pour être marqué comme actif (utile pour "" = racine = index.html).
  const NAV_LINKS = [
    { href: 'index.html',         label: 'Accueil',         match: ['', 'index.html'] },
    { href: 'collectivites.html', label: 'Collectivités',   match: ['collectivites.html'] },
    { href: 'medico-social.html', label: 'Médico-social',   match: ['medico-social.html'] },
    { href: 'game.html',          label: '🎮 Jouer',        match: ['game.html'] }
  ];

  /* ---------- Détection de la page courante ---------- */
  function getCurrentPage() {
    // Récupère juste le nom de fichier final, ex: "collectivites.html" ou ""
    const path = window.location.pathname;
    const parts = path.split('/');
    return parts[parts.length - 1] || '';
  }

  /* ---------- Construction du HTML du menu ---------- */
  function buildNavHTML() {
    const current = getCurrentPage();

    const linksHTML = NAV_LINKS.map(link => {
      const isActive = link.match.includes(current);
      return `<a href="${link.href}" class="nav-link${isActive ? ' active' : ''}">${link.label}</a>`;
    }).join('');

    return `
      <nav class="top" id="topnav">
        <a href="index.html" class="brand" aria-label="Accueil Lienpourl'autre">
          <img src="logo.png" alt="Lienpourl'autre" class="brand-mark" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span class=&quot;brand-fallback&quot;>Lienpourl\\'autre</span>')">
        </a>

        <button class="nav-toggle" id="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>

        <div class="nav-links" id="nav-links">
          ${linksHTML}
          <a href="${current === 'index.html' || current === '' ? '#contact' : 'index.html#contact'}" class="nav-cta">Nous joindre</a>
        </div>
      </nav>
    `;
  }

  /* ---------- Construction du HTML du footer ---------- */
  function buildFooterHTML() {
    const year = new Date().getFullYear();
    return `
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-col footer-brand-col">
            <div class="footer-brand">Lienpourl'autre</div>
            <p class="footer-tagline">L'habitat qui relie. Coliving solidaire, intergénérationnel, structuré.</p>
            <div class="footer-socials">
              <a href="https://www.linkedin.com/company/lienpourlautre" target="_blank" rel="noopener" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://www.facebook.com/lienpourlautre" target="_blank" rel="noopener" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://x.com/lienpourlautre" target="_blank" rel="noopener" aria-label="X">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          <div class="footer-col">
            <div class="footer-title">Navigation</div>
            <ul class="footer-links">
              <li><a href="index.html">Accueil</a></li>
              <li><a href="collectivites.html">Collectivités locales</a></li>
              <li><a href="medico-social.html">Professionnels médico-social</a></li>
              <li><a href="game.html">🎮 Jouer</a></li>
              <li><a href="index.html#concept">Notre concept</a></li>
              <li><a href="index.html#temoignages">Témoignages</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <div class="footer-title">Nous joindre</div>
            <ul class="footer-links">
              <li><a href="tel:+33671039373">06 71 03 93 73</a></li>
              <li><a href="tel:+33561818981">05 61 81 89 81</a></li>
              <li><a href="tel:+33637136798">06 37 13 67 98</a></li>
              <li><a href="mailto:contact@lienpourlautre.com">contact@lienpourlautre.com</a></li>
              <li><span class="footer-muted">Lun–Sam · 9h30 – 19h</span></li>
            </ul>
          </div>

          <div class="footer-col">
            <div class="footer-title">Mots-clés</div>
            <div class="footer-tags">
              <span class="ftag">#HabitatInclusif</span>
              <span class="ftag">#Coliving</span>
              <span class="ftag">#Solidarité</span>
              <span class="ftag">#Intergénérationnel</span>
              <span class="ftag">#APIPivetauWolfrom</span>
              <span class="ftag">#LuttePrécarité</span>
              <span class="ftag">#MixitéSociale</span>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <span>© ${year} <strong>Lienpourl'autre</strong> · Modèle API (Accompagné · Partagé · Inséré)</span>
          <span class="footer-muted">Accompagné par <a href="https://www.lemouvementassociatif-occitanie.org/adress" target="_blank" rel="noopener">Le Parcours Adress</a></span>
        </div>
      </footer>
    `;
  }

  /* ---------- CSS injecté dynamiquement ---------- */
  /* On l'injecte via <style> pour que les pages secondaires n'aient pas à
     dupliquer ces règles. Les variables CSS (--bleu, etc.) doivent être
     définies dans la page elle-même (dans :root). */
  function buildSharedCSS() {
    return `
      /* ===== Nav (partagé) ===== */
      nav.top{
        position:fixed;top:0;left:0;right:0;
        z-index:100;
        display:flex;align-items:center;justify-content:space-between;
        padding:16px 36px;
        background:rgba(245,239,228,.82);
        backdrop-filter:blur(14px);
        -webkit-backdrop-filter:blur(14px);
        border-bottom:1px solid rgba(48,85,152,.12);
        transition:transform .4s ease;
        gap:20px;
      }
      nav.top.hidden{transform:translateY(-100%)}
      .brand{
        display:flex;align-items:center;gap:12px;
        font-family:var(--ff-display);
        font-weight:800;font-size:1.2rem;
        color:var(--bleu-deep);
        text-decoration:none;
        letter-spacing:-.02em;
        flex-shrink:0;
      }
      .brand-mark{height:36px;width:auto;flex-shrink:0}
      .brand-fallback{font-family:var(--ff-display);font-weight:800}

      .nav-links{
        display:flex;align-items:center;gap:8px;
      }
      .nav-link{
        text-decoration:none;
        color:var(--bleu-deep);
        font-weight:600;
        font-size:.92rem;
        padding:8px 14px;
        border-radius:999px;
        transition:all .25s;
        position:relative;
      }
      .nav-link:hover{color:var(--rose-vif)}
      .nav-link.active{
        color:var(--rose-vif);
        background:rgba(196,98,133,.08);
      }
      .nav-link.active::after{
        content:"";
        position:absolute;
        bottom:2px;left:50%;
        width:5px;height:5px;
        border-radius:50%;
        background:var(--rose-vif);
        transform:translateX(-50%);
      }

      .nav-cta{
        background:var(--bleu);
        color:var(--blanc);
        padding:10px 22px;
        border-radius:999px;
        text-decoration:none;
        font-weight:600;
        font-size:.88rem;
        transition:all .3s;
        border:2px solid var(--bleu);
        margin-left:8px;
      }
      .nav-cta:hover{background:var(--rose-vif);border-color:var(--rose-vif);transform:translateY(-2px)}

      .nav-toggle{
        display:none;
        background:transparent;
        border:none;
        width:36px;height:36px;
        flex-direction:column;justify-content:center;align-items:center;
        gap:5px;
        cursor:pointer;
        padding:0;
      }
      .nav-toggle span{
        display:block;
        width:22px;height:2px;
        background:var(--bleu-deep);
        border-radius:2px;
        transition:transform .3s, opacity .3s;
      }
      .nav-toggle[aria-expanded="true"] span:nth-child(1){transform:translateY(7px) rotate(45deg)}
      .nav-toggle[aria-expanded="true"] span:nth-child(2){opacity:0}
      .nav-toggle[aria-expanded="true"] span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}

      @media (max-width:880px){
        nav.top{padding:12px 16px;gap:10px;flex-wrap:wrap}
        .nav-toggle{display:flex}
        .nav-links{
          display:none;
          flex-basis:100%;
          flex-direction:column;
          align-items:stretch;
          gap:4px;
          padding:14px 0 6px;
          border-top:1px solid rgba(48,85,152,.12);
          margin-top:8px;
        }
        .nav-links.open{display:flex}
        .nav-link{padding:12px 14px;text-align:left}
        .nav-link.active::after{display:none}
        .nav-cta{margin:6px 0 0;text-align:center}
      }

      /* ===== Footer (partagé) ===== */
      .site-footer{
        background:var(--noir);
        color:rgba(245,239,228,.7);
        padding:60px 36px 24px;
        border-top:1px solid rgba(245,239,228,.08);
      }
      .footer-inner{
        max-width:1280px;
        margin:0 auto;
        display:grid;
        grid-template-columns:1.4fr 1fr 1fr 1.2fr;
        gap:48px;
        padding-bottom:40px;
        border-bottom:1px solid rgba(245,239,228,.08);
      }
      .footer-brand{
        font-family:var(--ff-display);
        font-weight:800;
        font-size:1.5rem;
        letter-spacing:-.02em;
        color:var(--creme);
        margin-bottom:10px;
      }
      .footer-tagline{
        font-size:.92rem;
        line-height:1.55;
        color:rgba(245,239,228,.6);
        max-width:300px;
        margin-bottom:18px;
      }
      .footer-socials{display:flex;gap:10px}
      .footer-socials a{
        width:36px;height:36px;
        border-radius:50%;
        background:rgba(245,239,228,.08);
        color:rgba(245,239,228,.8);
        display:flex;align-items:center;justify-content:center;
        text-decoration:none;
        transition:all .25s;
      }
      .footer-socials a:hover{background:var(--rose-vif);color:var(--blanc);transform:translateY(-2px)}

      .footer-title{
        font-family:var(--ff-display);
        font-weight:700;
        font-size:.78rem;
        letter-spacing:.18em;
        text-transform:uppercase;
        color:var(--rose);
        margin-bottom:18px;
      }
      .footer-links{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
      .footer-links a{
        color:rgba(245,239,228,.7);
        text-decoration:none;
        font-size:.92rem;
        transition:color .2s;
      }
      .footer-links a:hover{color:var(--rose)}
      .footer-muted{color:rgba(245,239,228,.45);font-size:.86rem}

      .footer-tags{display:flex;flex-wrap:wrap;gap:6px}
      .ftag{
        display:inline-block;
        font-size:.74rem;
        font-weight:600;
        padding:5px 11px;
        border-radius:999px;
        background:rgba(245,239,228,.06);
        color:rgba(245,239,228,.7);
        border:1px solid rgba(245,239,228,.1);
      }

      .footer-bottom{
        max-width:1280px;
        margin:0 auto;
        padding-top:24px;
        display:flex;
        justify-content:space-between;
        gap:20px;
        flex-wrap:wrap;
        font-size:.84rem;
      }
      .footer-bottom strong{color:var(--creme)}
      .footer-bottom a{color:rgba(245,239,228,.75);text-decoration:underline;text-underline-offset:3px}
      .footer-bottom a:hover{color:var(--vert)}

      @media (max-width:980px){
        .footer-inner{grid-template-columns:1fr 1fr;gap:36px}
      }
      @media (max-width:580px){
        .site-footer{padding:50px 22px 20px}
        .footer-inner{grid-template-columns:1fr;gap:32px}
        .footer-bottom{flex-direction:column}
      }
    `;
  }

  /* ---------- Initialisation : injection dans le DOM ---------- */
  function init() {
    // 1. Injecter le CSS partagé dans <head>
    const style = document.createElement('style');
    style.id = 'shared-styles';
    style.textContent = buildSharedCSS();
    document.head.appendChild(style);

    // 2. Injecter le menu
    const navSlot = document.getElementById('site-nav');
    if (navSlot) {
      navSlot.outerHTML = buildNavHTML();
    }

    // 3. Injecter le footer
    const footerSlot = document.getElementById('site-footer');
    if (footerSlot) {
      footerSlot.outerHTML = buildFooterHTML();
    }

    // 4. Comportements interactifs du menu
    attachNavBehaviors();
  }

  /* ---------- Comportements du menu (hide-on-scroll + burger) ---------- */
  function attachNavBehaviors() {
    const topnav = document.getElementById('topnav');
    if (!topnav) return;

    // Hide-on-scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 200 && y > lastScroll) topnav.classList.add('hidden');
      else topnav.classList.remove('hidden');
      lastScroll = y;
    }, { passive: true });

    // Burger menu (mobile)
    const toggle = document.getElementById('nav-toggle');
    const links  = document.getElementById('nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
      });
      // Fermer le menu quand on clique un lien (UX mobile)
      links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          if (links.classList.contains('open')) {
            links.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
  }

  /* ---------- Lancement ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
