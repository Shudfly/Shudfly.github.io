var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadSettings, saveSetting, settings } from "../settings";
import { getBuddyHashes, getPaletteVars } from "../utils";
window.onload = () => {
    const welcomeTitle = document.getElementById("welcome");
    const dayList = document.getElementById("day_list");
    loadSettings();
    getPaletteVars("https://raw.githubusercontent.com/catppuccin/palette/main/palette.json", "mocha").then((data) => __awaiter(void 0, void 0, void 0, function* () {
        for (let key in data) {
            document.documentElement.style.setProperty(key, data[key]);
        }
    }));
    let buddyHashes = {};
    getBuddyHashes("../data/info.json").then((data) => __awaiter(void 0, void 0, void 0, function* () {
        buddyHashes = data["buddies"];
        let hashValid = false;
        for (let key in buddyHashes) {
            if (settings.loginHash == key) {
                hashValid = true;
                break;
            }
        }
        if (!hashValid || !settings.loggedIn)
            logout();
        welcomeTitle.textContent = `Welcome, ${buddyHashes[settings.loginHash]["name"]}!`;
        parseDayEntries(dayList, buddyHashes[settings.loginHash]["days"]);
    }));
};
function logout() {
    saveSetting("loggedIn", "false");
    saveSetting("loginHash", "0");
    window.location.href = "..";
}
function parseDayEntries(listElement, dayList) {
    const dayEntryTemplate = listElement.children[0];
    const lockedEntryTemplate = listElement.children[1];
    let options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    };
    dayList.forEach((element) => {
        var _a;
        let curEntry;
        curEntry = lockedEntryTemplate.cloneNode(true);
        if (!(new Date(Date.parse(element["date"])) > new Date())) {
            curEntry = dayEntryTemplate.cloneNode(true);
            curEntry.children[1].textContent = element["description"];
        }
        curEntry.children[0].children[0].textContent = element["name"];
        curEntry.children[0].children[1].textContent = element["date"].formatDate(options);
        if (element["passHash"] !== undefined)
            curEntry.classList.add("pass_required");
        (_a = listElement.lastChild) === null || _a === void 0 ? void 0 : _a.after(curEntry);
    });
    dayEntryTemplate.remove();
    lockedEntryTemplate.remove();
}
