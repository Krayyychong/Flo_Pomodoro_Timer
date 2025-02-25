/*
-- let --
variables declared with let have "Block Scope"
variables declared with let must be "declared" before use
variables declared with let CANNOT be "re-declared" in the same scope

-- var --
variables declared with var always have "Global Scope"
variables declared with var CANNOT have "Block Scope"
*/

//global
const menuContainer = document.getElementById("menu_container");
const pomoListContainer = document.getElementById("pomolist_container");
const pomodoroContainer = document.getElementById("pomodoro_container");
const flomodoroContainer = document.getElementById("flomodoro_container");
const Titleinfo = document.getElementById("info");

const pomocountdownEl = document.getElementById("pomocountdown_display");
const flomocountdownEl = document.getElementById("flomocountdown_display");

const flomoBreakBtn = document.getElementById("take_break_control");
const pomoGif = document.getElementById("pomo_gif");
const flomoGif = document.getElementById("flomo_gif");

const notificationSound = new Audio ("images/timesup.wav");

let interval; //global variable to store the timer interval
var focusTime;
var breakTime;
let flomoStartTime = 0;
let isRunning = false;

//to play the notification sound and bring the window to the front
function notifyUser(){
    notificationSound.play();

    //bring the window to the front
    window.focus();
}

//display the pomodoro list, and hide the menu container
function pomoList(){
    //show pomolist container
    pomoListContainer.style.display = "block";

    //hide menu container
    menuContainer.style.display = "none";
    pomodoroContainer.style.display = "none";

}

function returnToMainMenu(){
    //stop the countdown timer
    clearInterval(interval);

    menuContainer.style.display = "block";
    
    pomoListContainer.style.display = "none";
    pomodoroContainer.style.display = "none";
    flomodoroContainer.style.display = "none";
    pomocountdownEl.innerHTML = "Pomodoro Starts!"; //reset the countdown display
    flomocountdownEl.innerHTML = "Flomodoro Starts!";
    isRunning = false;
    Titleinfo.innerHTML = "Select your preferred function!"; 
    flomoBreakBtn.style.display = "block";
    pomoGif.src = "images/study2.gif";
    flomoGif.sec = "images/study1.gif";


}

function countdownPomo(time1, time2) {
    Titleinfo.innerHTML = `Promodoro-ing... <br> ${time1/60} minute(s) focus, ${time2/60} minute(s) break`; 
    pomodoroContainer.style.display = "block";
    pomoListContainer.style.display = "none";
    //set the gif to study.gif
    pomoGif.src = "images/study2.gif";

    focusTime = time1;
    breakTime = time2;

    let currentTime = time1;
    let isTime1 = true; //keep track of which timer is runnning

    function updateCountdown() {
        const minutes = Math.floor(currentTime/ 60);
        let seconds = currentTime % 60;
        //add a leading zero for better formatting
        seconds = seconds < 10 ? '0' + seconds : seconds;

        pomocountdownEl.innerHTML = `${minutes}:${seconds}`; //it is backticks `` not single quote ''
        currentTime--;

        if (currentTime < 0) {
            if (isTime1) {
                notifyUser();

                //switch to time2 after time1 ends
                pomocountdownEl.innerHTML = "Let's have a break.";
                pomoGif.src = "images/rest.gif"; //change gif to rest.gif
                currentTime = time2;
                isTime1 = false;
            } else {
                notifyUser();

                //Stop the timer completely after time2 ends
                clearInterval(interval);
                pomocountdownEl.innerHTML = "Pomodoro Ends! <br> Get back to work?";
                pomoGif.src = "images/congratulation.gif";
            }
        }
    }
    //Start the countdown and update every second
    interval = setInterval(updateCountdown, 1000);
}

function resetPomo(){
    clearInterval(interval);
    pomocountdownEl.innerHTML = "Pomodoro Starts!"; //reset the countdown display
    pomoGif.src = "images/study2.gif"
    countdownPomo(focusTime, breakTime);
}

function flomo(){
    Titleinfo.innerHTML = "Flomodoro-ing..."; 
    flomodoroContainer.style.display = "block";
    menuContainer.style.display = "none";
    flomoGif.src = "images/study1.gif";


    let elapsedTime = 0;

    if(!isRunning) {
        flomoStartTime = Date.now(); //record start time
        interval = setInterval(update_flomo, 1000); //start updating timer
        isRunning = true; 
    }

}

function breakFlomo(){
    if(isRunning){
        clearInterval(interval); //stop the focus timer
        isRunning = false;
        flomoGif.src = "images/rest.gif";

        //Calculate total focus time in seconds
        const elapsedTime = Math.floor((Date.now() - flomoStartTime) / 1000); //Convert milliseconds to seconds
        focusTime = elapsedTime;

        //Calculate break time (focustime / 5)
        breakTime = Math.floor(focusTime / 5);

        //Display calculated times
        Titleinfo.innerHTML = `You focused for ${Math.floor(focusTime/60)} minute(s), <br>let's have a ${Math.floor(breakTime/60)} minute(s) of break.`
        
        //start break timer
        startBreakTimer();
    }
}

function startBreakTimer(){
    let currentTime = breakTime;
    flomoBreakBtn.style.display = "none";

    function updateBreakCountdown(){
        let minutes = Math.floor(currentTime / 60);
        let seconds = currentTime % 60;

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        flomocountdownEl.innerHTML = `${minutes}:${seconds}`;
        currentTime--;

        if (currentTime < 0) {
            notifyUser();

            clearInterval(interval); //stop the break timer
            flomocountdownEl.innerHTML = "Break Ends! <br> Re-flomodoro?";
            flomoGif.src = "images/congratulation.gif";
        }
    }

    interval = setInterval(updateBreakCountdown, 1000);
}

function update_flomo(){
    const currentTime = Date.now();
    elapsedTime = Math.floor(currentTime - flomoStartTime) / 1000; //elapsed time in seconds

    let hours = Math.floor(elapsedTime / (60*60));
    let minutes = Math.floor((elapsedTime % (60*60)) /60);
    let seconds = Math.floor(elapsedTime % 60);

    //add leading zeros for formatting/padding
    hours = String(hours).padStart(2, "0"); 
    //add padding into the numbers, when the number is single digit, the another digit should display "0"
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    flomocountdownEl.innerHTML = `${hours}:${minutes}:${seconds}`;

}

function resetFlomo(){
    isRunning = false;
    clearInterval(interval);
    flomocountdownEl.innerHTML = "Flomodoro Starts!"; //reset the countdown display
    flomoBreakBtn.style.display = "block";
    flomoGif.src = "images/study1.gif";
    
    flomo();
}


//initial setup: hide container by default
window.onload = () => {
    pomoListContainer.style.display = "none";
    pomodoroContainer.style.display = "none";
    flomodoroContainer.style.display = "none";
}