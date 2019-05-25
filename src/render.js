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

function download() {

  let url = document.getElementById('url').value
  let dir = document.getElementById('dir').value
  dir = dir || __dirname
  ipcRenderer.send('download', url, dir)
}

function showOpenDialog() {
  let selectDir = dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  })
  selectDir = selectDir || ''
  document.getElementById('dir').value = selectDir
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dir').value = os.homedir()
  document.getElementById('download').addEventListener('click', download)
  document.getElementById('showOpenDialog').addEventListener('click', showOpenDialog)
}, false)