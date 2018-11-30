const gulp = require('gulp');

require('require-dir')('./gulp-tasks');

gulp.task('default', ["clean-dist"], () => {});
gulp.task('build', ["clean-dist"], () => {});
