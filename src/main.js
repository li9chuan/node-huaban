const electron = require('electron')
const HuabanBoard = require('./huaban')
const log = require('electron-log')
const path = require('path')

const {
  app,
  globalShortcut,
  dialog,
  ipcMain,
  BrowserWindow
} = electron

app.commandLine.appendSwitch('--ignore-gpu-blacklist')
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')


let _mainWindow

// Menu.setApplicationMenu(null)

function ready() {

  _mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    width:1024,
    height:768,
    show: false,
    icon: path.join(__dirname, 'logo.jpeg'),
    webPreferences: {
      devTools: true,
      allowRunningInsecureContent: true, // 允许一个 https 页面运行 http url 里的资源，包括 JavaScript, CSS 或 plugins.
      webSecurity: false,
      nodeIntegration: true
    }
  })

  _mainWindow.once('ready-to-show', () => {
    _mainWindow.show()
  })

  globalShortcut.register('ESC', () => {
    dialog.showMessageBox(_mainWindow, {
      type: 'question',
      buttons: ['ok', 'cancel'],
      title: '确认',
      message: '确认关闭窗口?'
    }, (button, checked) => {
      if (button === 0) {
        _mainWindow.close()
      }
    })
  })

  _mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  // _mainWindow.webContents.openDevTools()

  _mainWindow.on('closed', function () {
    _mainWindow = null
  })

}

app.on('ready', ready)

app.on('window-all-closed', function () {
  app.quit()
})


let maxTimes = 5
let timeout = 60 * 1000 //ms 
let concurrency = 10

ipcMain.on('download', (event, url, dest) => {
  download(url, dest)
})

async function download(url, dest) {

  const start = Date.now()

  // download
  const board = new HuabanBoard(url, dest)
  board.on('log', log => {
    _mainWindow.webContents.send('log', log);
  })

  await board.init()
  // title & name
  _mainWindow.webContents.send('log', `花瓣画板: [${board.title}], 共 ${board.pins.length} 张图片`);
  log.info(`花瓣画板: [${board.title}], 共 ${board.pins.length} 张图片`)
  await board.downloadBoard(concurrency, timeout, maxTimes)

  // end
  const end = Date.now()
  _mainWindow.webContents.send('log', `下载完毕 耗时 ${(end - start) / 1000} 秒`);
  log.info('下载完毕 耗时 %s 秒', (end - start) / 1000)
}