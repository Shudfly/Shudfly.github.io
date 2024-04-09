"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSetting = exports.loadSettings = exports.settings = void 0;
exports.settings = {
    loggedIn: "true",
    loginHash: "0"
};
function loadSettings() {
    if (typeof Storage === "undefined")
        return;
    for (var key in exports.settings) {
        const item = localStorage.getItem(key);
        if (item === "undefined" || item === null)
            continue;
        exports.settings[key] = item;
    }
    return exports.settings;
}
exports.loadSettings = loadSettings;
function saveSetting(key, value) {
    if (typeof Storage === "undefined")
        return;
    exports.settings[key] = value;
    localStorage.setItem(key, value);
}
exports.saveSetting = saveSetting;
