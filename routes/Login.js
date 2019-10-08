var express = require('express');
var router = express.Router();
var url = require('url');
var mongodb = require('../UserModlues/dbconnect');
const crypto = require('crypto');



/* GET home page. */
router.get('/', function(req, res, next) {
  var uri = url.parse(req.url,true);
  if(uri.query.res == undefined){
    res.render('Login', { title: '호로록! 닷컴^^', Login : 'none', res : 'null'});
  } else{
    res.render('Login', { title: '호로록! 닷컴^^', Login : 'none', res : uri.query.res});
  }
});

router.post('/Submit', function(req, res, next){
  var uri = req.body;
  var pass = crypto.createHash('sha512').update(uri.password).digest('base64');
  mongodb.User.findOne({ id: uri.id, password: pass, }, function (err, member) {
    if(member != null){
      var sess = req.session;
      sess.login = 'login';
      sess.id = member.id;
      sess.user = member.nickname;
      res.redirect('/');
    }else{
      res.redirect('/Login?res=로그인에 실패했습니다.');
    }
  });
});

router.get('/Logout', function(req, res, next) {
  var sess = req.session;
  sess.destroy(function(err){
     res.redirect('/');
});

});

module.exports = router;
