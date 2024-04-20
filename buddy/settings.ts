import { buddyInfo } from "./utils";

let settings = {
  loggedIn: "true",
  loginHash: "0",
  firstTime: "true",
  unlockMatrix: "e30=",
};

interface IUnlockMatrix {
  [key: string]: number;
}

export function loadSettings() {
  if (typeof Storage === "undefined") return;
  for (var key in settings) {
    const item = localStorage.getItem(key);
    if (item === "undefined" || item === null) continue;
    settings[key as keyof typeof settings] = item;
  }
  return settings;
}

export function getSetting(key: string): any {
  return settings[key as keyof typeof settings];
}

export function saveSetting(key: string, value: string) {
  if (typeof Storage === "undefined") return;
  settings[key as keyof typeof settings] = value;
  localStorage.setItem(key, value);
}

export function getLockStatus(dayIndex: number, contentIndex: number): boolean {
  let decodedUnlockMatrix: IUnlockMatrix = JSON.parse(
    atob(settings.unlockMatrix)
  );
  if (!decodedUnlockMatrix[settings.loginHash]) {
    decodedUnlockMatrix[settings.loginHash] = 0;
  }
  let mask =
    1 <<
    ((buddyInfo.buddies[settings.loginHash].maxPasswordEntries - 1) * dayIndex +
      contentIndex);

  return (decodedUnlockMatrix[settings.loginHash] & mask) !== 0;
}

export function setLockStatus(
  dayIndex: number,
  contentIndex: number,
  value: number
) {
  let decodedUnlockMatrix: IUnlockMatrix = JSON.parse(
    atob(settings.unlockMatrix)
  );
  if (!decodedUnlockMatrix[settings.loginHash]) {
    decodedUnlockMatrix[settings.loginHash] = 0;
  }

  let bitToSet =
    Math.max(Math.min(value, 1), 0) <<
    ((buddyInfo.buddies[settings.loginHash].maxPasswordEntries - 1) * dayIndex +
      contentIndex);

  decodedUnlockMatrix[settings.loginHash] =
    (decodedUnlockMatrix[settings.loginHash] &
      ~(
        1 <<
        ((buddyInfo.buddies[settings.loginHash].maxPasswordEntries - 1) *
          dayIndex +
          contentIndex)
      )) |
    bitToSet;

  let encodedUnlockMatrix = btoa(JSON.stringify(decodedUnlockMatrix));
  settings.unlockMatrix = encodedUnlockMatrix;
  localStorage.setItem("unlockMatrix", encodedUnlockMatrix);
}
