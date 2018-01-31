var gulp = require('gulp');
var minifyjs = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
gulp.task('minify-js', function() {
    return gulp.src('src/*.js')
      .pipe(minifyjs({
          ext:{
              src:'-debug.js',
              min:'-min.js'
          },
          exclude: ['tasks'],
          ignoreFiles: ['.combo.js', '-min.js']
      }))
      .pipe(gulp.dest('dist'))
  });

gulp.task('minify-css', () => {
return gulp.src('src/*.css')
    .pipe(autoprefixer({
        browsers: [
            'last 2 versions',
            'ie 8',
            'ie 9', 
            'android 2.3',
            'android 4',
            'opera 12'
           ],
        cascade: false
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});