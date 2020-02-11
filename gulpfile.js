const { src, dest, series } = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const Terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const size = require('gulp-filesize');
const data = require('gulp-data');
const fm = require('front-matter');
const swig = require('gulp-swig');
const browserSync = require('browser-sync').create();
const jsdoc = require('gulp-jsdoc3');

const template = function (content) {
  return `(function (root) {
  'use strict';
  ${content}
  
  // EXPORTING
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = Schema;
    }
    exports.Schema = Schema;
  } else {
    root.Schema = Schema;
  }
}(this));`
};

const build = () => {
  return src([
    './src/utils.js',
    './src/constructor.js',
    './src/methods/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('schema.js'))
    .pipe(data(function(file) {
      const content = fm(String(file._contents));
      file._contents = template(Buffer.from(content.body));
      return file._contents;
    }))
    .pipe(swig())
    .pipe(rename('schema.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('./dist'))
    .pipe(size());
};

const min = () => {
  return src('./dist/schema.js')
    .pipe(rename('schema.min.js'))
    .pipe(sourcemaps.init())
    .pipe(Terser({ output: { comments: false } }))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('./dist'))
    .pipe(size());
};

const serve = () => {
  browserSync.init({
    server: {
      baseDir: './',
      directory: true
    }
  });
};

const doc = () => {
  return src([
    './src/utils.js',
    './src/constructor.js',
    './src/methods/*.js'
    ])
    .pipe(jsdoc({
      "opts": {
        "destination": "./docs"
      }
    }))
};

const dist = () => {
  return new Promise((resolve, reject) => {
    fs.mkdir('./dist', { recursive: true }, err => {
      if (err) reject(err);
      resolve()
    });
  });
};

exports.build = series(dist, build);
exports.min = series(dist, min);
exports.serve = serve;
exports.deploy = series(dist, build, min);
exports.doc = doc;