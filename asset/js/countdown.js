var m=3;
var s=0;
var ipc = require('electron').ipcRenderer;

// 現在時刻にカウントダウンの時間を加算してスタート日時を作る
function setStartDt(pm, ps) {
  var dt = new Date();
  dt.setMinutes(dt.getMinutes() + pm);
  dt.setSeconds(dt.getSeconds() + (ps+1));
  return dt;
}

function initCountdown(pm, ps){
  console.log('init m -> '+m);
  console.log('init pm -> '+pm);
  console.log('init s -> '+s);
  console.log('init ps -> '+ps);

  if (pm!==m || ps!==s) {
    UIkit.countdown('#timer', {date: setStartDt(pm,ps).toISOString()});
    m=pm;
    s=ps;
  }
}

function startCountdown(pm, ps){
  console.log('start m -> '+m);
  console.log('start pm -> '+pm);
  console.log('start s -> '+s);
  console.log('start ps -> '+ps);

  initCountdown(pm,ps);
  UIkit.countdown('#timer').start();
  return false;
}

function stopCountdown(){
  UIkit.countdown('#timer').stop();
  return false;
}

function resetCountdown(){
  console.log('reset');
  pm=m;
  ps=s;
  m=0;
  s=0;
  initCountdown(pm,ps);
  UIkit.countdown('#timer').stop();
  return false;
}

function endCountdown(){
  resetCountdown();
  ipc.send('actionEndSync', 'bowbow');
  addDonelist();
}

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
