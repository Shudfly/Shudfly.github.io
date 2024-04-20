import { buddyInfo } from "./utils";
let settings = {
    loggedIn: "true",
    loginHash: "0",
    firstTime: "true",
    unlockMatrix: "e30=",
};
export function loadSettings() {
    if (typeof Storage === "undefined")
        return;
    for (var key in settings) {
        const item = localStorage.getItem(key);
        if (item === "undefined" || item === null)
            continue;
        settings[key] = item;
    }
    return settings;
}
export function getSetting(key) {
    return settings[key];
}
export function saveSetting(key, value) {
    if (typeof Storage === "undefined")
        return;
    settings[key] = value;
    localStorage.setItem(key, value);
}
export function getLockStatus(dayIndex, contentIndex) {
    let decodedUnlockMatrix = JSON.parse(atob(settings.unlockMatrix));
    if (!decodedUnlockMatrix[settings.loginHash]) {
        decodedUnlockMatrix[settings.loginHash] = 0;
    }
    let mask = 1 <<
        ((buddyInfo.buddies[settings.loginHash].maxPasswordEntries - 1) * dayIndex +
            contentIndex);
    return (decodedUnlockMatrix[settings.loginHash] & mask) !== 0;
}
export function setLockStatus(dayIndex, contentIndex, value) {
    let decodedUnlockMatrix = JSON.parse(atob(settings.unlockMatrix));
    if (!decodedUnlockMatrix[settings.loginHash]) {
        decodedUnlockMatrix[settings.loginHash] = 0;
    }
    let bitToSet = Math.max(Math.min(value, 1), 0) <<
        ((buddyInfo.buddies[settings.loginHash].maxPasswordEntries - 1) * dayIndex +
            contentIndex);
    decodedUnlockMatrix[settings.loginHash] =
        (decodedUnlockMatrix[settings.loginHash] &
            ~(1 <<
                ((buddyInfo.buddies[settings.loginHash].maxPasswordEntries - 1) *
                    dayIndex +
                    contentIndex))) |
            bitToSet;
    let encodedUnlockMatrix = btoa(JSON.stringify(decodedUnlockMatrix));
    settings.unlockMatrix = encodedUnlockMatrix;
    localStorage.setItem("unlockMatrix", encodedUnlockMatrix);
}
