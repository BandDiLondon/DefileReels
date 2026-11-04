for (const [id, defaut] of [["actif", true], ["passerPubs", true]]) {
  const c = document.getElementById(id);
  chrome.storage.local.get({ [id]: defaut }, (v) => { c.checked = v[id]; });
  c.addEventListener("change", () => chrome.storage.local.set({ [id]: c.checked }));
}
