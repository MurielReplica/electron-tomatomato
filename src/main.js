/**
 * main.js
 *
 * (c) MurielReplica
 * license MIT
 * version 0.1.0
 */

const {app, BrowserWindow, powerSaveBlocker} = require('electron')


  // ウインドウオブジェクトのグローバル参照を保持してください。さもないと、そのウインドウは
  // JavaScript オブジェクトがガベージコレクションを行った時に自動的に閉じられます。
  let win
  let isStart = false;

  function createWindow () {
    // browser window を生成する
    win = new BrowserWindow({
      width: 780,
      height: 700,
      transparent: true,
      frame: false,
      webPreferences: {
        backgroundThrottling: false,
        pageVisibility: true,
      },
    });
    let ipc = require('electron').ipcMain;
    let psb= powerSaveBlocker.start('prevent-app-suspension');

    // macのウィンドウ枠に影を表示させない
    win.setHasShadow(false);

    // アプリの index.html を読み込む
    win.loadFile('src/views/index.html')

    // 開発者ツールを開く
    // win.webContents.openDevTools()

    // ウィンドウが閉じられた時に発火
    win.on('closed', () => {
      // ウインドウオブジェクトの参照を外す。
      // 通常、マルチウインドウをサポートするときは、
      // 配列にウインドウを格納する。
      // ここは該当する要素を削除するタイミング。
      win = null
    })

    // フォーカスがあたった
    win.on('focus', () => {
      console.log('focused ;(');

      if (win.getOpacity() != 1.0) {
        enableTomato()
      }
    })

    // フォーカスが外れた
    win.on('blur', () => {
      console.log('blured ;(')

      if (isStart && win.getOpacity() != 0.0) {
        disableTomato()
      }

      // フォーカスが外れたが常にTOPにいる指定がされている場合
      // ウィンドウを擬似的に非表示にする
      // 没処理。メモとして残しておく
      // if (win.isAlwaysOnTop()) {
      //   win.setOpacity(0.0)
      //   win.webContents.executeJavaScript(
      //     'document.getElementById("html").classList.add("mr-hidden");'
      //   )
      // }

    })

    win.on('hide', () => {
      console.log('hide');
    })

    /**************************************************
     * Call from view. Timer started.
     ***************************************************/
    ipc.on('actionStart', (event, arg) => {
      console.log('call start')
      // hideになるとタイマーが止まってしまう...。一時しのぎで無理やりそれっぽくする
      isStart = true
      disableTomato()
      win.blur()
      event.returnValue = 'thx';
    })

    /**************************************************
     * Call from view. Timer ended.
     ***************************************************/
    ipc.on('actionEndSync', (event, arg) => {
      console.log('call end')
      win.focus()
      enableTomato()
      win.setAlwaysOnTop(false);
      isStart = false
      event.returnValue = 'go!!'
    })
  }

  function disableTomato(){
    // 常にTOPへ置く
    win.setAlwaysOnTop(true);

    // 透明にする
    win.setOpacity(0.0)
    // 操作できなくする（要らないかも）
    win.webContents.executeJavaScript(
      'document.getElementById("html").classList.add("mr-hidden");'
      + 'document.getElementById("html").classList.remove("mr-show");'
    )
    // 最小化
    win.setSize(1,1)

    // 邪魔しない位置に移動させる
    win.setPosition(0, 0)

    win.blur()

  }

  function enableTomato (){
    // 操作可能にさせる
    win.webContents.executeJavaScript(
      'document.getElementById("html").classList.add("mr-show");'
      + 'document.getElementById("html").classList.remove("mr-hidden");'
    )
    // サイズをもとに戻す
    win.setSize(780,630)

    // ウィンドウ位置を中央へ（将来的には前の位置を覚えさせるか？）
    win.center()

    win.setOpacity(1.0)
  }

  // このイベントは、Electronが初期化処理と
  // browser windowの作成を完了した時に呼び出されます。
  // 一部のAPIはこのイベントが発生した後にのみ利用できます。
  app.commandLine.appendSwitch('disable-renderer-backgrounding');
  app.commandLine.appendSwitch('page-visibility');
  app.commandLine.appendSwitch("disable-background-timer-throttling");
  app.on('ready', createWindow)

  // 全てのウィンドウが閉じられた時に終了する
  app.on('window-all-closed', () => {
    // macOSでは、ユーザが Cmd + Q で明示的に終了するまで、
    // アプリケーションとそのメニューバーは有効なままにするのが一般的。
    powerSaveBlocker.stop(psb);
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // macOSでは、ユーザがドックアイコンをクリックしたとき、
    // そのアプリのウインドウが無かったら再作成するのが一般的。
    if (win === null) {
      createWindow()
    }
  })

  // このファイル内には、
  // 残りのアプリ固有のメインプロセスコードを含めることができます。
  // 別々のファイルに分割してここで require することもできます。
