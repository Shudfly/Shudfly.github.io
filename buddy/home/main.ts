import { getSetting, saveSetting } from "../settings.js";
import {
  dayEntryContentTypes,
  getBuddyInfo,
  getPaletteVars,
  initializePage,
  initializePassInput,
} from "../utils.js";

window.onload = () => {
  //#region Element definitions

  // Main window
  const appElement = document.getElementById("app") as HTMLDivElement;
  const welcomeTitleElement = document.getElementById(
    "welcome"
  ) as HTMLHeadingElement;
  const dayListElement = document.getElementById("day_list") as HTMLDivElement;

  // Instruction popup
  const instructionsElement = document.getElementById(
    "instructions"
  ) as HTMLDivElement;
  const instructionsCloseElement = document.getElementById(
    "instr_close"
  ) as HTMLButtonElement;

  // Day entry content popup
  const dayEntryContentElement = document.getElementById(
    "day_entry_content"
  ) as HTMLDivElement;
  const dayEntryContentCloseElement = document.getElementById(
    "daenco_close"
  ) as HTMLInputElement;

  const iconButtonLabelElements = document.getElementsByClassName(
    "icon_button"
  ) as HTMLCollectionOf<HTMLLabelElement>;
  //#endregion

  instructionsCloseElement.onclick = () =>
    hideInstructions(appElement, instructionsElement);
  dayEntryContentCloseElement.onclick = () => {
    hideDayEntryContent(appElement, dayEntryContentElement);
  };
  // instructionsCloseLabelElement.addEventListener("focusin", () => rotateElement(instructionsCloseLabelElement.firstElementChild, -15));

  initializePage();
  getBuddyInfo().then(async (data): Promise<void> => {
    let buddyHashes = data["buddies"];

    welcomeTitleElement.textContent = `Welcome, ${
      buddyHashes[getSetting("loginHash")]["name"]
    }!`;

    parseDayEntries(
      appElement,
      dayEntryContentElement,
      dayListElement,
      buddyHashes[getSetting("loginHash")]["days"]
    );
  });

  if (eval(getSetting("firstTime")))
    showInstructions(appElement, instructionsElement);
};

function showInstructions(
  appElement: HTMLElement,
  instructionsElement: HTMLElement
) {
  appElement.classList.add("blurred");

  instructionsElement.style.setProperty("display", "grid");
  instructionsElement.animate(
    {
      opacity: "100%",
    },
    { duration: 500, fill: "forwards" }
  );
}

function hideInstructions(
  appElement: HTMLElement,
  instructionsElement: HTMLElement
) {
  appElement.classList.remove("blurred");

  instructionsElement
    .animate(
      {
        opacity: "0%",
      },
      { duration: 500, fill: "forwards" }
    )
    .finished.then(() => {
      instructionsElement.style.setProperty("display", "none");
    });

  saveSetting("firstTime", "false");
}

function parseDayEntries(
  appElement: HTMLDivElement,
  dayEntryContentElement: HTMLDivElement,
  listElement: HTMLDivElement,
  dayList: Array<any>
) {
  const dayEntryTemplate = listElement.children[0] as HTMLDivElement;
  const lockedEntryTemplate = listElement.children[1] as HTMLDivElement;

  let options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  dayList.forEach((element) => {
    let curEntry: HTMLElement;

    curEntry = lockedEntryTemplate.cloneNode(true) as HTMLDivElement;

    if (!(new Date(Date.parse(element["date"])) > new Date())) {
      curEntry = dayEntryTemplate.cloneNode(true) as HTMLDivElement;
      curEntry.children[1].textContent = element["description"];
      curEntry.onclick = () => {
        if (appElement.classList.contains("blurred")) return;
        showDayEntryContent(
          appElement,
          dayEntryContentElement,
          element["content"]["passHash"] !== undefined
            ? dayEntryContentTypes.PASSWORD
            : dayEntryContentTypes[
                element["content"]["type"] as keyof typeof dayEntryContentTypes
              ],
          element["content"]
        );
      };
    }

    curEntry.children[0].children[0].textContent = element["name"];
    curEntry.children[0].children[1].textContent = (
      element["date"] as String
    ).formatDate(options);
    if (element["content"]["passHash"] !== undefined)
      curEntry.classList.add("pass_required");

    listElement.lastChild?.after(curEntry);
  });

  dayEntryTemplate.remove();
  lockedEntryTemplate.remove();
}

function showDayEntryContent(
  appElement: HTMLElement,
  dayEntryContentElement: HTMLElement,
  type: dayEntryContentTypes,
  content: any
) {
  appElement.classList.add("blurred");
  let childElement: HTMLElement;

  let fadeOutAnim = dayEntryContentElement.animate(
    { opacity: "0%" },
    { duration: 200, fill: "forwards" }
  );
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
          if (
            passInputElement.value.hashCode() === parseInt(content["passHash"])
          ) {
            showDayEntryContent(
              appElement,
              dayEntryContentElement,
              dayEntryContentTypes[
                content["type"] as keyof typeof dayEntryContentTypes
              ],
              content
            );
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

    dayEntryContentElement.replaceChildren(
      dayEntryContentElement.children[0],
      dayEntryContentElement.children[1],
      childElement
    );
    dayEntryContentElement.animate(
      { opacity: "100%" },
      { duration: 500, fill: "forwards" }
    );
  });

  if (dayEntryContentElement.style.getPropertyValue("display") === "none")
    fadeOutAnim.finish();

  dayEntryContentElement.style.setProperty("display", "flex");
}

function hideDayEntryContent(
  appElement: HTMLElement,
  dayEntryContentElement: HTMLElement
) {
  appElement.classList.remove("blurred");

  dayEntryContentElement
    .animate({ opacity: "0%" }, { duration: 500, fill: "forwards" })
    .finished.then(() => {
      dayEntryContentElement.style.setProperty("display", "none");
    });
}
