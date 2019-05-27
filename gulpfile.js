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
const pkg = require('./package.json')

const packager = require('electron-packager')

function archive() {
  let platform = argv.platform || os.platform()
  let arch = argv.arch || os.arch()
  let name = `${pkg.name}-${platform}-${arch}`
  return src(`dist/${name}/**/*`)
    .pipe(zip(`${name}.zip`))
    .pipe(dest('dist'))
}

function pack(next) {

  let options = {
    dir: './',
    name: pkg.name,
    out: './dist',
    asar: true,
    platform: argv.platform || os.platform(),
    arch: argv.arch || os.arch(),
    // ignore: ['dist/', 'bin/', 'README.md'],
    overwrite: true
  }

  packager(options)
    .then(appPaths => {
      next()
    })
}

exports.pack = series(pack, archive)