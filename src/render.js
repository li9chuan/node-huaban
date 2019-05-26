const {
  ipcRenderer,
  remote
} = require('electron')

const os = require('os')

const {
  dialog
} = remote

const path = require('path')
const url = require('url')

let $log = null;

function download() {
  let url = document.getElementById('url').value
  let dir = document.getElementById('dir').value
  dir = dir || __dirname
  ipcRenderer.send('download', url, dir)
}

ipcRenderer.on('log', (event, msg) => {
  // console.log('log', msg)
  var $el = document.createElement("li");
  $el.class = 'log'
  $el.innerText = msg
  $log.appendChild($el)

  $log.scrollTop = $log.scrollHeight;

})

function showOpenDialog() {
  let selectDir = dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  })

  if (selectDir) {
    document.getElementById('dir').value = selectDir
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dir').value = os.homedir()
  $log = document.getElementById('messages')
  document.getElementById('download').addEventListener('click', download)
  document.getElementById('showOpenDialog').addEventListener('click', showOpenDialog)
}, false)