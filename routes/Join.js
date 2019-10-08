var express = require('express');
var router = express.Router();
var url = require('url');
const crypto = require('crypto');
var mongodb = require('../UserModlues/dbconnect');



/* GET users listing. */
router.get('/', function(req, res, next) {
  var uri = url.parse(req.url,true);
  if(uri.query.id == undefined){
  res.render('Join', { title: '호로록! 닷컴^^', Login : 'none', id : 'null', pass:'null', nick:'null'});
} else{
  res.render('Join', { title: '호로록! 닷컴^^', Login : 'none', id : uri.query.id, pass:uri.query.pass, nick:uri.query.nick});
}
});

router.get('/EndJoin', function(req, res, next) {
  res.render('CompleateJoin', { title: '호로록! 닷컴^^', Login : 'none'});
});

router.post('/Submit', function(req, res, next){
  var uri = req.body;
  var errorsStock = {id : null, password : null, nickname : null};
  // 숫자로만 이뤄진 패스워드인가?
  if(uri.password.match("^[0-9]+$")){
    errorsStock.password = "패스워드가 숫자로만 이루어져 있습니다.";
  }
  // 영문으로만 이루어진 패스워드인가?
  if(uri.password.match("^[A-Za-z]+$")){
    errorsStock.password = "패스워드가 영문으로만 이루어져 있습니다.";
  }
  // 이상한 문자가 포함되어있는가?
  if(!uri.password.match("^[A-Za-z0-9]+$")){
    errorsStock.password = "패스워드에 허용되지 않는 문자가 들어있습니다.";
  }
  // 패스워드 검사
  if(uri.password != uri.passwordCheck){
    errorsStock.password = "패스워드가 일치하지 않습니다.";
  }
  // 패스워드 길이가 짧을 때
  if(uri.password.length < 8){
    errorsStock.password = "패스워드가 너무 짧습니다.";
  }
  mongodb.User.findOne({ id: uri.id,  }, function (err, member) {
    // 이상한 문자가 포함되어있는가?
    if(!uri.id.match("^[A-Za-z0-9]+$")){
      errorsStock.id = "아이디에 허용되지 않는 문자가 포함되어있습니다.";
    }
    if(member != null) {
      errorsStock.id = '이미 존재하는 아이디입니다.';
    }
    // 아이디 길이가 짧을 때
    if(uri.id.length < 8){
      errorsStock.id = "아이디가 너무 짧습니다.";
    }
    mongodb.User.findOne({ nickname: uri.nickName  }, function (err, nickn) {
      if(nickn != null) {
        errorsStock.nickname = '이미 존재하는 닉네임입니다.';
      }
      var pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/;
      if(pattern_spc.test(uri.nickName)){
        errorsStock.nickname = '닉네임에 특수 문자가 포함되어있습니다.';
      }
      if(uri.nickName.length < 4){
        errorsStock.nickname = '닉네임이 너무 짧습니다.';
      }
      if(errorsStock.id == null && errorsStock.nickname == null && errorsStock.password == null){
        var cryptoPassWord = crypto.createHash('sha512').update(uri.password).digest('base64'); // 비밀번호 단방향 암호와(복호화 불가능)
        var dbuserdata = new mongodb.User({id : uri.id, password : cryptoPassWord, nickname : uri.nickName}); // 새로운 도큐먼트 생성
        dbuserdata.save(function(error, data){ // 저장
          if(error){
            console.log(error);
          }else{
            console.log('Saved!');
          }
        });
        console.log("회원가입 성공!");
        res.redirect('/Join/EndJoin');
      }else{
        var queryString = '/Join?id='+ errorsStock.id + '&pass=' + errorsStock.password + '&nick=' + errorsStock.nickname;
        res.redirect(queryString);
      }
    });
  });
})


router.get('/idCheck', function(req, res, next) {
  var uri = url.parse(req.url,true);
  mongodb.User.findOne({ id: uri.query.id }, function (err, member) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if(member != null) {
      res.end('true');
    }
    else {
      res.end('false');
    }
  });
});

router.get('/nickCheck', function(req, res, next) {
  var uri = url.parse(req.url,true);
  mongodb.User.findOne({ nickname: uri.query.nick }, function (err, member) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if(member != null) {
      res.end('true');
    }
    else {
      res.end('false');
    }
  });
});

module.exports = router;
