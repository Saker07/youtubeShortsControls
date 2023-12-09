let videoElement, videoDimention;
let progressBar;

videoElement = document.querySelector('.video-stream.html5-main-video');
progressBar = document.createElement('input');
progressBar.setAttribute('type', 'range');
progressBar.setAttribute('max', videoElement.duration);

videoDimension = videoElement.getBoundingClientRect()
console.log(videoDimension);

videoElement.style.position = 'relative';
progressBar.style = 'position: absolute; bottom: '+ videoDimension.y +'px ; left: '+ videoDimension.left +'px ; margin: 0; padding: 0; width: ' + videoDimension.width +'px;';
progressBar.draggable = false;
document.body.appendChild(progressBar);

progressBar.addEventListener('input', e=>{
    e.stopPropagation();
    videoElement.currentTime = e.target.value;
})




function addVolumeBtn(){
    let volumeBar;
    let buttonsContainer = document.querySelector('#actions');
    let firstButton = document.querySelector('#actions > #like-button');
    let exampleButtonStyle = window.getComputedStyle(document.querySelector('#actions > #like-button button'));
    let volumeBtnContainer = document.createElement('div');
    let volumeBtn = document.createElement('button');
    volumeBtn.setAttribute('type', 'button');
    volumeBtn.style.height = exampleButtonStyle.height;
    volumeBtn.style.width = exampleButtonStyle.width;
    volumeBtn.style.border = exampleButtonStyle.border;
    volumeBtn.style.borderRadius = exampleButtonStyle.borderRadius;
    volumeBtnContainer.appendChild(volumeBtn);
    volumeBtn.style.backgroundColor = 'green';
    buttonsContainer.insertBefore(volumeBtnContainer, firstButton);
    volumeBar = addBarDialog(volumeBtn, )
    volumeBtnContainer.addEventListener('mouseover', (e)=>{
        volumeBar.show();
    });
    volumeBtnContainer.addEventListener('mouseout', (e)=>{
        volumeBar.close();
    });
    return volumeBtnContainer;
}
function addBarDialog(btn, valueRange){
    let volumeBarContainer = document.createElement('dialog');
    btn.style.position = 'relative';
    volumeBarContainer.style.position = 'absolute';
    volumeBarContainer.style.bottom = btn.clientHeight + 'px';
    volumeBarContainer.style.left = '0px';
    volumeBarContainer.style.width = btn.clientWidth + 'px';
    volumeBarContainer.style.height = (btn.clientHeight*10) + 'px';
    volumeBarContainer.style.backgroundColor = 'white';
    btn.appendChild(volumeBarContainer);
    return volumeBarContainer;
}

let volumeBtn = addVolumeBtn();