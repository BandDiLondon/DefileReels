<p align="center">
  <img src="icons/icon128.png" width="96" alt="DefileReels">
</p>

<h1 align="center">DefileReels</h1>

<p align="center">
  <b>Au Reel suivant, automatiquement.</b> · <b>Next Reel, automatically.</b><br>
  Extension Chrome pour les Reels Facebook · Aucune donnée recueillie · No data collected
</p>

<p align="center">
  <a href="https://github.com/BandDiLondon/DefileReels/releases/latest"><img alt="Version 1.0.0" src="https://img.shields.io/badge/version-1.0.0-16a34a"></a>
  <a href="LICENSE"><img alt="Licence GPL-3.0" src="https://img.shields.io/badge/licence-GPL--3.0-blue"></a>
  <img alt="Manifest V3" src="https://img.shields.io/badge/Chrome-Manifest%20V3-2563eb">
  <img alt="Aucune requête réseau" src="https://img.shields.io/badge/r%C3%A9seau-aucun-06b6d4">
</p>

> **Fait avec une IA, en toute transparence.** **Code créé avec Claude (Anthropic), orchestré par BandDiLondon**, qui a défini le besoin,
> testé et validé chaque version.
>
> **Built with AI, openly.** **Code created with Claude (Anthropic), orchestrated by BandDiLondon**, who defined the
> need and tested and approved every version.

Petite sœur de [DefileShorts](https://github.com/BandDiLondon/DefileShorts) (Shorts YouTube).
Sister project of [DefileShorts](https://github.com/BandDiLondon/DefileShorts) (YouTube Shorts).

[Français](#français) · [English](#english)

## Français

Extension Chrome qui passe automatiquement au Reel Facebook suivant quand la vidéo en cours se termine.

- Deux cases dans le menu de l'extension : **Défilement automatique** et **Passer les Reels commandités**.
- Onglet en arrière-plan : **son coupé**, le défilement continue ; **son actif**, le Reel fini reste en pause et
  l'extension passe au suivant dès que tu reviens sur l'onglet (Chrome ne joue pas le son d'un Reel lancé dans un
  onglet caché, autant ne pas en passer dans le vide).
- Agit seulement sur les pages Reels de `facebook.com`. Interface en français et en anglais.
- **Aucune donnée recueillie, aucune requête réseau, aucun cookie lu.** Voir [PRIVACY.md](PRIVACY.md).

> **Bloqueur de pubs (AdBlock et autres)** : sur un Reel commandité, AdBlock peut masquer toute la page Facebook
> (écran vide, plus rien ne défile). Mettre `facebook.com` dans sa liste blanche : DefileReels saute déjà les pubs.

### Installer

Pas encore sur le Chrome Web Store. Télécharger `DefileReels-<version>-installation.zip` dans la
[dernière release](https://github.com/BandDiLondon/DefileReels/releases/latest) et suivre `INSTALLER.txt`, en bref :
extraire, `chrome://extensions` → **Mode développeur** → **Charger l'extension non empaquetée** → choisir le dossier
`DefileReels`. Ne pas le déplacer ensuite. Mise à jour : remplacer le contenu du dossier, **Recharger** sur la carte
de l'extension, puis F5 sur Facebook.

Diagnostic : passer `DIAGNOSTIC` à `true` en haut de [defile.js](defile.js), puis console de la page (F12, filtre
`DefileReels`).

### Comment ça marche

- **Fin du Reel** : le script écoute `timeupdate` et `ended` sur la vidéo et repère le bouclage (retour au début
  juste après la fin). Il clique alors le bouton « Carte suivante » / « Next card » du lecteur, sinon il simule la
  flèche bas.
- **Reels commandités** : quand un Reel démarre, le script cherche la mention « Commandité » / « Sponsorisé » /
  « Sponsored » dans le bloc du Reel ou par-dessus la vidéo (vérifié à 1,5 s, 4 s et 6,5 s), et passe au suivant.
- **Onglet en arrière-plan** : Chrome y suspend l'affichage. [arriere-plan.js](arriere-plan.js), exécuté dans le
  contexte de la page (`world: MAIN`) et seulement sur les pages Reels quand l'interrupteur est activé, fait croire
  à Facebook que l'onglet est visible et remplace `requestAnimationFrame` par une minuterie. Facebook change alors
  bien de Reel, mais n'en démarre la vidéo qu'une fois l'onglet affiché : sans son, le script recharge la page sur
  le nouveau Reel, qui démarre tout seul. Avec le son, il met le Reel fini en pause (et l'y remet si Facebook le
  relance) et passe au suivant au retour sur l'onglet, où il clique au besoin le bouton « Réactiver » de Facebook.

## English

Chrome extension that automatically moves to the next Facebook Reel when the current one ends.

- Two switches in the extension menu: **Auto-scroll** and **Skip sponsored Reels**.
- Background tab: **sound off**, scrolling goes on; **sound on**, the finished Reel stays paused and the extension
  moves on as soon as you come back to the tab (Chrome does not play sound for a Reel started in a hidden tab, so
  there is no point skipping through them silently).
- Acts only on `facebook.com` Reels pages. French and English interface.
- **No data collected, no network requests, no cookies read.** See [PRIVACY.md](PRIVACY.md).

> **Ad blockers (AdBlock and others)**: on a sponsored Reel, AdBlock may hide the whole Facebook page (blank screen,
> nothing scrolls any more). Allow-list `facebook.com` in it: DefileReels already skips the ads.

### Install

Not on the Chrome Web Store yet. Download `DefileReels-<version>-installation.zip` from the
[latest release](https://github.com/BandDiLondon/DefileReels/releases/latest) and follow `INSTALLER.txt`, in short:
extract, `chrome://extensions` → **Developer mode** → **Load unpacked** → pick the `DefileReels` folder. Do not move
it afterwards. To update: replace the folder contents, click **Reload** on the extension card, then F5 on Facebook.

### How it works

The script watches `timeupdate` and `ended` on the video, detects the loop back to the start, then clicks the
player's own "Next card" button (falls back to a simulated Down arrow). Sponsored Reels are detected by their
"Sponsored" label and skipped. In a background tab, [arriere-plan.js](arriere-plan.js) (page context, Reels pages
only) reports the tab as visible and replaces the suspended `requestAnimationFrame`; Facebook still waits for the
tab to be shown before starting the next video. With sound off, the script reloads the page on the new Reel, which
then starts on its own. With sound on, it keeps the finished Reel paused and moves on when you return to the tab.

## Licence / License

GPL-3.0-or-later — voir / see [LICENSE](LICENSE).

DefileReels est un projet indépendant, sans lien avec Meta ni Facebook. / DefileReels is an independent project,
not affiliated with Meta or Facebook.
