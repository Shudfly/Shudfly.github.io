var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    return date.toLocaleDateString('en-US', options);
};
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
export function getBuddyHashes(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(uri);
        const data = yield response.json();
        if (response.ok) {
            return data;
        }
        else {
            return Promise.reject();
        }
    });
}
