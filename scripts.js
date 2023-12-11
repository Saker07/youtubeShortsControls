let videoElement;
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

videoElement = document.querySelector(".video-stream.html5-main-video");

function addProgressBar(videoElement) {
  let progressBar, videoDimension;
  const progressBarContainer = document.querySelector("#progress-bar-line");

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

function createVolButtonWithDialog(callback) {
  let defaultButtonContainers, defaultFirstChildButton, defaultButtonStyle;
  let btnContainer, btn, volumeImg;
  let rangeBar;
  const volumeIconSrc = chrome.runtime.getURL("volumeIcon.svg");
  const mutedIconSrc = chrome.runtime.getURL("mutedIcon.svg");

  defaultButtonContainers = document.querySelector("#actions");
  defaultFirstChildButton = document.querySelector("#actions > #like-button");
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
    if (videoElement.muted) {
      videoElement.muted = false;
      e.target.src = volumeIconSrc;
    } else {
      videoElement.muted = true;
      e.target.src = mutedIconSrc;
    }
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
function addBarDialog(containerDiv, callback = null) {
  let barCont, rangeBar;
  barCont = document.createElement("dialog");
  barCont.setAttribute("class", "rangeBarContainer");
  containerDiv.style.position = "relative";
  barCont.style.bottom = containerDiv.clientHeight + "px";
  barCont.style.width = containerDiv.clientWidth + "px";
  barCont.style.height = containerDiv.clientHeight * 5 + "px";
  containerDiv.appendChild(barCont);

  containerDiv.addEventListener("mouseover", (e) => {
    barCont.show();
  });
  containerDiv.addEventListener("mouseout", (e) => {
    barCont.close();
  });

  rangeBar = document.createElement("input");
  rangeBar.setAttribute("class", "rangeBar");
  rangeBar.setAttribute("type", "range");
  rangeBar.setAttribute("max", "100");
  rangeBar.style.width = getIntFromPixels(barCont.style.height) - 20 + "px";

  barCont.appendChild(rangeBar);
  rangeBar.addEventListener("change", callback);

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

setTimeout(() => {
  let test = createVolButtonWithDialog(adjustVolume);
  let progressBarTest = addProgressBar(videoElement);
}, 500);
