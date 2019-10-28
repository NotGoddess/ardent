/*eslint strict: ["error", "global"]*/
'use strict';

// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sass = require('gulp-sass');
//  const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
//const concat = require('gulp-concat');
// For live browser refreshes
var sync       = require('browser-sync').create();


const options = {
  'sync': {
    'proxy': 'local.notgoddess.com',
    'port': '80'

  },
  'js': {
    src: 'js/{,**/}*.js',
    dest: '../js',
    watch: 'js/{,**/}*.js',
    compile: {

    }
  },
  'scss': {
      src: 'scss/{,**/}*.scss',
      dest: '../css/',
      watch: 'scss/{,**/}*.scss',
      compile: {
        dev: {
          outputStyle: 'nested',
          precison: 3,
          errLogToConsole: true,
          includePaths: []
        },
        prod: {
          outputStyle: 'compressed',
          precison: 3,
          errLogToConsole: true,
          includePaths: []
        }
      }
    }
  };

// Sass task: compiles the style.scss file into style.css
function scssTask(){
    return src(options.scss.src)
//        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass(options.scss.compile.dev)) // compile SCSS to CSS
//        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
//        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest(options.scss.dest)
    ); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask(){
    return src([
        options.js.src
        //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
        ])
        .pipe(concat('all.js'))
//        .pipe(uglify())
        .pipe(dest(options.js.dest)
    );
}


function browserTask() {
  sync.init({
    proxy: options.sync,
    files: [options.scss.src, options.js.src]
  });
}
// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    watch([options.scss.src, options.js.src],
        parallel(scssTask, jsTask));
}

exports.default = series(
  browserTask,
  parallel(scssTask, jsTask),
  watchTask
);
