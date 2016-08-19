module.exports = {
    hideSpeechBubble: hideSpeechBubble,
    showSelectedcharity: showSelectedcharity
};

function hideSpeechBubble() {
    var result = document.getElementById("lunch-result");
    result.innerText = "Charity, yay!";
    result.className = "speech-bubble hidden";
}

function showSelectedcharity(charity) {
    var result = document.getElementById("lunch-result");
    result.innerText = charity.name + ', ' + charity.emotion;
    result.className = "speech-bubble";
}

