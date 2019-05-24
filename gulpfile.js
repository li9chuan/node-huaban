const {
  src,
  dest,
  series,
  parallel
} = require('gulp')

const del = require('del')
const argv = require('yargs').argv
const zip = require('gulp-zip')
const os = require('os')

const packager = require('electron-packager')

function clean(next) {
  del.sync('dist')
  next()
}


function archive() {
  let platform = argv.platform || os.platform()
  let arch = argv.arch || os.arch()
  let name = `huaban-${platform}-${arch}`
  return src(`dist/${name}/**/*`)
    .pipe(zip(`${name}.zip`))
    .pipe(dest('dist'))
}

function pack(next) {

  let options = {
    dir: './lib',
    name: 'huaban',
    out: './dist',
    // asar: true,
    platform: argv.platform || os.platform(),
    arch: argv.arch || os.arch(),
    overwrite: true
  }

  packager(options)
    .then(appPaths => {
      next()
    })
}

exports.pack = series(clean, pack, archive)