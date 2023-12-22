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
    document.querySelector('#table-container').innerHTML = '';
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
    loadEventsFromServer().then(function(serverEvents) {
        const localStorageEvents = loadEventsFromLocalStorage();
        localStorage.clear();
        serverEvents.sort(function(a,b) {
            return a.n - b.n;
        });
        localStorageEvents.sort(function(a,b) {
            return a.n - b.n;
        });
        const eventsNum = serverEvents.length;
        const table = document.createElement('table');
        table.setAttribute('id', 'table');
        table.style.borderCollapse = 'collapse';
        const headerRow = table.insertRow();
        const serverTh = document.createElement('th');
        serverTh.setAttribute('colspan', '3');
        serverTh.textContent = 'Server';
        headerRow.appendChild(serverTh);
        const localStorageTh = document.createElement('th');
        localStorageTh.setAttribute('colspan', '3');
        localStorageTh.textContent = 'localStorage';
        headerRow.appendChild(localStorageTh);
        const headerRow2 = table.insertRow();
        const headers = ['N', 'Time', 'Event'];
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < headers.length; j++) {
                let cell = document.createElement('td');
                cell.textContent = headers[j];
                headerRow2.appendChild(cell);
            }
        }
        for (let i = 0; i < eventsNum; i++){
            const serverEvent = serverEvents.shift();
            const localStorageEvent = localStorageEvents.shift();
            const row = table.insertRow();
            let cell = row.insertCell();
            cell.textContent = serverEvent.n;
            cell = row.insertCell();
            cell.textContent = serverEvent.time;
            cell = row.insertCell();
            cell.textContent = serverEvent.event;
            cell = row.insertCell();
            cell.textContent = localStorageEvent.n;
            cell = row.insertCell();
            cell.textContent = localStorageEvent.time;
            cell = row.insertCell();
            cell.textContent = localStorageEvent.event;
        }
        table.style.display = 'block';
        document.querySelector('#table-container').appendChild(table);
    });
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

    const now = new Date();
    const formattedTime = now.getHours() + ':' + now.getMinutes() + ':' +
                          now.getSeconds() + ':' + now.getMilliseconds();
    localStorage.setItem(eventNum.toString(), formattedTime + ';' + event);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/saveEvent.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send('n='+eventNum+'&event='+event);
}

function loadEventsFromServer(){
    return new Promise(function (resolve, reject){
        let eventsArray = [];
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    let strArr = xhr.responseText.trim().split('\n');
                    strArr.forEach(str => {
                        const eventProperties = str.split(';');
                        eventsArray.push({ n:eventProperties[0],
                            time:eventProperties[1],
                            event:eventProperties[2]});
                    });
                    resolve(eventsArray);
                } else {
                    reject('Request failed with status: ' + xhr.status);
                }
            }
        };
        xhr.open('GET', 'php/getAllEvents.php', true);
        xhr.send();
    });
}

function loadEventsFromLocalStorage(){
    let eventsArray = [];
    const keys = Object.keys(localStorage);
    for (let i = 0; i < keys.length; i++){
        const value = localStorage.getItem(keys[i]);
        const valueArr = value.split(';');
        eventsArray.push({ n: keys[i].toString(),
                           time: valueArr[0],
                           event: valueArr[1]});
    }
    return eventsArray;
}