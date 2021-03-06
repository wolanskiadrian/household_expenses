var gulp = require('gulp');
    sass = require('gulp-sass');

gulp.task('default', ['watch']);

gulp.task('build-core', function() {
    return gulp.src('public/assets/css/core.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/assets/css/'));
});

/* watch task sass */
gulp.task('watch', function() {
    gulp.watch('public/**/*.scss', ['build-core']);
});