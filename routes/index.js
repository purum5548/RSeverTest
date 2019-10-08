var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '호로록! 닷컴^^', Login : req.session.login, user : req.session.user});
});

module.exports = router;
