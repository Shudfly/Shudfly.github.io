const track = document.getElementById("image-track");

window.onmousedown = e => {
  track.dataset.mouseDownAt = e.clientX;
  if(track.dataset.hovering === "true") return;
  track.animate({
    gap: "8vmin"
  }, { duration: 300, easing: "ease-out", fill: "forwards" });
}

window.onmousemove = e => {
  if(track.dataset.mouseDownAt === "0") return;

  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX, maxDelta = window.innerWidth / 2;

  const percentage = (mouseDelta / maxDelta) * -100, nextPercentage = Math.max(Math.min(parseFloat(track.dataset.prevPercentage) + percentage, 0), -100);

  track.dataset.percentage = nextPercentage;

  track.animate({
    transform: `translate(${nextPercentage}%, -50%)`,
  }, { duration: 1200, easing: "ease-in-out", fill: "forwards" });

  for(const image of track.getElementsByClassName("image")) {
    image.animate({
      objectPosition: `${100 + nextPercentage}% center`
    }, { duration: 1200, easing: "ease-in-out", fill: "forwards" });
  }
}

window.onmouseup = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
  if(track.dataset.hovering === "true") return;
  track.animate({
    gap: "4vmin"
  }, { duration: 300, easing: "ease-out", fill: "forwards" });
}

track.onmouseenter = () => {
  track.dataset.hovering = "true";
  track.animate({
    gap: "6vmin"
  }, { duration: 200, easing: "ease-out", fill: "forwards" });
}

track.onmouseleave = () => {
  track.dataset.hovering = "false";
  track.animate({
    gap: track.dataset.mouseDownAt === "0" ? "4vmin" : "8vmin"
  }, { duration: 200, easing: "ease-out", fill: "forwards" });
}