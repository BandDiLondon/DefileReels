<p align="center">
  <img src="icons/icon128.png" width="96" alt="DefileReels">
</p>

<h1 align="center">DefileReels</h1>

<p align="center">
  <b>Au Reel suivant, automatiquement.</b> · <b>Next Reel, automatically.</b><br>
  Extension Chrome pour les Reels Facebook · Aucune donnée recueillie · No data collected
</p>

<p align="center">
  <img alt="Bêta" src="https://img.shields.io/badge/statut-b%C3%AAta-f59e0b">
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
- Continue quand l'onglet est en arrière-plan.
- Agit seulement sur les pages Reels de `facebook.com`.
- **Aucune donnée recueillie, aucune requête réseau, aucun cookie lu.** Voir [PRIVACY.md](PRIVACY.md).

**Statut : bêta.** Le défilement au premier plan et le passage au Reel suivant en arrière-plan sont validés. Le saut
des Reels commandités et la réactivation du son en arrière-plan sont en test. Les messages de diagnostic sont
activés dans la console (F12, filtre `DefileReels`).

### Installer

Pas encore sur le Chrome Web Store. `chrome://extensions` → activer **Mode développeur** → **Charger l'extension
non empaquetée** → choisir ce dossier (bouton vert **Code** → **Download ZIP**, puis extraire). Ne pas déplacer le
dossier ensuite. Après une mise à jour : **Recharger** sur la carte de l'extension, puis F5 sur Facebook.

### Comment ça marche

- **Fin du Reel** : le script écoute `timeupdate` et `ended` sur la vidéo et repère le bouclage (retour au début
  juste après la fin). Il clique alors le bouton « Carte suivante » / « Next card » du lecteur, sinon il simule la
  flèche bas.
- **Reels commandités** : quand un Reel démarre, le script cherche la mention « Commandité » / « Sponsorisé » /
  « Sponsored » dans le bloc du Reel ou par-dessus la vidéo, et passe au suivant.
- **Onglet en arrière-plan** : Chrome y suspend l'affichage. [arriere-plan.js](arriere-plan.js), exécuté dans le
  contexte de la page (`world: MAIN`) et seulement sur les pages Reels quand l'interrupteur est activé, fait croire
  à Facebook que l'onglet est visible et remplace `requestAnimationFrame` par une minuterie. Facebook change alors
  bien de Reel, mais n'en démarre la vidéo qu'une fois l'onglet affiché : le script recharge donc la page sur le
  nouveau Reel, puis réactive le son s'il était actif.

## English

Chrome extension that automatically moves to the next Facebook Reel when the current one ends.

- Two switches in the extension menu: **Auto-scroll** and **Skip sponsored Reels**.
- Keeps going when the tab is in the background.
- Acts only on `facebook.com` Reels pages.
- **No data collected, no network requests, no cookies read.** See [PRIVACY.md](PRIVACY.md).

**Status: beta.** Foreground auto-scroll and moving to the next Reel in a background tab work. Skipping sponsored
Reels and restoring sound in the background are being tested. Diagnostic messages are on in the console.
The interface is in French for now.

### Install

Not on the Chrome Web Store yet. `chrome://extensions` → turn on **Developer mode** → **Load unpacked** → pick this
folder (green **Code** button → **Download ZIP**, then extract). Do not move the folder afterwards.

### How it works

The script watches `timeupdate` and `ended` on the video, detects the loop back to the start, then clicks the
player's own "Next card" button (falls back to a simulated Down arrow). Sponsored Reels are detected by their
"Sponsored" label and skipped. In a background tab, [arriere-plan.js](arriere-plan.js) (page context, Reels pages
only) reports the tab as visible and replaces the suspended `requestAnimationFrame`; Facebook still waits for the
tab to be shown before starting the next video, so the script reloads the page on the new Reel and restores sound
if it was on.

## Licence / License

GPL-3.0-or-later — voir / see [LICENSE](LICENSE).

DefileReels est un projet indépendant, sans lien avec Meta ni Facebook. / DefileReels is an independent project,
not affiliated with Meta or Facebook.
