var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('../config/config');
var charitieservice = require('../app/service/charities');

router.get('/charities', function(req, res) {
  var charity = mongoose.model('charity');
  var query = charity.find();
  query.exec(function(err, docs) {
    res.json(docs.map(function(doc){
      return {id: doc._id, name: doc.name, emotion: doc.emotion, lastSelected: doc.lastSelected, votes: doc.votes};
    }));
  });
});

router.get('/charitieselected', function(req, res){

  charitieservice.charityAlreadySavedForTheWeek().then(function(selected){
    res.json(selected);
  });
});

router.post('/charities/select/:charity', function(req, res) {
  charitieservice.charityAlreadySavedForTheWeek().then(function(selected) {
    if (!selected) {
      console.log("charity will be saved as this week's selection");
      return charitieservice.savecharity(req.params.charity);
    }
    console.log("charity for this week has already been saved");
  }).then(function () {
    res.status(200).end();
  }).catch(function (error) {
    res.status(error).end();
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'The Wheel' });
});

module.exports = router;
