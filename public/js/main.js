var service = require('./service.js');
var wheel = require('./wheel.js');
var colors = require('./colors.js');
var speechBubble = require('./speech_bubble.js');
var audioTrack = require('./audio.js');
var moment = require('moment');
var _ = require('lodash');

var scaleFactor = 1;
var charityList;
var colorsList;

window.onload = function() {
    scaleFactor = calculateScaleFactor();
    loadcharities(scaleFactor);
};

window.addEventListener("resize", function(){
    handleResize();
});

function handleResize(){
    
    var newScaleFactor = calculateScaleFactor();
    if (scaleFactor != newScaleFactor){
        scaleFactor = newScaleFactor;
        wheel.init(charityList, scaleFactor, colorsList);
    }    
}

function calculateScaleFactor(){
    var scale = 1;

    var w = window.innerWidth-2; // -2 accounts for the border
    var h = window.innerHeight-2;

    if (h < 300 || w < 320){
        scale = 0.5;
    }
    else if (h < 500 || w < 400){
        scale = 0.65;
    }
    else if (h < 600 || w < 600){
        scale = 0.8;
    }
    
    return scale;
}

function loadcharities() {
    service.getcharities().then(function(charities) {
        charityList = charities;
        analyseLastWeeksChoice().then(function(updatedcharities){
            getColorsBycharities(updatedcharities);
            addCanvasEvents();
            wheel.init(updatedcharities, scaleFactor, colorsList);
        });
    }).catch(function(error) {
        console.log(error);
    });
}

function analyseLastWeeksChoice(){
    sortcharitiesByLastSelected();

    return service.choiceMadeThisWeek().then(function (response){
        if (response){
            fillcharityWheelWithSelectedChoice();
        }
        else {
            removeLastWeeksChoice();
        }
        return charityList;
    }); 
}
function fillcharityWheelWithSelectedChoice(){
    charityList.forEach(function(part, index, theArray) {
      theArray[index] = charityList[0];
    });
}
function sortcharitiesByLastSelected(){
    charityList = _.sortBy(charityList, function(charity){
        return charity.lastSelected ? new Date(charity.lastSelected).getTime() : 0;
    }).reverse();
}
function removeLastWeeksChoice(){
    charityList.splice(0, 3);
}

function getColorsBycharities(charities){
    var numberOfColorsNeeded = countcharitiesWithPositiveVoteCount(charities);
    colorsList = colors.generateColors(numberOfColorsNeeded);
}

function addCanvasEvents(){
    var drawingCanvas = document.getElementById("canvas");
    drawingCanvas.addEventListener('wheelStopped', handleWheelStopped, false);
    drawingCanvas.addEventListener('wheelStarted', handleWheelStarted, false);
}

function countcharitiesWithPositiveVoteCount(charities) {
    var colorsRequired = 0;

    for (var i = 0; i < charities.length; i++) {
        if (charities[i].votes > 0) {
            colorsRequired++;
        }
    }

    return colorsRequired;
}

function handleWheelStarted() {
    speechBubble.hideSpeechBubble();
    audioTrack.play(true);
    showCheer(true);
}

function handleWheelStopped(e) {
    speechBubble.showSelectedcharity(e.detail);
    savecharity(e.detail);
    audioTrack.play(false);
    showCheer(false);
}

function savecharity(charity) {
    service.savecharityForTheWeek(charity).then(function() {
    }).catch(function(error) {
        console.log(error);
    });
}

function showCheer(show){
    if (show){
        document.getElementById("cheer-right").className = "cheerleader right";
        document.getElementById("cheer-left").className = "cheerleader left";
        document.getElementById("cheer-bottom").className = "cheerleader bottom";
    }else{
        document.getElementById("cheer-right").className = "cheerleader right hidden ";
        document.getElementById("cheer-left").className = "cheerleader left hidden";
        document.getElementById("cheer-bottom").className = "cheerleader bottom hidden";
    }
}