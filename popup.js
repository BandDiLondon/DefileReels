document.documentElement.lang = chrome.i18n.getUILanguage();
for (const el of document.querySelectorAll("[data-msg]")) {
  el.textContent = chrome.i18n.getMessage(el.dataset.msg);
}

for (const [id, defaut] of [["actif", true], ["passerPubs", true]]) {
  const c = document.getElementById(id);
  chrome.storage.local.get({ [id]: defaut }, (v) => { c.checked = v[id]; });
  c.addEventListener("change", () => chrome.storage.local.set({ [id]: c.checked }));
}
