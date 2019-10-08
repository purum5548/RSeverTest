var express = require('express');
var router = express.Router();
var url = require('url');
var mongodb = require('../UserModlues/dbconnect');

/* GET home page. */
router.get('/', function(req, res, next) {
  var uri = url.parse(req.url,true);
  var count;
  var prev,next;
  if(uri.query.count== undefined){
    count = 1;
  } else{
    count = uri.query.count;
    count *= 1;
    if(count < 1){
      count  = 1;
    }
  }
  mongodb.Docs.count(function(e, num){
    var canc = Math.ceil(num/10);
    if(count > canc){
      count  = canc;
    }
    if(count > 1){
      prev = '/board?count=' + (count - 1);
    }else{
      prev = '/board?count=' + count;
    }
    if(count < canc){
      next = '/board?count=' + (count + 1);
    }else{
      next = '/board?count=' + count;
    }
    mongodb.Docs.find(function(err,data){
      var min = data.length - (10 * count);
      var max = data.length - (10 * count) + 10;
      if(min < 0){min = 0;}
      var doc = data.slice(min, max);
      console.log(doc);
      console.log(doc.length);
      res.render('Board', { title: '호로록! 닷컴^^', Login : req.session.login, user : req.session.user, Docs : doc, prev : prev, next : next, count : count, min : min});
    });
  });
});

router.get('/post', function(req, res, next) {
  var uri = url.parse(req.url,true);
  var idx = uri.query.num;
  mongodb.Docs.find( function(err,data){
    if(data.length <= idx){
      redirect('/board');
      return;
    }
    var doc = data[idx];
    console.log(uri.num);
    res.render('Docs', { title: '호로록! 닷컴^^', Login : req.session.login, user : req.session.user, Docs : doc});
  });
});

router.get('/GetPost', function(req, res, next) {
  res.render('GetPost', { title: '호로록! 닷컴^^', Login : req.session.login, user : req.session.user});
});

router.post('/Submit', function(req, res, next){
  var uri = req.body;
  var sess = req.session;
  if(sess.login != 'login'){
    console.log('허가받지 않은 사용자가 글을 게시하려 했습니다.');
    res.redirect('/Board');
    return;
  }
  mongodb.User.find({nickname : sess.user},function(err,data){
    console.log(sess.user);
    var dbuserdata = new mongodb.Docs({id : data.id, nickname : sess.user, data : uri.data, title : uri.title }); // 새로운 도큐먼트 생성
    dbuserdata.save(function(error, data){ // 저장
      if(error){
        console.log(error);
      }else{
        console.log('Saved!');
      }
      res.redirect('/Board');
    });
  });
});

module.exports = router;
