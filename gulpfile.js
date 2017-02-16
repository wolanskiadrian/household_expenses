var gulp = require('gulp');
    sass = require('gulp-sass');

gulp.task('default', ['watch']);

gulp.task('build-css', function() {
    return gulp.src('public/css/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css/'));
});

/* watch task sass */
gulp.task('watch', function() {
    gulp.watch('public/css/**/*.scss', ['build-css']);
});