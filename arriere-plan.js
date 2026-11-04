// DefileReels — continuer quand l'onglet est en arrière-plan.
// Exécuté dans le contexte de la page (world MAIN) dès le chargement, seulement sur facebook.com.
// N'agit que sur les pages /reel/ et seulement si l'interrupteur est activé
// (defile.js le signale par l'attribut data-defile-reels sur <html>).
// 1. Facebook croit l'onglet visible : il ne met pas les Reels en pause.
// 2. Onglet caché : Chrome ne déclenche plus requestAnimationFrame ; on le remplace par une minuterie.
// Aucune requête réseau, rien n'est lu, stocké ni envoyé.
(() => {
  const actif = () =>
    /^\/reels?\//.test(location.pathname) &&
    document.documentElement.dataset.defileReels !== "0";

  const proto = Document.prototype;
  const vraiHidden = Object.getOwnPropertyDescriptor(proto, "hidden").get;
  const vraiEtat = Object.getOwnPropertyDescriptor(proto, "visibilityState").get;
  const vraimentCache = () => vraiHidden.call(document);

  Object.defineProperty(proto, "hidden", {
    configurable: true,
    get() { return actif() ? false : vraiHidden.call(this); }
  });
  Object.defineProperty(proto, "visibilityState", {
    configurable: true,
    get() { return actif() ? "visible" : vraiEtat.call(this); }
  });
  const webkit = Object.getOwnPropertyDescriptor(proto, "webkitHidden");
  if (webkit && webkit.get) {
    Object.defineProperty(proto, "webkitHidden", {
      configurable: true,
      get() { return actif() ? false : webkit.get.call(this); }
    });
  }
  const vraiFocus = Document.prototype.hasFocus;
  Document.prototype.hasFocus = function () { return actif() ? true : vraiFocus.call(this); };

  const bloquer = (e) => { if (actif()) e.stopImmediatePropagation(); };
  for (const type of ["visibilitychange", "blur"]) {
    window.addEventListener(type, bloquer, true);
    document.addEventListener(type, bloquer, true);
  }

  const vraiRAF = window.requestAnimationFrame.bind(window);
  const vraiCancel = window.cancelAnimationFrame.bind(window);
  const minuteries = new Map();
  let suivant = 1;

  window.requestAnimationFrame = function (rappel) {
    if (!(actif() && vraimentCache())) return vraiRAF(rappel);
    const id = -(suivant++); // négatif : pas de collision avec les identifiants de Chrome
    minuteries.set(id, setTimeout(() => {
      minuteries.delete(id);
      rappel(performance.now());
    }, 16));
    return id;
  };
  window.cancelAnimationFrame = function (id) {
    if (minuteries.has(id)) {
      clearTimeout(minuteries.get(id));
      minuteries.delete(id);
    } else {
      vraiCancel(id);
    }
  };
})();
