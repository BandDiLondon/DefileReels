// DefileReels : passe au Reel Facebook suivant quand la vidéo arrive au bout.
// Les Reels tournent en boucle : on repère le retour au début juste après la fin, puis on clique
// « Carte suivante » (ou flèche bas en secours).
// Aucune requête réseau, aucune lecture de cookies, rien n'est stocké ni envoyé.
// Diagnostic : passer DIAGNOSTIC à true, puis console de la page (F12), préfixe [DefileReels].
(() => {
  const DIAGNOSTIC = true;
  const log = DIAGNOSTIC ? (...a) => console.log("[DefileReels]", ...a) : () => {};
  let actif = true;
  // Signale l'état à arriere-plan.js (contexte de la page) par un attribut sur <html>.
  const appliquer = (v) => { actif = v; document.documentElement.dataset.defileReels = v ? "1" : "0"; };
  chrome.storage.local.get({ actif: true }, (v) => appliquer(v.actif));
  chrome.storage.onChanged.addListener((ch) => { if (ch.actif) appliquer(ch.actif.newValue); });
  log("chargé");

  const etat = new WeakMap(); // vidéo -> { src, t }
  let bloqueJusqua = 0;

  const surReels = () => /^\/reels?\//.test(location.pathname);
  const visible = (el) => !!el && el.getClientRects().length > 0;

  function trouverBouton() {
    const selecteurs = [
      "[role='button'][aria-label='Carte suivante']",
      "[role='button'][aria-label='Next card']",
      "[role='button'][aria-label*='suivant' i]",
      "[role='button'][aria-label*='next' i]"
    ];
    for (const s of selecteurs) {
      const b = [...document.querySelectorAll(s)].find(visible);
      if (b) return b;
    }
    return null;
  }

  // Après un rechargement fait par nous en arrière-plan, Facebook démarre en sourdine (page chargée sans
  // clic). Si le son était actif avant, on le réactive : bouton de son de Facebook, sinon la vidéo elle-même.
  // Si Chrome refuse (la vidéo se met en pause), on revient en sourdine pour que la lecture continue, et on
  // réessaie quand l'onglet redevient visible.
  // Il faut passer par le bouton de Facebook : réactiver seulement la vidéo laisse le lecteur de Facebook en
  // sourdine, et il coupe alors le son de tous les Reels suivants.
  const CLE_SON = "defileReels.son";
  function trouverBoutonSon() {
    const selecteurs = [
      "[role='button'][aria-label='Réactiver']",        // Facebook en français
      "[role='button'][aria-label='Activer le son']",
      "[role='button'][aria-label='Unmute']",
      "[role='button'][aria-label*='activer le son' i]",
      "[role='button'][aria-label*='unmute' i]"
    ];
    for (const s of selecteurs) {
      const b = [...document.querySelectorAll(s)].find(visible);
      if (b) return b;
    }
    return null;
  }
  function reactiverSon() {
    let demande = null;
    try { demande = sessionStorage.getItem(CLE_SON); sessionStorage.removeItem(CLE_SON); } catch (e) {}
    if (demande !== "1") return;
    const limite = Date.now() + 15000;

    const essayer = (v, quand) => {
      const bouton = trouverBoutonSon();
      if (bouton) { log("clic sur :", bouton.getAttribute("aria-label"), "(" + quand + ")"); bouton.click(); }
      else log("bouton de son de Facebook introuvable (" + quand + ")");
      setTimeout(() => {
        if (v.muted) {
          log("son réactivé directement sur la vidéo (les Reels suivants risquent d'être muets)");
          v.muted = false;
        }
        setTimeout(() => {
          if (v.paused) {
            log("Chrome refuse le son sans clic : lecture en sourdine, nouvel essai au retour sur l'onglet");
            v.muted = true;
            v.play().catch(() => {});
            const auRetour = () => {
              if (document.hidden) return;
              document.removeEventListener("visibilitychange", auRetour);
              const video = [...document.querySelectorAll("video")].find((x) => visible(x) && !x.paused) || v;
              if (video.muted) essayer(video, "retour sur l'onglet");
            };
            document.addEventListener("visibilitychange", auRetour);
          } else log("son actif :", !v.muted);
        }, 600);
      }, 400);
    };

    const surLecture = (e) => {
      const v = e.target;
      if (!(v instanceof HTMLVideoElement) || !surReels()) return;
      document.removeEventListener("playing", surLecture, true);
      if (Date.now() > limite) return;
      if (!v.muted) { log("son déjà actif"); return; }
      essayer(v, "après rechargement");
    };
    document.addEventListener("playing", surLecture, true);
  }
  reactiverSon();

  function suivant(raison, video) {
    if (Date.now() < bloqueJusqua) { log("demande ignorée (" + raison + ") : saut trop récent"); return; }
    bloqueJusqua = Date.now() + 2500; // évite de sauter deux Reels d'un coup
    const depart = location.href;
    const sonActif = !!video && !video.muted;
    log("fin détectée (" + raison + ")" + (document.hidden ? " — onglet caché" : ""));

    const b = trouverBouton();
    if (b) { log("clic sur :", b.getAttribute("aria-label")); b.click(); }
    else log("bouton suivant introuvable");

    setTimeout(() => {
      if (location.href !== depart) {
        log("passé au Reel suivant :", location.pathname);
        // Onglet caché : Facebook change l'adresse mais ne démarre la vidéo qu'une fois l'onglet affiché.
        // On recharge la page sur ce Reel, qui démarre alors tout seul.
        if (document.hidden) {
          log("onglet caché : rechargement sur ce Reel (son à réactiver : " + sonActif + ")");
          try { sessionStorage.setItem(CLE_SON, sonActif ? "1" : "0"); } catch (e) {}
          location.reload();
        }
        return;
      }
      // Diagnostic pour l'onglet caché : ce qui pourrait servir à ouvrir le Reel suivant directement.
      const liens = [...new Set([...document.querySelectorAll("a[href*='/reel/']")]
        .map((a) => (a.getAttribute("href").match(/\/reel\/(\d+)/) || [])[1]).filter(Boolean))];
      log("toujours sur le même Reel : flèche bas. Liens /reel/ dans la page :", liens.length,
        "| vidéos :", document.querySelectorAll("video").length);
      for (const cible of [document.activeElement || document.body, document]) {
        cible.dispatchEvent(new KeyboardEvent("keydown", {
          key: "ArrowDown", code: "ArrowDown", keyCode: 40, which: 40, bubbles: true
        }));
      }
    }, 900);
  }

  document.addEventListener("timeupdate", (e) => {
    const v = e.target;
    if (!(v instanceof HTMLVideoElement) || !actif || !surReels()) return;
    if (!(v.duration > 0) || v.paused) return;

    const t = v.currentTime;
    const avant = etat.get(v);
    etat.set(v, { src: v.currentSrc, t });
    if (!avant || avant.src !== v.currentSrc) return; // nouvelle vidéo : on repart à zéro

    // Bouclage : on était dans la dernière seconde et demie, et on est revenu au tout début.
    if (avant.t > v.duration - 1.5 && t < 1.5 && t < avant.t - 1) suivant("bouclage", v);
  }, true);

  // Option : passer tout de suite les Reels « Commandité ».
  let passerPubs = true;
  chrome.storage.local.get({ passerPubs: true }, (v) => { passerPubs = v.passerPubs; });
  chrome.storage.onChanged.addListener((ch) => { if (ch.passerPubs) passerPubs = ch.passerPubs.newValue; });
  const MOTS_PUB = /(^|\s)(Commandité|Sponsorisé|Sponsored)(\s|$)/i;
  const verifies = new WeakMap(); // vidéo -> src déjà vérifiée

  // Le bloc du Reel de cette vidéo : on remonte tant qu'il ne contient qu'une seule vidéo.
  function blocDuReel(v) {
    let el = v;
    for (let i = 0; i < 15 && el.parentElement; i++) {
      if (el.parentElement.querySelectorAll("video").length > 1) break;
      el = el.parentElement;
    }
    return el;
  }
  // Texte « visible » d'un élément, lettres recollées (Facebook découpe parfois le mot en morceaux).
  const texteRecolle = (el) => (el.innerText || "").replace(/\s+/g, " ").trim();

  function estCommandite(v) {
    // 1. Dans le bloc du Reel (texte et aria-label)
    const bloc = blocDuReel(v);
    if (MOTS_PUB.test(texteRecolle(bloc))) return "bloc du Reel";
    if ([...bloc.querySelectorAll("[aria-label]")].some((e) => MOTS_PUB.test(e.getAttribute("aria-label"))))
      return "aria-label du bloc";

    // 2. N'importe quel petit élément visible posé sur la vidéo (ou juste à côté) qui dit « Commandité »
    const r = v.getBoundingClientRect();
    const zone = { g: r.left - 40, d: r.right + 120, h: r.top, b: r.bottom };
    for (const el of document.querySelectorAll("span, a, div[role='button'], [aria-label]")) {
      if (el.childElementCount > 6) continue;
      const t = el.getAttribute("aria-label") || texteRecolle(el);
      if (!t || t.length > 40 || !MOTS_PUB.test(t)) continue;
      const e = el.getBoundingClientRect();
      if (!e.width || !e.height) continue;
      const cx = e.left + e.width / 2, cy = e.top + e.height / 2;
      if (cx >= zone.g && cx <= zone.d && cy >= zone.h && cy <= zone.b) return "élément sur la vidéo";
    }
    return null;
  }

  function diagnostic(v) {
    const bloc = blocDuReel(v);
    const mots = [...document.querySelectorAll("span, a")]
      .map((el) => texteRecolle(el))
      .filter((t) => /comm|spons/i.test(t) && t.length < 60);
    log("Reel :", location.pathname, "| texte du bloc :", JSON.stringify(texteRecolle(bloc).slice(0, 160)),
      "| mots « comm/spons » dans la page :", JSON.stringify([...new Set(mots)].slice(0, 8)));
  }

  document.addEventListener("playing", (e) => {
    const v = e.target;
    if (!(v instanceof HTMLVideoElement) || !actif || !passerPubs || !surReels()) return;
    if (verifies.get(v) === v.currentSrc) return;
    verifies.set(v, v.currentSrc);
    // Laisser à Facebook le temps d'afficher l'auteur et la mention.
    const src = v.currentSrc;
    const page = location.pathname;
    // Attendre que Facebook affiche la mention (1,5 s), et que la protection anti-double-saut soit levée,
    // sinon suivant() ignorerait la demande.
    // Après un rechargement, la mention arrive parfois plus tard : on revérifie à +2,5 s et +5 s.
    const delai = Math.max(1500, bloqueJusqua - Date.now() + 150);
    const verifier = (essai) => {
      if (v.paused || v.currentSrc !== src || location.pathname !== page) return;
      if (DIAGNOSTIC && essai === 1) diagnostic(v);
      const ou = estCommandite(v);
      if (ou) { log("Reel commandité (" + ou + ", essai " + essai + ") : on passe"); suivant("commandité", v); }
      else if (essai < 3) setTimeout(() => verifier(essai + 1), 2500);
    };
    setTimeout(() => verifier(1), delai);
  }, true);

  document.addEventListener("ended", (e) => {
    if (e.target instanceof HTMLVideoElement && actif && surReels()) suivant("ended", e.target);
  }, true);
})();
