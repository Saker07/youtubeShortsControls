let videoElement;

videoElement = document.querySelector('.video-stream.html5-main-video');

function addProgressBar(videoElement){
    let progressBar, videoDimension;
    progressBar = document.createElement('input');
    progressBar.setAttribute('type', 'range');
    progressBar.setAttribute('max', videoElement.duration);

    videoDimension = videoElement.getBoundingClientRect()

    videoElement.style.position = 'relative';
    progressBar.style = 'position: absolute; bottom: '+ videoDimension.y +'px ; left: '+ videoDimension.left +'px ; margin: 0; padding: 0; width: ' + videoDimension.width +'px;';
    progressBar.draggable = false;
    document.body.appendChild(progressBar);

    progressBar.addEventListener('input', e=>{
        e.stopPropagation();
        videoElement.currentTime = e.target.value;
    })
}




function createButtonDialog(callback){
    let defaultButtonContainers, defaultFirstChildButton, defaultButtonStyle;
    let btnContainer, btn;
    let rangeBar;

    defaultButtonContainers = document.querySelector('#actions');
    defaultFirstChildButton = document.querySelector('#actions > #like-button');
    defaultButtonStyle = window.getComputedStyle(document.querySelector('#actions > #like-button button'));

    btnContainer = document.createElement('div');
    defaultButtonContainers.insertBefore(btnContainer, defaultFirstChildButton);
    btn = createButton(defaultButtonStyle);
    btnContainer.appendChild(btn);
    rangeBar = addBarDialog(btn, callback);
    
    


    return btnContainer;
}

function createButton(exampleButtonStyle){
    //create a button that has the same given button style
    let volumeBtn;
    volumeBtn = document.createElement('button');
    volumeBtn.setAttribute('type', 'button');
    Object.assign(volumeBtn.style, {
        height: exampleButtonStyle.height,
        width: exampleButtonStyle.width,
        border: exampleButtonStyle.border,
        borderRadius: exampleButtonStyle.borderRadius,
        backgroundColor: 'green',
    });
    return volumeBtn;
}
function addBarDialog(btn, callback = null){
    let rangeBarContainer, rangeBar;
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
    `
    rangeBarContainer = document.createElement('dialog');
    rangeBarContainer.style = rangeBarContainerStyle;
    btn.style.position = 'relative';
    rangeBarContainer.style.bottom = btn.clientHeight + 'px';
    rangeBarContainer.style.width = btn.clientWidth + 'px';
    rangeBarContainer.style.height = (btn.clientHeight*10) + 'px';
    btn.appendChild(rangeBarContainer);
    btn.addEventListener('mouseover', (e)=>{
        rangeBarContainer.show();
    });
    btn.addEventListener('mouseout', (e)=>{
        rangeBarContainer.close();
    });
    rangeBar = document.createElement('input');
    rangeBar.style = rangeBarStyle;
    rangeBar.setAttribute('type', 'range');
    rangeBar.setAttribute('max', '100');
    rangeBar.style.width = (getIntFromPixels(rangeBarContainer.style.height) - 20) + 'px';
    rangeBarContainer.appendChild(rangeBar);
    rangeBar.addEventListener('change', callback)
    return rangeBarContainer;
}

function adjustVolume(e){
    videoElement.volume = e.target.value/100;
}

function getIntFromPixels(size){
    let intSize;
    let sizeArr;
    sizeArr = size.split('');
    if(sizeArr[0]=='-'){sizeArr.shift()};
    intSize = parseInt(sizeArr.slice(0,-2).join(''));

    return intSize;
}

console.log(videoElement.volume)
let test = createButtonDialog(adjustVolume);
let progressBarTest = addProgressBar(videoElement);