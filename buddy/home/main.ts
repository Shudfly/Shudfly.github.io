import { loadSettings, saveSetting, settings } from "../settings";
import { getBuddyHashes, getPaletteVars } from "../utils";

window.onload = () => {
  const welcomeTitle = document.getElementById("welcome") as HTMLHeadingElement;
  const dayList = document.getElementById("day_list") as HTMLDivElement;

  loadSettings();
  getPaletteVars(
    "https://raw.githubusercontent.com/catppuccin/palette/main/palette.json",
    "mocha"
  ).then(async (data) => {
    for (let key in data) {
      document.documentElement.style.setProperty(key, data[key]);
    }
  });
  let buddyHashes = {};
  getBuddyHashes("../data/info.json").then(async (data) => {
    buddyHashes = data["buddies"];

    let hashValid = false;
    for (let key in buddyHashes) {
      if (settings.loginHash == key) {
        hashValid = true;
        break;
      }
    }
    if (!hashValid || !settings.loggedIn) logout();

    welcomeTitle.textContent = `Welcome, ${
      buddyHashes[settings.loginHash]["name"]
    }!`;

    parseDayEntries(dayList, buddyHashes[settings.loginHash]["days"]);
  });
};

function logout() {
  saveSetting("loggedIn", "false");
  saveSetting("loginHash", "0");
  window.location.href = "..";
}

function parseDayEntries(listElement: HTMLDivElement, dayList: Array<any>) {
  const dayEntryTemplate = listElement.children[0] as HTMLDivElement;
  const lockedEntryTemplate = listElement.children[1] as HTMLDivElement;

  let options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  dayList.forEach((element) => {
    let curEntry: HTMLElement;

    curEntry = lockedEntryTemplate.cloneNode(true) as HTMLDivElement;

    if (!(new Date(Date.parse(element["date"])) > new Date())) {
      curEntry = dayEntryTemplate.cloneNode(true) as HTMLDivElement;
      curEntry.children[1].textContent = element["description"];
    }

    curEntry.children[0].children[0].textContent = element["name"];
    curEntry.children[0].children[1].textContent = (
      element["date"] as String
    ).formatDate(options);
    if (element["passHash"] !== undefined)
      curEntry.classList.add("pass_required");

    listElement.lastChild?.after(curEntry);
  });

  dayEntryTemplate.remove();
  lockedEntryTemplate.remove();
}
