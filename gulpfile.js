const gulp = require('gulp');

require('require-dir')('./gulp-tasks');

gulp.task('default', ["clean-dist", "copy-static-files", "watch-static-files", "compile-js", "watch-js", "compile-scss", "watch-scss", "web-server"], () => { });
gulp.task('build', ["clean-dist", "copy-static-files", "compile-js", "compile-scss"], () => { });
gulp.task('watch', ["watch-static-files", "watch-js", "watch-scss", "web-server"], () => { });
