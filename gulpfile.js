const gulp = require('gulp');

require('require-dir')('./gulp-tasks');

gulp.task('default', ["clean-dist", "compile-js", "watch-js"], () => { });
gulp.task('build', ["clean-dist", "compile-js"], () => { });
