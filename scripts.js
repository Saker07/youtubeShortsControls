let videoElement, progressBarContainer;
const styleSheet = `
.progressBar {
  position: absolute;
  bottom: 0;
  width: 99%;
  z-index: 2;
  pointer-events: auto;
  opacity: 0.9;
  accent-color: red;
  transform: translate(0, 50%);
  transition: all 1s;
}
.rangeBarContainer {
  position: absolute;
  left: 0px;
  background-color:white;
  align-items:center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 20px;
  background-color: #272727;

}
.rangeBarContainer[open] {
  display: flex;
}
.rangeBar {
  flex-shrink: 0;
  transform: rotate(-90deg);
}
.volumeIcon {
  height: 90%;
  width: 90%;
}
`;
injectCSS(styleSheet);

let oldLocationHref;

function isNewShort() {
  if (window.location.href !== oldLocationHref) {
    oldLocationHref = window.location.href;
    setTimeout((e) => {
      let activeShortContainer = document.querySelector(
        "ytd-reel-video-renderer.reel-video-in-sequence.style-scope.ytd-shorts[is-active]"
      );
      addVideoControlsToShort(activeShortContainer);
    }, 1000);
  }
}

setInterval(isNewShort, 500);

function addVideoControlsToShort(activeShortContainer) {
  progressBarContainer =
    activeShortContainer.querySelector("#progress-bar-line");
  videoElement = activeShortContainer.querySelector(
    ".video-stream.html5-main-video"
  );
  createVolButtonWithDialog(
    adjustVolume,
    activeShortContainer.querySelector("#actions"),
    activeShortContainer.querySelector("#actions > #like-button")
  );
  addProgressBar(videoElement);
}

function addProgressBar(videoElement) {
  let progressBar, videoDimension;

  progressBar = document.createElement("input");
  setMultipleAttributes(progressBar, {
    type: "range",
    max: videoElement.duration,
    class: "progressBar",
  });

  progressBarContainer.appendChild(progressBar);
  progressBar.addEventListener("mousedown", (e) => {
    videoElement.pause();
    document.body.addEventListener(
      "mouseup",
      (e) => {
        if (videoElement.paused) {
          videoElement.play();
        }
      },
      { once: true }
    );
  });
  progressBar.addEventListener("input", (e) => {
    e.stopPropagation();
    videoElement.currentTime = e.target.value;
  });

  setInterval(() => {
    progressBar.value = videoElement.currentTime;
  });
}

function createVolButtonWithDialog(
  callback,
  defaultButtonContainers,
  defaultFirstChildButton
) {
  let defaultButtonStyle;
  let btnContainer, btn, volumeImg;
  let rangeBar;
  const volumeIconSrc = chrome.runtime.getURL("volumeIcon.svg");
  const mutedIconSrc = chrome.runtime.getURL("mutedIcon.svg");

  defaultButtonStyle = window.getComputedStyle(
    document.querySelector("#actions > #like-button button")
  );

  btnContainer = document.createElement("div");
  defaultButtonContainers.insertBefore(btnContainer, defaultFirstChildButton);
  btn = createButton(defaultButtonStyle);
  btnContainer.appendChild(btn);
  addBarDialog(btn, callback);

  volumeImg = document.createElement("img");
  setMultipleAttributes(volumeImg, {
    src: volumeIconSrc,
    class: "volumeIcon",
  });
  btn.appendChild(volumeImg);
  volumeImg.addEventListener("click", (e) => {
    videoElement.muted = !videoElement.muted;
    e.target.src = videoElement.muted ? mutedIconSrc : volumeIconSrc;
    console.log(videoElement.muted === true);
  });

  return btnContainer;
}

function createButton(exampleButtonStyle) {
  //create a button that has the same given button style
  let btn;
  const btnStyle = {
    height: exampleButtonStyle.height,
    width: exampleButtonStyle.width,
    border: exampleButtonStyle.border,
    borderRadius: exampleButtonStyle.borderRadius,
    backgroundColor: "#272727",
  };

  btn = document.createElement("button");
  btn.setAttribute("type", "button");
  Object.assign(btn.style, btnStyle);
  return btn;
}

function addBarDialog(button, handleChange) {
  let barCont, rangeBar;
  barCont = document.createElement("dialog");
  barCont.setAttribute("class", "rangeBarContainer");
  button.style.position = "relative";
  barCont.style.bottom = button.clientHeight + "px";
  barCont.style.width = button.clientWidth + "px";
  barCont.style.height = button.clientHeight * 5 + "px";
  button.appendChild(barCont);

  button.addEventListener("mouseover", (e) => {
    barCont.show();
  });
  button.addEventListener("mouseout", (e) => {
    barCont.close();
  });

  rangeBar = document.createElement("input");
  rangeBar.setAttribute("class", "rangeBar");
  rangeBar.setAttribute("type", "range");
  rangeBar.setAttribute("max", "100");
  rangeBar.style.width = getIntFromPixels(barCont.style.height) - 20 + "px";

  barCont.appendChild(rangeBar);
  rangeBar.addEventListener("change", handleChange);

  return barCont;
}

function adjustVolume(e) {
  videoElement.volume = e.target.value / 100;
}

function getIntFromPixels(size) {
  let intSize;
  let sizeArr;
  sizeArr = size.split("");
  if (sizeArr[0] == "-") {
    sizeArr.shift();
  }
  intSize = parseInt(sizeArr.slice(0, -2).join(""));

  return intSize;
}

function setMultipleAttributes(element, attributes = {}) {
  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
}
function injectCSS(styleString) {
  let styleTag = document.createElement("style");
  styleTag.innerHTML = styleSheet;
  document.head.appendChild(styleTag);
  return styleTag;
}

/*
class VideoObject {
  constructor() {
    this.videoRef;
    this.windowHref;
    this.buttonsContainerRef;
    this.fisrtButtonRef;
  }
}
*/
