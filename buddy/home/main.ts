import {
  getLockStatus,
  getSetting,
  saveSetting,
  setLockStatus,
} from "../settings.js";
import {
  buddyInfo,
  dayEntryContentTypes,
  getBuddyInfo,
  IInfoStructure,
  initializePage,
  initializePassInput,
} from "../utils.js";

let appElement: HTMLDivElement;
let dayListElement: HTMLDivElement;
let instructionsElement: HTMLDivElement;
let dayEntryContentElement: HTMLDivElement;

window.onload = () => {
  //#region Element definitions

  // Main window
  appElement = document.getElementById("app") as HTMLDivElement;
  const welcomeTitleElement = document.getElementById(
    "welcome"
  ) as HTMLHeadingElement;
  dayListElement = document.getElementById("day_list") as HTMLDivElement;

  // Instruction popup
  instructionsElement = document.getElementById(
    "instructions"
  ) as HTMLDivElement;
  const instructionsCloseElement = document.getElementById(
    "instr_close"
  ) as HTMLButtonElement;

  // Day entry content popup
  dayEntryContentElement = document.getElementById(
    "day_entry_content"
  ) as HTMLDivElement;
  const dayEntryContentCloseElement = document.getElementById(
    "daenco_close"
  ) as HTMLInputElement;

  const iconButtonLabelElements = document.getElementsByClassName(
    "icon_button"
  ) as HTMLCollectionOf<HTMLLabelElement>;
  //#endregion

  instructionsCloseElement.onclick = () => hideInstructions();
  dayEntryContentCloseElement.onclick = () => {
    hideDayEntryContent();
  };
  // instructionsCloseLabelElement.addEventListener("focusin", () => rotateElement(instructionsCloseLabelElement.firstElementChild, -15));

  initializePage();
  getBuddyInfo().then(async (data: IInfoStructure): Promise<void> => {
    let buddyHashes = data.buddies;

    console.log(getSetting("loginHash"));

    welcomeTitleElement.textContent = `Welcome, ${
      buddyHashes[getSetting("loginHash")].name
    }!`;

    parseDayEntries();
  });

  if (eval(getSetting("firstTime"))) showInstructions();
};

function showInstructions() {
  appElement.classList.add("blurred");

  instructionsElement.style.setProperty("display", "grid");
  instructionsElement.animate(
    {
      opacity: "100%",
    },
    { duration: 200, fill: "forwards" }
  );
}

function hideInstructions() {
  appElement.classList.remove("blurred");

  instructionsElement
    .animate(
      {
        opacity: "0%",
      },
      { duration: 200, fill: "forwards" }
    )
    .finished.then(() => {
      instructionsElement.style.setProperty("display", "none");
    });

  saveSetting("firstTime", "false");
}

function parseDayEntries() {
  const dayEntryTemplate = dayListElement.children[0] as HTMLDivElement;
  const lockedEntryTemplate = dayListElement.children[1] as HTMLDivElement;

  let options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  buddyInfo.buddies[getSetting("loginHash")].days.forEach((element) => {
    let curEntry: HTMLElement;

    curEntry = lockedEntryTemplate.cloneNode(true) as HTMLDivElement;

    if (!(new Date(Date.parse(element.date)) > new Date())) {
      curEntry = dayEntryTemplate.cloneNode(true) as HTMLDivElement;
      curEntry.children[1].textContent = element.description;
      curEntry.onclick = () => {
        if (appElement.classList.contains("blurred")) return;
        showDayEntryContent(
          buddyInfo.buddies[getSetting("loginHash")].days.indexOf(element),
          0
        );
      };
    }

    curEntry.children[0].children[0].textContent = element["name"];
    curEntry.children[0].children[1].textContent = (
      element["date"] as String
    ).formatDate(options);
    if (
      dayEntryContentTypes[element.content[0].type] ===
        dayEntryContentTypes.PASSWORD ||
      dayEntryContentTypes[element.content[0].type] ===
        dayEntryContentTypes.TEXT_PASSWORD
    )
      curEntry.classList.add("pass_required");

    dayListElement.lastChild?.after(curEntry);
  });

  dayEntryTemplate.remove();
  lockedEntryTemplate.remove();
}

function showDayEntryContent(dayIndex: number, contentIndex: number) {
  appElement.classList.add("blurred");
  let childElements: Array<HTMLElement> = [];

  childElements.push(
    dayEntryContentElement.children[0] as HTMLElement,
    dayEntryContentElement.children[1] as HTMLElement
  );

  let fadeOutAnim = dayEntryContentElement.animate(
    { opacity: "0%" },
    { duration: 100, fill: "forwards" }
  );
  fadeOutAnim.finished.then(() => {
    /*
    dayEntryContentElement.removeChild(
      dayEntryContentElement.replaceChildren ??
        dayEntryContentElement.appendChild(document.createElement("div"))
    );
    */

    let divElement: HTMLDivElement;
    let passInputElement: HTMLInputElement;
    let spanElement: HTMLSpanElement;
    let imageElement: HTMLImageElement;
    let content =
      buddyInfo.buddies[getSetting("loginHash")].days[dayIndex].content;

    switch (dayEntryContentTypes[content[contentIndex].type]) {
      case dayEntryContentTypes.PASSWORD:
        console.log(getLockStatus(dayIndex, contentIndex));
        divElement = document.createElement("div");
        divElement.classList.add("pass_input_container");

        passInputElement = document.createElement("input");
        initializePassInput(passInputElement, () => {
          if (
            passInputElement.value.hashCode() ===
            parseInt(content[contentIndex].passHash)
          ) {
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
          if (
            passInputElement.value.hashCode() ===
            parseInt(content[contentIndex].passHash)
          ) {
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
        imageElement.src = `/buddy/resources/${btoa(
          content[contentIndex].key
        ).hashCode()}.png`;
        childElements.push(imageElement);
        break;
      case dayEntryContentTypes.TEXT_IMAGE:
        spanElement = document.createElement("span");
        spanElement.textContent = atob(content[contentIndex].encodedText);

        imageElement = document.createElement("img");
        imageElement.src = `/buddy/resources/${btoa(
          content[contentIndex].key
        ).hashCode()}.png`

        childElements.push(imageElement, spanElement);
        break;
    }

    dayEntryContentElement.replaceChildren();
    childElements.forEach((element) => {
      dayEntryContentElement.appendChild(element);
    });
    dayEntryContentElement.animate(
      { opacity: "100%" },
      { duration: 200, fill: "forwards" }
    );
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
