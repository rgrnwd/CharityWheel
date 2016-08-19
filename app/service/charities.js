var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var mongoose = require('mongoose');

function savecharity(selectedcharity) {
    var charity = mongoose.model('charity');
    charity = Promise.promisifyAll(charity);
    Promise.promisifyAll(charity.prototype);

    return charity.findByIdAsync(selectedcharity).then(function (charity) {
        charity.lastSelected = new Date();
        return charity.saveAsync().catch(function (err) {
            console.error("Error saving charity", err);
            throw 500;
        });
    }).catch(function (err) {
        console.error("Error finding the selected charity", err);
        throw 400;
    });
}

function charityAlreadySavedForTheWeek() {
    var charity = mongoose.model('charity');
    charity = Promise.promisifyAll(charity);
    Promise.promisifyAll(charity.prototype);

    var startOfWeek = moment().startOf('week').subtract(2, 'days'); //Friday 
    if (moment().day() >= 5) 
        startOfWeek = startOfWeek.add(7, 'days');

    console.log('start of week is ', startOfWeek.toDate());

    var startOfWeekInMillis = startOfWeek.valueOf();
    console.log(startOfWeek.format());
    return charity.findAsync().then(function(charities) {
        var selectedcharity = _.find(charities, function(charity) {
            if (charity.lastSelected) {
                console.log('charity last selected on: ', charity.lastSelected)
                return charity.lastSelected.getTime() > startOfWeekInMillis;
            }
            return false;
        });
        return selectedcharity ? true : false;
    }).catch(function(err) {
        console.error("Error reading charities", error);
        throw 500;
    });
}

module.exports = {
    charityAlreadySavedForTheWeek: charityAlreadySavedForTheWeek,
    savecharity: savecharity
};