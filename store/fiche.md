# Fiche Chrome Web Store — textes à copier-coller

Paquet : `dist\DefileReels-<version>.zip` (refaire avec `outils\paquet.ps1` après chaque changement, en montant
`version` dans `manifest.json`). Icône 128 : `icons\icon128.png`. Vignette : `store\vignette-440x280.png`
(`outils\vignette.ps1`). Captures : `store\capture-fr-1280x800.png` / `capture-en-1280x800.png` (`outils\captures.ps1`).

Code créé avec Claude (Anthropic), orchestré par BandDiLondon.

## Onglet « Fiche Play Store » / « Store listing »

- **Catégorie** : Divertissement (ou Productivité → Outils).
- **Langues** : français (par défaut) puis English.
- **Descriptions** : texte brut prêt à coller dans [description-fr.txt](description-fr.txt) et
  [description-en.txt](description-en.txt).
- **Site web / assistance** : https://github.com/BandDiLondon/DefileReels

## Onglet « Pratiques de confidentialité » / « Privacy practices »

**Objectif unique / Single purpose**

```
Automatically advance to the next Facebook Reel when the current video finishes playing (optionally skipping sponsored Reels).
```

**Justification de `storage`**

```
Stores two on/off settings locally in the browser: whether auto-scroll is enabled, and whether sponsored Reels are skipped.
```

**Justification de l'autorisation d'hôte (https://www.facebook.com/*, https://web.facebook.com/*)**

```
The content scripts must run on facebook.com to detect when a Reel finishes and click the page's own "Next card" button. Facebook is a single-page app, so the scripts are matched on facebook.com and only act on /reel/ pages. When "skip sponsored Reels" is on, the script checks the current Reel for the "Sponsored" label shown by Facebook and moves to the next one. When the tab is in the background (Chrome suspends rendering, so scrolling no longer works), a page-context script keeps playback going by reporting the tab as visible, and opens the next Reel's URL found in the page. It makes no network requests of its own, and nothing is collected, stored remotely or sent.
```

**Code à distance / Remote code** : *Non, je n'utilise pas de code à distance.*

```
No. All JavaScript is included in the package; nothing is downloaded or evaluated at runtime.
```

**Utilisation des données / Data usage** : ne cocher **aucun** type de donnée. Cocher les trois attestations
(pas de vente, pas d'usage hors objectif, pas d'usage pour le crédit).

**Règles de confidentialité (URL)** : https://github.com/BandDiLondon/DefileReels/blob/main/PRIVACY.md

## Onglet « Distribution »

- Visibilité : **Public**. Régions : toutes. Gratuit.
