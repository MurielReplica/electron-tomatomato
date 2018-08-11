/**
 * countdown scriot
 *
 * (c) MurielReplica
 * license MIT
 * version 0.1.0
 */
var m=3;
var s=0;
var ipc = require('electron').ipcRenderer;

// 現在時刻にカウントダウンの時間を加算してスタート日時を作る
function setStartDt() {
  var dt = new Date();
  dt.setMinutes(dt.getMinutes() + m);
  dt.setSeconds(dt.getSeconds() + (s+1));
  return dt;
}

// タイマーを初期化
function initCountdown(){
  console.log('init m -> '+m);
  console.log('init s -> '+s);

  UIkit.countdown('#timer', {date: setStartDt(m,s).toISOString()});
}

// タイマー開始
function startCountdown(pm, ps){
  console.log('start m -> '+m);
  console.log('start s -> '+s);
  m=pm
  s=ps

  initCountdown();
  UIkit.countdown('#timer').start();
  ipc.send('actionStart', 'start');
  return false;
}

// タイマー一時停止
function stopCountdown(){
  UIkit.countdown('#timer').stop();
  return false;
}

// タイマーリセット
function resetCountdown(){
  // console.log('reset');
  initCountdown(m,s);
  UIkit.countdown('#timer').stop();
  return false;
}

// タイマー終了
function endCountdown(){
  console.log('end m-> '+m+' / s-> '+s);
  resetCountdown();
  ipc.send('actionEndSync', 'bowbow');
  addDonelist();
}

// 完了したらリストに追加
function addDonelist() {
    var d = $('#todo').val();
    if (d=='') {
        d="Done";
    }

    $('#donelist').append('<p class="uk-article-meta">'+m+'min. '+s+'sec. : '+d+'</p>');
}


function zihou(){
  $("#zihou")[0].play();
}
