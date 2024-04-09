export let settings = {
  loggedIn: "true",
  loginHash: "0"
}

export function loadSettings() {
  if (typeof Storage === "undefined") return;
  for (var key in settings) {
    const item = localStorage.getItem(key);
    if (item === "undefined" || item === null) continue;
    settings[key as keyof typeof settings] = item;
  }
  return settings;
}

export function saveSetting(key: string, value: string) {
  if (typeof Storage === "undefined") return;
  settings[key as keyof typeof settings] = value;
  localStorage.setItem(key, value);
}