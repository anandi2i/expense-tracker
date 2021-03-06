var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
    gulp.src('public/**/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        //.pipe(gulp.dest('public/**/sass/**/*/css/'))
        .pipe(gulp.dest(function(file) {
          return file.base;
        }))
        .on('error', function(err) {
          console.log("Gulp compilation error", err)
        });
});

//Watch changes
gulp.task('default',function() {
    gulp.watch('public/**/sass/**/*.scss', ['sass']);
});
