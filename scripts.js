let videoElement;

videoElement = document.querySelector(".video-stream.html5-main-video");

function addProgressBar(videoElement) {
  let progressBar, videoDimension;
  const progressBarContainer = document.querySelector("#progress-bar-line");
  const progressBarStyle = `
  position: absolute;
  bottom: 0;
  width: 99%;
  z-index: 2;
  pointer-events: auto;
  opacity: 0.9;
  accent-color: red;
  transform: translate(0, 50%);
  `;

  progressBar = document.createElement("input");
  setMultipleAttributes(progressBar, {
    type: "range",
    max: videoElement.duration,
  });
  progressBar.style = progressBarStyle;

  progressBarContainer.appendChild(progressBar);
  progressBar.addEventListener("input", (e) => {
    e.stopPropagation();
    videoElement.currentTime = e.target.value;
  });
}

function createButtonDialog(callback) {
  let defaultButtonContainers, defaultFirstChildButton, defaultButtonStyle;
  let btnContainer, btn;
  let rangeBar;

  defaultButtonContainers = document.querySelector("#actions");
  defaultFirstChildButton = document.querySelector("#actions > #like-button");
  defaultButtonStyle = window.getComputedStyle(
    document.querySelector("#actions > #like-button button")
  );

  btnContainer = document.createElement("div");
  defaultButtonContainers.insertBefore(btnContainer, defaultFirstChildButton);
  btn = createButton(defaultButtonStyle);
  btnContainer.appendChild(btn);
  rangeBar = addBarDialog(btn, callback);

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
    backgroundColor: "green",
  };
  btn = document.createElement("button");
  btn.setAttribute("type", "button");
  Object.assign(btn.style, btnStyle);
  return btn;
}
function addBarDialog(containerDiv, callback = null) {
  let barCont, rangeBar;
  const rangeBarContainerStyle = `
    position: absolute;
    left: 0px;
    background-color:white;
    display:flex;
    align-items:center;
    justify-content: center;
    padding: 0;
    `;
  const rangeBarStyle = `
    flex-shrink: 0;
    transform: rotate(-90deg);
    `;
  barCont = document.createElement("dialog");
  barCont.style = rangeBarContainerStyle;
  containerDiv.style.position = "relative";
  barCont.style.bottom = containerDiv.clientHeight + "px";
  barCont.style.width = containerDiv.clientWidth + "px";
  barCont.style.height = containerDiv.clientHeight * 10 + "px";
  containerDiv.appendChild(barCont);

  containerDiv.addEventListener("mouseover", (e) => {
    barCont.show();
  });
  containerDiv.addEventListener("mouseout", (e) => {
    barCont.close();
  });

  rangeBar = document.createElement("input");
  rangeBar.style = rangeBarStyle;
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
  Object.entries(attributes).forEach((attr) => {
    element.setAttribute(attr[0], attr[1]);
  });
}

let test = createButtonDialog(adjustVolume);
let progressBarTest = addProgressBar(videoElement);
