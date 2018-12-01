const gulp = require('gulp');

require('require-dir')('./gulp-tasks');

gulp.task('default', ["clean-dist", "compile-js", "watch-js", "compile-scss", "watch-scss"], () => { });
gulp.task('build', ["clean-dist", "compile-js", "compile-scss"], () => { });
