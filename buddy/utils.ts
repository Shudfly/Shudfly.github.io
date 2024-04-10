import { loadSettings, saveSetting, settings } from "./settings.js";

declare global {
  interface String {
    hashCode(seed?: number): number;
    formatDate(options: any): string;
  }
}

String.prototype.hashCode = function (seed = 0): number {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch: number; i < this.length; i++) {
    ch = this.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

String.prototype.formatDate = function (options: any): string {
  let date = new Date(Date.parse(this as string));

  return date.toLocaleDateString("en-US", options);
};

export {};

export enum dayEntryContentTypes {
  PASSWORD,
  TEXT,
  IMAGE,
  TEXT_IMAGE
}

export async function initializePage(): Promise<any> {
  loadSettings();

  getPaletteVars(
    "https://raw.githubusercontent.com/catppuccin/palette/main/palette.json",
    "mocha"
  ).then(
    async (data) => {
      for (let key in data) {
        document.documentElement.style.setProperty(key, data[key]);
      }
    },
    async (reason) => {
      return Promise.reject(reason);
    }
  );

  checkLoginValidity();
}

export function initializePassInput(element: HTMLInputElement, onInput: () => void) {
  element.classList.add("pass_input");
  element.oninput = onInput;
  element.onfocus = () => {
    element.parentElement?.animate(
      {
        background: "var(--surface0-hex)",
        border: "solid 1px var(--mauve-hex)",
      },
      { duration: 100, fill: "forwards" }
    );
  };
  element.addEventListener("focusout", () => {
    element.parentElement?.animate(
      {
        border: "solid 1px var(--red-hex)",
      },
      { duration: 100, fill: "forwards" }
    );
  });
}

export async function getPaletteVars(
  uri: string,
  themeID: string
): Promise<any> {
  let paletteVars: any = {};

  const response = await fetch(uri);

  const data = await response.json();
  if (response.ok) {
    const themeColors = data[themeID]["colors"];
    for (var key in themeColors) {
      paletteVars[`--${key}-hex`] = themeColors[key]["hex"];
    }

    return paletteVars;
  } else {
    return Promise.reject();
  }
}

export async function getBuddyInfo(): Promise<any> {
  const response = await fetch("/buddy/data/info.json", { cache: "no-store" });

  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    return Promise.reject();
  }
}

export function checkLoginValidity() {
  if (!eval(settings.loggedIn)) {
    logout();
  }

  getBuddyInfo().then(
    async (data) => {
      let valid = false;
      for (let key in data["buddies"]) {
        if (settings.loginHash === key) {
          valid = true;
          break;
        }
      }
      if (!valid) logout();
    },
    () => {
      logout();
    }
  );
}

/*
export function rotateElement(element: HTMLElement, by: number) {
  let transformValue = element.style.getPropertyValue("transform");
  let prevRotation = transformValue.match("/(?!rotate\()\d+\w*(?=\))/g")?.join();

  if (prevRotation === "" || prevRotation === null) {
    element.style.setProperty("transform", `${transformValue} rotate(${by}deg)`);
    return;
  }

  let newRotation = prevRotation?.match("/\d+/g")

  element.style.setProperty(transformValue.replace)
}
*/

export function logout() {
  saveSetting("loggedIn", "false");
  saveSetting("loginHash", "0");
  if (!window.location.href.endsWith("buddy/")) window.location.href = "/buddy/";
}
