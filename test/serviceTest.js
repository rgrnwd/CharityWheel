var assert = require('chai').assert;
var requestPromise = require('request-promise');
var sinon = require('sinon');
require('sinon-as-promised');
var http = require('http');
var url = require('../public/js/url.js');
var service = require('../public/js/service.js');

describe('charity Service', function() {
    beforeEach(function() {
        this.request = sinon.stub(http, 'request');
        sinon.stub(url, 'getBaseUrl').returns('http://somehost');
    });

    afterEach(function() {
        http.request.restore();
        url.getBaseUrl.restore();
    });

    describe('getcharities', function(){

        it('should call the correct api to retrieve charities', function() {
            sinon.stub(requestPromise, 'get').withArgs({uri: 'http://somehost/charities', json: true}).resolves('result');
            return service.getcharities().then(function(result) {
                assert.isTrue(result === 'result');
                requestPromise.get.restore();
            });
        });
        it('should return error if the request errors', function() {
            sinon.stub(requestPromise, 'get').withArgs({uri: 'http://somehost/charities', json: true}).rejects('Something went wrong');
            return service.getcharities().catch(function(error) {
                assert.isTrue(error.message === 'Something went wrong');
                requestPromise.get.restore();
            });
        });
    });

    describe('savecharityForTheWeek', function() {
        var charityId = "1234567";

        it('should post data to the correct api', function() {
            sinon.stub(requestPromise, 'post').withArgs({uri: 'http://somehost/charities/select/' + charityId}).resolves();

            return service.savecharityForTheWeek({id: charityId}).then(function(result) {
                assert.isUndefined(result);
                requestPromise.post.restore();
            });
        });
        it('should return error if the request errors', function() {
            sinon.stub(requestPromise, 'post').withArgs({uri: 'http://somehost/charities/select/' + charityId}).rejects('Something went wrong');
            return service.savecharityForTheWeek({id: charityId}).catch(function(error) {
                assert.isTrue(error.message === 'Something went wrong');
                requestPromise.post.restore();
            });
        });
    });
});
