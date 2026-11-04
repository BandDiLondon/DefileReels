# DefileReels — Règles de confidentialité / Privacy policy

*Dernière mise à jour / Last updated: 2026-11-03*

## Français

DefileReels ne recueille, ne stocke à distance, ne vend et ne transmet **aucune donnée**.

- L'extension n'envoie **aucune requête réseau** : elle ne contacte aucun serveur, ni le nôtre ni celui d'un tiers.
- Elle ne lit ni cookies, ni historique, ni identifiants de connexion.
- Elle s'exécute seulement sur `facebook.com`, et n'agit que sur les pages Reels : elle repère la fin de la vidéo
  et clique sur le bouton « Carte suivante » de la page.
- Avec l'option « Passer les Reels commandités », elle cherche la mention « Commandité » / « Sponsored » sur le Reel
  affiché, sur place, sans rien conserver ni envoyer.
- Sur les pages Reels, elle indique à Facebook que l'onglet est visible, pour que la lecture continue en
  arrière-plan.
- Quand elle recharge la page en arrière-plan, elle note dans le `sessionStorage` de l'onglet si le son était actif,
  pour le réactiver ; cette note est effacée aussitôt relue.
- Les seuls réglages enregistrés sont les deux interrupteurs, gardés **localement** dans votre navigateur
  (`chrome.storage.local`). Ils sont effacés quand vous désinstallez l'extension.

## English

DefileReels collects, remotely stores, sells and transmits **no data at all**.

- The extension makes **no network requests**: it contacts no server, neither ours nor any third party's.
- It reads no cookies, history or login credentials.
- It runs only on `facebook.com` and only acts on Reels pages: it detects when the video ends and clicks the page's
  own "Next card" button.
- With "Skip sponsored Reels" on, it looks for the "Sponsored" label on the Reel being shown, in place, keeping and
  sending nothing.
- On Reels pages, it tells Facebook the tab is visible, so playback continues in the background.
- When it reloads the page in the background, it notes in the tab's `sessionStorage` whether sound was on, to
  restore it; the note is erased as soon as it is read.
- The only stored settings are the two switches, kept **locally** in your browser (`chrome.storage.local`). They
  are removed when you uninstall the extension.
