var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getSetting, loadSettings, saveSetting } from "./settings.js";
String.prototype.hashCode = function (seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < this.length; i++) {
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
String.prototype.formatDate = function (options) {
    let date = new Date(Date.parse(this));
    return date.toLocaleDateString("en-US", options);
};
export var dayEntryContentTypes;
(function (dayEntryContentTypes) {
    dayEntryContentTypes[dayEntryContentTypes["PASSWORD"] = 0] = "PASSWORD";
    dayEntryContentTypes[dayEntryContentTypes["TEXT_PASSWORD"] = 1] = "TEXT_PASSWORD";
    dayEntryContentTypes[dayEntryContentTypes["TEXT"] = 2] = "TEXT";
    dayEntryContentTypes[dayEntryContentTypes["IMAGE"] = 3] = "IMAGE";
    dayEntryContentTypes[dayEntryContentTypes["TEXT_IMAGE"] = 4] = "TEXT_IMAGE";
})(dayEntryContentTypes || (dayEntryContentTypes = {}));
export let buddyInfo;
export function initializePage() {
    return __awaiter(this, void 0, void 0, function* () {
        loadSettings();
        getPaletteVars("https://raw.githubusercontent.com/catppuccin/palette/main/palette.json", "mocha").then((data) => __awaiter(this, void 0, void 0, function* () {
            for (let key in data) {
                document.documentElement.style.setProperty(key, data[key]);
            }
        }), (reason) => __awaiter(this, void 0, void 0, function* () {
            return Promise.reject(reason);
        }));
        checkLoginValidity();
    });
}
export function initializePassInput(element, onInput) {
    element.classList.add("pass_input");
    element.oninput = onInput;
    element.onfocus = () => {
        var _a;
        (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.animate({
            background: "var(--surface0-hex)",
            border: "solid 1px var(--mauve-hex)",
        }, { duration: 100, fill: "forwards" });
    };
    element.addEventListener("focusout", () => {
        var _a;
        (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.animate({
            border: "solid 1px var(--red-hex)",
        }, { duration: 100, fill: "forwards" });
    });
}
export function getPaletteVars(uri, themeID) {
    return __awaiter(this, void 0, void 0, function* () {
        let paletteVars = {};
        const response = yield fetch(uri);
        const data = yield response.json();
        if (response.ok) {
            const themeColors = data[themeID]["colors"];
            for (var key in themeColors) {
                paletteVars[`--${key}-hex`] = themeColors[key]["hex"];
            }
            return paletteVars;
        }
        else {
            return Promise.reject();
        }
    });
}
export function getBuddyInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("/buddy/data/info.json", { cache: "no-store" });
        const data = yield response.json();
        if (response.ok) {
            return data;
        }
        else {
            return Promise.reject();
        }
    });
}
export function checkLoginValidity() {
    if (!eval(getSetting("loginHash"))) {
        logout();
    }
    getBuddyInfo().then((data) => __awaiter(this, void 0, void 0, function* () {
        buddyInfo = data;
        let valid = false;
        for (let key in buddyInfo.buddies) {
            if (getSetting("loginHash") === key) {
                valid = true;
                break;
            }
        }
        if (!valid)
            logout();
    }), () => {
        logout();
    });
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
    if (!window.location.href.endsWith("buddy/"))
        window.location.href = "/buddy/";
}
