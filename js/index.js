let eventNum = 0;
const anim = document.querySelector('#anim');
const start_reload_btn = document.querySelector('#start-reload-btn');
const message_div = document.querySelector('#message-div');
let stopAnimation = false;
const circle1 = document.querySelector('#circle1');
const circle2 = document.querySelector('#circle2');
let maxX;
let maxY;
let circle1X;
let circle1Y;
let circle2X;
let circle2Y;

function play(){
    const work = document.querySelector('#work');
    work.style.display = 'flex';
    work.style.width = (0.4 * window.innerWidth + 10).toString() + 'px';
    work.style.height = (0.8 * window.innerHeight + 50).toString() + 'px';
    anim.style.height = (0.8 * window.innerHeight).toString() + 'px';
    start_reload_btn.innerHTML = 'Start';
    start_reload_btn.disabled = false;
    message_div.textContent = '';
    setCircles();
}

function start_reload(){
    if (start_reload_btn.innerHTML === 'Start') {
        start_reload_btn.disabled = true;
        stopAnimation = false;
        logEvent('Start button clicked');
        animateCircles();
    }
    else {
        logEvent('Reload button clicked');
        setCircles();
        start_reload_btn.innerHTML = 'Start';
    }
}

function close_work(){
    stopAnimation = true;
    document.querySelector('#circle1').style.display = 'none';
    document.querySelector('#circle2').style.display = 'none';

    const work = document.querySelector('#work');
    work.style.display = 'none';

    logEvent('Close button clicked');
    eventNum = 0;
    loadEventsFromServer();
}

function setCircles(){
    circle1.style.display = 'block';
    circle2.style.display = 'block';

    maxX = anim.clientWidth - circle1.clientWidth;
    maxY = anim.clientHeight - circle1.clientHeight;

    circle1X = Math.random() * maxX;
    circle1Y = 0;
    circle2X = Math.random() * maxX;
    circle2Y = maxY;

    circle1.style.transform = 'translate(' + circle1X + 'px,' + circle1Y + 'px)';
    circle2.style.transform = 'translate(' + circle2X + 'px,' + circle2Y + 'px)';
}

function animateCircles(){
    const velocity = 5;
    const angle1 = Math.random() * 180;
    const angle2 = Math.random() * 180;
    let vel1X = velocity * Math.cos(angle1);
    let vel1Y = velocity * Math.sin(angle1);
    let vel2X = velocity * Math.cos(angle2);
    let vel2Y = velocity * Math.sin(angle2);

    function move_circles() {
        if (stopAnimation) {
            return;
        }

        circle1X += vel1X;
        circle1Y += vel1Y;
        circle2X += vel2X;
        circle2Y += vel2Y;

        logEvent('Circle 1 and Circle 2 moved');

        if (circle1X < 0 || circle1X > maxX){
            vel1X = -vel1X;
            logEvent('Circle 1 hit border');
        }
        if (circle1Y < 0 || circle1Y > maxY){
            vel1Y = -vel1Y;
            logEvent('Circle 1 hit border');
        }
        if (circle2X < 0 || circle2X > maxX){
            vel2X = -vel2X;
            logEvent('Circle 2 hit border');
        }
        if (circle2Y < 0 || circle2Y > maxY){
            vel2Y = -vel2Y;
            logEvent('Circle 2 hit border');
        }

        if (Math.abs(circle1X - circle2X) < circle1.clientWidth &&
            Math.abs(circle1Y - circle2Y) < circle1.clientHeight) {
            vel1X = -vel1X;
            vel1Y = -vel1Y;
            vel2X = -vel2X;
            vel2Y = -vel2Y;
            logEvent('Circle 1 and Circle 2 hit each other');
        }

        if (((((circle1Y+circle1.clientHeight) < 0.5*anim.clientHeight) && ((circle2Y+circle2.clientHeight) < 0.5*anim.clientHeight))) ||
            (((circle1Y > 0.5*anim.clientHeight) && (circle2Y > 0.5*anim.clientHeight)))) {
            stopAnimation = true;
            start_reload_btn.innerHTML = 'Reload';
            start_reload_btn.disabled = false;
            logEvent('Circle and Circle 2 are on the same side');
        }

        circle1.style.transform = 'translate(' + circle1X + 'px,' + circle1Y + 'px)';
        circle2.style.transform = 'translate(' + circle2X + 'px,' + circle2Y + 'px)';

        requestAnimationFrame(move_circles);
    }

    move_circles();
}

function logEvent(event){
    eventNum++;
    message_div.textContent = event;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/saveEvent.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send('n='+eventNum+'&event='+event);

}

function loadEventsFromServer(){
    let eventsArray = [];
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let strArr = xhr.responseText.trim().split('\n');

                console.log(xhr.responseText);
                console.log(strArr);

                strArr.forEach(str => {
                    const eventProperties = str.split(';');
                    eventsArray.push({ n:eventProperties[0],
                                       time:eventProperties[1],
                                       event:eventProperties[2]});
                });
                console.log(eventsArray);
            } else {
                console.error('Request failed with status: ' + xhr.status);
            }
        }
    }
    xhr.open('GET', 'php/getAllEvents.php', true);
    xhr.send();
}