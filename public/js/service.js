var http = require('http');
var requestPromise = require('request-promise');
var url = require('./url.js');

module.exports = {
    getcharities: getcharities,
    savecharityForTheWeek: savecharityForTheWeek,
    choiceMadeThisWeek : choiceMadeThisWeek
};

function getcharities() {
    var options = {
        uri: url.getBaseUrl() + '/charities',
        json: true
    };
    return requestPromise.get(options);
}

function choiceMadeThisWeek(){
    var options = {
        uri: url.getBaseUrl() + '/charitieselected',
        json: true
    }
    return requestPromise.get(options);
}

function savecharityForTheWeek(charity) {
    var options = {
        uri: url.getBaseUrl() + '/charities/select/' + charity.id
    };

    return requestPromise.post(options)
}
