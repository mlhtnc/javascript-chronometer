// Add event listeners to buttons
window.addEventListener("load", function() {
  document.getElementById("button-start-stop").addEventListener("click",
    function() {
      isStarted = !isStarted;
      if(isStarted == true) {
        startTime();
      }
      else {
        stopTime();
      }
    }
  );
  document.getElementById("button-reset").addEventListener("click", resetTime);
  document.getElementById("button-lap").addEventListener("click", recordLapTime);

  document.addEventListener("keydown", function(e) {
    e = e || window.event;
    var keycode = e.keyCode || e.which;
    e.preventDefault();

    switch(keycode)
    {
      case 32: // ' ' spacebar
        document.getElementById("button-start-stop").click();
        break;
      case 76:  // 'l'
      case 108: // 'L'
        document.getElementById("button-lap").click();
        break;
      case 82:  // 'r'
      case 114: // 'R'
        document.getElementById("button-reset").click();
        break;
    }
  });

  setInterval(checkActiveElement, 100);
});

// Chronometer status
var isStarted = false;
var isReset = true;

var sTime;
var elapsedTime = 0;
var lapCount = 0;

var intervalId;
var buttonIntervalId;

function startTime() {
  sTime = new Date().getTime();
  clearInterval(intervalId);
  intervalId = setInterval(displayTime, 72);
}

function stopTime() {
  clearInterval(intervalId);
  displayTime();

  elapsedTime += getDeltaTime();
}

function resetTime() {
  clearInterval(intervalId);
  isStarted = false;
  elapsedTime = 0;
  lapCount = 0;

  document.getElementById('time').innerHTML = "00:00:00";
  document.getElementById('millisec').innerHTML = "000";
  document.getElementById('lap').innerHTML = "";

  // If media matches, slide containers a little bit.
  var media = window.matchMedia("(max-width: 480px)");
  if(media.matches == true) {
    document.getElementsByClassName('button-container')[0].style.top = "55%";
    document.getElementsByClassName('container')[0].style.minHeight = "50%";
    document.getElementsByClassName('information')[0].style.minHeight = "50%";
  }
}

// Record lap times
function recordLapTime() {
  if(isStarted == false)
    return;
      
  elapsedTime += getDeltaTime();
  var timeArr = getTimeAsString(elapsedTime);
  sTime = new Date().getTime();

  // I did a little hack here. after lap#999
  // format would be broken.
  document.getElementById('lap').innerHTML =
  "<pre>#" + (++lapCount) + ((lapCount < 100) ? "\t    " : "    ") + timeArr[0] +
  "." + timeArr[1] + "</pre>" + document.getElementById('lap').innerHTML;

  // If media matches, slide containers a little bit.
  var media = window.matchMedia("(max-width: 480px)");
  if(media.matches == true) {
    document.getElementsByClassName('button-container')[0].style.top = "45%";
    document.getElementsByClassName('container')[0].style.minHeight ="60%";
    document.getElementsByClassName('information')[0].style.minHeight ="40%";
  }
}

// Gets the passed time since sTime.
function getDeltaTime() {
  var endTime = new Date().getTime();
  return endTime - sTime;
}

// Updates time in HTML.
function displayTime() {
  var delta = elapsedTime + getDeltaTime();
  var timeArr = getTimeAsString(delta);

  document.getElementById('time').innerHTML = timeArr[0];
  document.getElementById('millisec').innerHTML = timeArr[1];
}

// Get time in milliseconds and return as
// hh:mm:ss | [ms][ms][ms] format.
function getTimeAsString(time) {
  var ms = addLeadingZeros(time % 1000, 3);
  time = parseInt(time / 1000);
  var sec = addLeadingZeros(time % 60, 2);
  time = parseInt(time / 60);
  var min = addLeadingZeros(time % 60, 2);
  time = parseInt(time / 60);
  var hour = addLeadingZeros(time % 60, 2);

  var timeArr = [];
  timeArr.push( hour + ":" + min + ":" + sec );
  timeArr.push( ms );

  return timeArr;
}

// This method helps formating time.
function addLeadingZeros(num, fixedLen) {
  var ret = "";
  var temp = num;
  var numLen = 0;

  while(num != 0 && temp != 0) {
    numLen++;
    temp = parseInt(temp / 10);
  }

  for(var i = 0; i < fixedLen - numLen; i++) {
    ret += "0";
  }

  if(num != 0)
    ret += num;

  return ret;
}

// We don't wanna focus our buttons. Because it has some side effects.
// e.g. spacebar and enter keys will fire activeElement.
function checkActiveElement() {
  var buttonLap = document.getElementById("button-lap");
  var buttonReset = document.getElementById("button-reset");
  var buttonStartStop = document.getElementById("button-start-stop");

  if(document.activeElement == buttonLap   ||
     document.activeElement == buttonReset ||
     document.activeElement == buttonStartStop
  ) {
    document.activeElement.blur();
  }
}
