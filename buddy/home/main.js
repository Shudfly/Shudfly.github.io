var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getSetting, saveSetting } from "../settings.js";
import { dayEntryContentTypes, getBuddyInfo, initializePage, initializePassInput, } from "../utils.js";
window.onload = () => {
    //#region Element definitions
    // Main window
    const appElement = document.getElementById("app");
    const welcomeTitleElement = document.getElementById("welcome");
    const dayListElement = document.getElementById("day_list");
    // Instruction popup
    const instructionsElement = document.getElementById("instructions");
    const instructionsCloseElement = document.getElementById("instr_close");
    // Day entry content popup
    const dayEntryContentElement = document.getElementById("day_entry_content");
    const dayEntryContentCloseElement = document.getElementById("daenco_close");
    const iconButtonLabelElements = document.getElementsByClassName("icon_button");
    //#endregion
    instructionsCloseElement.onclick = () => hideInstructions(appElement, instructionsElement);
    dayEntryContentCloseElement.onclick = () => {
        hideDayEntryContent(appElement, dayEntryContentElement);
    };
    // instructionsCloseLabelElement.addEventListener("focusin", () => rotateElement(instructionsCloseLabelElement.firstElementChild, -15));
    initializePage();
    getBuddyInfo().then((data) => __awaiter(void 0, void 0, void 0, function* () {
        let buddyHashes = data["buddies"];
        welcomeTitleElement.textContent = `Welcome, ${buddyHashes[getSetting("loginHash")]["name"]}!`;
        parseDayEntries(appElement, dayEntryContentElement, dayListElement, buddyHashes[getSetting("loginHash")]["days"]);
    }));
    if (eval(getSetting("firstTime")))
        showInstructions(appElement, instructionsElement);
};
function showInstructions(appElement, instructionsElement) {
    appElement.classList.add("blurred");
    instructionsElement.style.setProperty("display", "grid");
    instructionsElement.animate({
        opacity: "100%",
    }, { duration: 500, fill: "forwards" });
}
function hideInstructions(appElement, instructionsElement) {
    appElement.classList.remove("blurred");
    instructionsElement
        .animate({
        opacity: "0%",
    }, { duration: 500, fill: "forwards" })
        .finished.then(() => {
        instructionsElement.style.setProperty("display", "none");
    });
    saveSetting("firstTime", "false");
}
function parseDayEntries(appElement, dayEntryContentElement, listElement, dayList) {
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
            curEntry.onclick = () => {
                if (appElement.classList.contains("blurred"))
                    return;
                showDayEntryContent(appElement, dayEntryContentElement, element["content"]["passHash"] !== undefined
                    ? dayEntryContentTypes.PASSWORD
                    : dayEntryContentTypes[element["content"]["type"]], element["content"]);
            };
        }
        curEntry.children[0].children[0].textContent = element["name"];
        curEntry.children[0].children[1].textContent = element["date"].formatDate(options);
        if (element["content"]["passHash"] !== undefined)
            curEntry.classList.add("pass_required");
        (_a = listElement.lastChild) === null || _a === void 0 ? void 0 : _a.after(curEntry);
    });
    dayEntryTemplate.remove();
    lockedEntryTemplate.remove();
}
function showDayEntryContent(appElement, dayEntryContentElement, type, content) {
    appElement.classList.add("blurred");
    let childElement;
    let fadeOutAnim = dayEntryContentElement.animate({ opacity: "0%" }, { duration: 200, fill: "forwards" });
    fadeOutAnim.finished.then(() => {
        /*
        dayEntryContentElement.removeChild(
          dayEntryContentElement.replaceChildren ??
            dayEntryContentElement.appendChild(document.createElement("div"))
        );
        */
        switch (type) {
            case dayEntryContentTypes.PASSWORD:
                childElement = document.createElement("div");
                childElement.classList.add("pass_input_container");
                let passInputElement = document.createElement("input");
                initializePassInput(passInputElement, () => {
                    if (passInputElement.value.hashCode() === parseInt(content["passHash"])) {
                        showDayEntryContent(appElement, dayEntryContentElement, dayEntryContentTypes[content["type"]], content);
                    }
                });
                passInputElement.placeholder = "password1234";
                childElement.appendChild(passInputElement);
                break;
            case dayEntryContentTypes.TEXT:
                childElement = document.createElement("span");
                childElement.textContent = content["text"];
                break;
            case dayEntryContentTypes.IMAGE:
                childElement = new HTMLImageElement();
                break;
            case dayEntryContentTypes.TEXT_IMAGE:
                childElement = new HTMLDivElement();
                break;
        }
        dayEntryContentElement.replaceChildren(dayEntryContentElement.children[0], dayEntryContentElement.children[1], childElement);
        dayEntryContentElement.animate({ opacity: "100%" }, { duration: 500, fill: "forwards" });
    });
    if (dayEntryContentElement.style.getPropertyValue("display") === "none")
        fadeOutAnim.finish();
    dayEntryContentElement.style.setProperty("display", "flex");
}
function hideDayEntryContent(appElement, dayEntryContentElement) {
    appElement.classList.remove("blurred");
    dayEntryContentElement
        .animate({ opacity: "0%" }, { duration: 500, fill: "forwards" })
        .finished.then(() => {
        dayEntryContentElement.style.setProperty("display", "none");
    });
}
