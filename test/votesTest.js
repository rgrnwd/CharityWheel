var votes = require('../public/js/votes.js');
var assert = require('chai').assert;

describe('Votes', function() {
    describe('getTotalVotes', function() {

    	it('should have zero votes if array is empty', function(){
    		var charities = [];
    		var result = votes.getTotalVotes(charities);
    		assert.equal(0, result);
    	});

    	it('should have one vote for array with one item and one vote', function(){
    		var charities = [{'votes': 1}];
    		var result = votes.getTotalVotes(charities);
    		assert.equal(1, result);
    	});

    	it('should aggregate votes for of all items in array', function(){
    		var charities = [{'votes': 1}, {'votes': 3}, {'votes':2}];
    		var result = votes.getTotalVotes(charities);
    		assert.equal(6, result);
    	});
    });
});