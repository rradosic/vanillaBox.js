
var gulp = require('gulp');
var minifyjs = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');

gulp.task('minify-js', function() {
    return gulp.src('src/*.js')
      .pipe(minifyjs({
          ext:{
              src:'-debug.js',
              min:'.min.js'
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
    .pipe(rename({suffix:".min"}))
    .pipe(gulp.dest('dist'));
});

gulp.task('demo-js', function() {
    return gulp.src('dist/*min.js')
      .pipe(gulp.dest('demo/js'))
  });

gulp.task('demo-css', () => {
return gulp.src('dist/*min.css')
   
    .pipe(gulp.dest('demo/css'));
});

gulp.task('dist', gulp.parallel('minify-css', 'minify-js'));

gulp.task('demo', gulp.parallel('demo-css', 'demo-js'));

gulp.task('build', gulp.series('dist', 'demo'));




