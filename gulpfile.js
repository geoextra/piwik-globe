var gulp = require('gulp');
var gutil = require('gulp-util');
var changed = require('gulp-changed');
var clean = require('gulp-clean');
var jade = require('gulp-jade');
var bower = require('gulp-bower');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('default', ['build', 'watch', 'serve']);

gulp.task('ci', ['build', 'bower']);

gulp.task('build', function() {
  gutil.log(gutil.colors.cyan('Building Jade files...'));
  var jadeSrc = './src/*.jade',
      jadeDest = './app/';
  gulp.src(jadeSrc)
    .pipe(changed(jadeDest))
    .pipe(jade({pretty: true}).on('error', gutil.log))
    .pipe(gulp.dest(jadeDest));
  
  gutil.log(gutil.colors.cyan('Copying files...'));
  var filesSrc = ['./src/**', '!./src/**.jade'],
      filesDest = './app/';
  gulp.src(filesSrc)
    .pipe(changed(filesDest))
    .pipe(gulp.dest(filesDest));
});

gulp.task('clean', function() {
  gutil.log(gutil.colors.cyan('Cleanup...'));
  gulp.src('./app/')
    .pipe(clean().on('error', gutil.log));
});

gulp.task('watch', function() {
  gulp.watch('./src/**', ['build']);
});

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });
  
  gulp.watch('./app/**', reload);
});

gulp.task('bower', function() {
  gutil.log(gutil.colors.cyan('Updating Bower stuff...'));
  bower({cmd: 'update'});
});