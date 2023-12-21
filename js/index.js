const animWidth = 0.4 * window.innerWidth;
const animHeight = 0.8 * window.innerHeight;

function play(){
    const work = document.querySelector('#work');
    work.style.display = 'flex';
    work.style.width = (animWidth + 10).toString() + 'px';
    work.style.height = (animHeight + 50).toString() + 'px';

    const anim = document.querySelector('#anim');
    anim.style.height = animHeight.toString() + 'px';
}

const start_reload_btn = document.querySelector('#start-reload-btn');

function start_reload(){
    start_reload_btn.innerHTML = (start_reload_btn.innerHTML === 'Start') ? 'Reload' : 'Start';

    const circle1 = document.querySelector('#circle1');
    const circle2 = document.querySelector('#circle2');

    circle1.style.display = 'block';
    circle2.style.display = 'block';

    const animBorderWidth = 5;

    circle1.style.transform = 'translate('+(Math.random()*(animWidth-animBorderWidth)-circle1.style.width).toString()+'px,0px)';
    circle2.style.transform = 'translate(' +
        Math.random()*(animWidth-circle2.style.width-animBorderWidth) + 'px,' +
        (animHeight-circle2.clientHeight).toString() + 'px)';
}

function move_circles(){

}



function close_work(){
    const work = document.querySelector('#work');
    work.style.display = 'none';
}