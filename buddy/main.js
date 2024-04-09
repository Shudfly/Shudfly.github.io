"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const settings_1 = require("./settings");
window.onload = () => {
    var _a;
    const passInput = (_a = document.getElementById("pass_input")) !== null && _a !== void 0 ? _a : new HTMLInputElement();
    passInput.onfocus = () => {
        var _a;
        (_a = passInput.parentElement) === null || _a === void 0 ? void 0 : _a.animate({
            background: "var(--surface0-hex)",
            border: "solid 1px var(--mauve-hex)",
        }, { duration: 100, fill: "forwards" });
    };
    passInput.addEventListener("focusout", () => {
        var _a;
        (_a = passInput.parentElement) === null || _a === void 0 ? void 0 : _a.animate({
            border: "solid 1px var(--red-hex)",
        }, { duration: 100, fill: "forwards" });
    });
    passInput.oninput = () => {
        for (let key in buddyHashes) {
            if (passInput.value.hashCode() === parseInt(key)) {
                (0, settings_1.saveSetting)("loggedIn", "true");
                (0, settings_1.saveSetting)("loginHash", key);
                window.location.href = "./home/";
            }
        }
    };
    (0, settings_1.loadSettings)();
    let buddyHashes = {};
    (0, utils_1.getBuddyHashes)("./data/info.json").then((data) => __awaiter(void 0, void 0, void 0, function* () {
        buddyHashes = data["buddies"];
        if (eval(settings_1.settings.loggedIn)) {
            for (let key in buddyHashes) {
                if (settings_1.settings.loginHash == key) {
                    window.location.href = "./home/";
                    return;
                }
            }
        }
        (0, settings_1.saveSetting)("loggedIn", "false");
    }));
    (0, utils_1.getPaletteVars)("https://raw.githubusercontent.com/catppuccin/palette/main/palette.json", "mocha").then((data) => __awaiter(void 0, void 0, void 0, function* () {
        for (let key in data) {
            document.documentElement.style.setProperty(key, data[key]);
        }
    }));
};
