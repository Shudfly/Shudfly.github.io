var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getLockStatus, getSetting, saveSetting, setLockStatus, } from "../settings.js";
import { buddyInfo, dayEntryContentTypes, getBuddyInfo, initializePage, initializePassInput, } from "../utils.js";
let appElement;
let dayListElement;
let instructionsElement;
let dayEntryContentElement;
window.onload = () => {
    //#region Element definitions
    // Main window
    appElement = document.getElementById("app");
    const welcomeTitleElement = document.getElementById("welcome");
    dayListElement = document.getElementById("day_list");
    // Instruction popup
    instructionsElement = document.getElementById("instructions");
    const instructionsCloseElement = document.getElementById("instr_close");
    // Day entry content popup
    dayEntryContentElement = document.getElementById("day_entry_content");
    const dayEntryContentCloseElement = document.getElementById("daenco_close");
    const iconButtonLabelElements = document.getElementsByClassName("icon_button");
    //#endregion
    instructionsCloseElement.onclick = () => hideInstructions();
    dayEntryContentCloseElement.onclick = () => {
        hideDayEntryContent();
    };
    // instructionsCloseLabelElement.addEventListener("focusin", () => rotateElement(instructionsCloseLabelElement.firstElementChild, -15));
    initializePage();
    getBuddyInfo().then((data) => __awaiter(void 0, void 0, void 0, function* () {
        let buddyHashes = data.buddies;
        console.log(getSetting("loginHash"));
        welcomeTitleElement.textContent = `Welcome, ${buddyHashes[getSetting("loginHash")].name}!`;
        parseDayEntries();
    }));
    if (eval(getSetting("firstTime")))
        showInstructions();
};
function showInstructions() {
    appElement.classList.add("blurred");
    instructionsElement.style.setProperty("display", "grid");
    instructionsElement.animate({
        opacity: "100%",
    }, { duration: 200, fill: "forwards" });
}
function hideInstructions() {
    appElement.classList.remove("blurred");
    instructionsElement
        .animate({
        opacity: "0%",
    }, { duration: 200, fill: "forwards" })
        .finished.then(() => {
        instructionsElement.style.setProperty("display", "none");
    });
    saveSetting("firstTime", "false");
}
function parseDayEntries() {
    const dayEntryTemplate = dayListElement.children[0];
    const lockedEntryTemplate = dayListElement.children[1];
    let options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    };
    buddyInfo.buddies[getSetting("loginHash")].days.forEach((element) => {
        var _a;
        let curEntry;
        curEntry = lockedEntryTemplate.cloneNode(true);
        if (!(new Date(Date.parse(element.date)) > new Date())) {
            curEntry = dayEntryTemplate.cloneNode(true);
            curEntry.children[1].textContent = element.description;
            curEntry.onclick = () => {
                if (appElement.classList.contains("blurred"))
                    return;
                showDayEntryContent(buddyInfo.buddies[getSetting("loginHash")].days.indexOf(element), 0);
            };
        }
        curEntry.children[0].children[0].textContent = element["name"];
        curEntry.children[0].children[1].textContent = element["date"].formatDate(options);
        if (dayEntryContentTypes[element.content[0].type] ===
            dayEntryContentTypes.PASSWORD ||
            dayEntryContentTypes[element.content[0].type] ===
                dayEntryContentTypes.TEXT_PASSWORD)
            curEntry.classList.add("pass_required");
        (_a = dayListElement.lastChild) === null || _a === void 0 ? void 0 : _a.after(curEntry);
    });
    dayEntryTemplate.remove();
    lockedEntryTemplate.remove();
}
function showDayEntryContent(dayIndex, contentIndex) {
    appElement.classList.add("blurred");
    let childElements = [];
    childElements.push(dayEntryContentElement.children[0], dayEntryContentElement.children[1]);
    let fadeOutAnim = dayEntryContentElement.animate({ opacity: "0%" }, { duration: 100, fill: "forwards" });
    fadeOutAnim.finished.then(() => {
        /*
        dayEntryContentElement.removeChild(
          dayEntryContentElement.replaceChildren ??
            dayEntryContentElement.appendChild(document.createElement("div"))
        );
        */
        let divElement;
        let passInputElement;
        let spanElement;
        let imageElement;
        let content = buddyInfo.buddies[getSetting("loginHash")].days[dayIndex].content;
        switch (dayEntryContentTypes[content[contentIndex].type]) {
            case dayEntryContentTypes.PASSWORD:
                console.log(getLockStatus(dayIndex, contentIndex));
                divElement = document.createElement("div");
                divElement.classList.add("pass_input_container");
                passInputElement = document.createElement("input");
                initializePassInput(passInputElement, () => {
                    if (passInputElement.value.hashCode() ===
                        parseInt(content[contentIndex].passHash)) {
                        setLockStatus(dayIndex, contentIndex, 1);
                        showDayEntryContent(dayIndex, contentIndex + 1);
                    }
                });
                passInputElement.placeholder = "password1234";
                divElement.appendChild(passInputElement);
                childElements.push(divElement);
                break;
            case dayEntryContentTypes.TEXT_PASSWORD:
                spanElement = document.createElement("span");
                spanElement.textContent = atob(content[contentIndex].encodedText);
                divElement = document.createElement("div");
                divElement.classList.add("pass_input_container");
                passInputElement = document.createElement("input");
                initializePassInput(passInputElement, () => {
                    if (passInputElement.value.hashCode() ===
                        parseInt(content[contentIndex].passHash)) {
                        showDayEntryContent(dayIndex, contentIndex + 1);
                    }
                });
                passInputElement.placeholder = "password1234";
                divElement.appendChild(passInputElement);
                childElements.push(spanElement, divElement);
                break;
            case dayEntryContentTypes.TEXT:
                spanElement = document.createElement("span");
                spanElement.textContent = atob(content[contentIndex].encodedText);
                childElements.push(spanElement);
                break;
            case dayEntryContentTypes.IMAGE:
                imageElement = document.createElement("img");
                imageElement.src = `/buddy/resources/${btoa(content[contentIndex].key).hashCode()}.png`;
                childElements.push(imageElement);
                break;
            case dayEntryContentTypes.TEXT_IMAGE:
                spanElement = document.createElement("span");
                spanElement.textContent = atob(content[contentIndex].encodedText);
                imageElement = document.createElement("img");
                imageElement.src = `/buddy/resources/${btoa(content[contentIndex].key).hashCode()}.png`;
                childElements.push(imageElement, spanElement);
                break;
        }
        dayEntryContentElement.replaceChildren();
        childElements.forEach((element) => {
            dayEntryContentElement.appendChild(element);
        });
        dayEntryContentElement.animate({ opacity: "100%" }, { duration: 200, fill: "forwards" });
    });
    if (dayEntryContentElement.style.getPropertyValue("display") === "none")
        fadeOutAnim.finish();
    dayEntryContentElement.style.setProperty("display", "flex");
}
function hideDayEntryContent() {
    appElement.classList.remove("blurred");
    dayEntryContentElement
        .animate({ opacity: "0%" }, { duration: 200, fill: "forwards" })
        .finished.then(() => {
        dayEntryContentElement.style.setProperty("display", "none");
    });
}
