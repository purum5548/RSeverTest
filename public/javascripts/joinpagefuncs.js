function idCheck() {
  var id = document.getElementById("id").value;
  if(id == '') {
    alert("아이디를 입력해 주세요.");
  }
  else {
    $.get('/Join/idCheck?id=' + id, function(data,err) {
      if(data == 'true') {
        $('#id').val('');
        alert('이미 사용중인 ID입니다');
      }
      else {
        alert('사용 가능한 ID입니다');
      }
    });
  }
};

function nicknameCheck() {
  var id = document.getElementById("nick").value;
  if(id == '') {
    alert("닉네임을 입력해 주세요.");
  }
  else {
    $.get('/Join/nickCheck?nick=' + id, function(data,err) {
      if(data == 'true') {
        $('#nick').val('');
        alert('이미 사용중인 별명입니다');
      }
      else {
        alert('사용 가능한 별명입니다');
      }
    });
  }
};
