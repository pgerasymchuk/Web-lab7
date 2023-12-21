const anim = document.querySelector('#anim');

function play(){
    const work = document.querySelector('#work');
    work.style.display = 'flex';
    work.style.width = (0.4 * window.innerWidth + 10).toString() + 'px';
    work.style.height = (0.8 * window.innerHeight + 50).toString() + 'px';

    anim.style.height = (0.8 * window.innerHeight).toString() + 'px';
}

const start_reload_btn = document.querySelector('#start-reload-btn');

function start_reload(){
    start_reload_btn.innerHTML = (start_reload_btn.innerHTML === 'Start') ? 'Reload' : 'Start';

    const circle1 = document.querySelector('#circle1');
    const circle2 = document.querySelector('#circle2');

    circle1.style.display = 'block';
    circle2.style.display = 'block';

    const animBorderWidth = 5;
    const maxX = anim.clientWidth - circle1.clientWidth;
    const maxY = anim.clientHeight - circle1.clientHeight;

    let circle1X = Math.random()*maxX;
    let circle1Y = 0;
    let circle2X = Math.random()*maxX;
    let circle2Y = maxY;
    /*let circle1X = Math.random()*(anim.clientWidth-animBorderWidth)-circle1.style.width;
    let circle1Y = 0;
    let circle2X = Math.random()*(anim.clientWidth-circle2.style.width-animBorderWidth);
    let circle2Y = anim.clientHeight-circle2.clientHeight;*/

    circle1.style.transform = 'translate(' + circle1X + 'px,' + circle1Y + 'px)';
    circle2.style.transform = 'translate(' + circle2X + 'px,' + circle2Y + 'px)';

    let vel1X = Math.random() * 5;
    let vel1Y = Math.random() * 5;
    let vel2X = Math.random() * 5;
    let vel2Y = Math.random() * 5;

    function move_circles() {
        circle1X += vel1X;
        circle1Y += vel1Y;
        circle2X += vel2X;
        circle2Y += vel2Y;

        if (circle1X < 0 || circle1X > maxX){
            vel1X = -vel1X;
        }
        if (circle1Y < 0 || circle1Y > maxY){
            vel1Y = -vel1Y;
        }
        if (circle2X < 0 || circle2X > maxX){
            vel2X = -vel2X;
        }
        if (circle2Y < 0 || circle2Y > maxY){
            vel2Y = -vel2Y;
        }

        circle1.style.transform = 'translate(' + circle1X + 'px,' + circle1Y + 'px)';
        circle2.style.transform = 'translate(' + circle2X + 'px,' + circle2Y + 'px)';

        requestAnimationFrame(move_circles);
    }
}





function close_work(){
    const work = document.querySelector('#work');
    work.style.display = 'none';
}