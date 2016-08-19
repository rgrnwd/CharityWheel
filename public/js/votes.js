module.exports = {
    getTotalVotes : getTotalVotes
}

function getTotalVotes(charities) {
    var totalVotes = 0;

    for(var i = 0; i < charities.length; i++) {
        totalVotes += charities[i].votes;
    }

    return totalVotes;
}