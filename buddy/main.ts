import { getPaletteVars, getBuddyHashes } from "./utils";
import { settings, loadSettings, saveSetting } from "./settings";

window.onload = () => {
  const passInput: HTMLInputElement =
    (document.getElementById("pass_input") as HTMLInputElement) ??
    new HTMLInputElement();

  passInput.onfocus = () => {
    passInput.parentElement?.animate(
      {
        background: "var(--surface0-hex)",
        border: "solid 1px var(--mauve-hex)",
      },
      { duration: 100, fill: "forwards" }
    );
  };
  passInput.addEventListener("focusout", () => {
    passInput.parentElement?.animate(
      {
        border: "solid 1px var(--red-hex)",
      },
      { duration: 100, fill: "forwards" }
    );
  });
  passInput.oninput = () => {
    for (let key in buddyHashes) {
      if (passInput.value.hashCode() === parseInt(key)) {
        saveSetting("loggedIn", "true");
        saveSetting("loginHash", key);
        window.location.href = "./home/";
      }
    }
  };

  loadSettings();
  let buddyHashes: any = {};
  getBuddyHashes("./data/info.json").then(async (data) => {
    buddyHashes = data["buddies"];

    if (eval(settings.loggedIn)) {
      for (let key in buddyHashes) {
        if (settings.loginHash == key) {
          window.location.href = "./home/";
          return;
        }
      }
    }

    saveSetting("loggedIn", "false");
  });

  getPaletteVars(
    "https://raw.githubusercontent.com/catppuccin/palette/main/palette.json",
    "mocha"
  ).then(async (data) => {
    for (let key in data) {
      document.documentElement.style.setProperty(key, data[key]);
    }
  });
};
