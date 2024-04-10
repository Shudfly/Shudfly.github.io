import { getBuddyInfo, initializePage } from "./utils.js";
import { saveSetting, getSetting } from "./settings.js";

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

  initializePage();
  let buddyHashes = {};
  getBuddyInfo().then(async (data) => {
    buddyHashes = data["buddies"];
    console.log(buddyHashes);

    if (eval(getSetting("loggedIn"))) {
      for (let key in buddyHashes) {
        console.log(key);
        
        if (getSetting("loginHash") == key) {
          window.location.href = "./home/";
        }
      }
    }
  });
};
