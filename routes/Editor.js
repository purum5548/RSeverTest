var express = require('express');
var router = express.Router();
var url = require('url');
var json = require('../node_modules/_RserverDataStructre/JsonManager');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('Edit', {title: '호로록! 닷컴^^'});
});

router.get('/Addmenu', function(req, res, next){
  var query = url.parse(req.url, true);
  var parsedQuery = query.query;
  var headerMenu = json.load('views/Layouts','header');
  var inst = {"IsDropDown":false,"Link":parsedQuery.linkAddress,"Name": parsedQuery.linkText}
  if(headerMenu.length > 40){
    headerMenu.splice(1,1);
  }
  headerMenu.push(inst);
  console.log(headerMenu);
  json.save(headerMenu,'views/Layouts','header');
  res.redirect('/');
})

router.get('/Removemenu', function(req, res, next){
  var query = url.parse(req.url, true);
  var parsedQuery = query.query;
  var headerMenu = json.load('views/Layouts','header');
  var num = parsedQuery.value *= 1;
  headerMenu.splice(num,1);
  console.log(headerMenu);
  json.save(headerMenu,'views/Layouts','header');
  res.redirect('/');
})

module.exports = router;
