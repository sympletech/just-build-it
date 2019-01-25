const gulp = require('gulp');

require('require-dir')('./gulp-tasks');

gulp.task('default', gulp.series("clean-dist", "copy-static-files", "watch-static-files", "build-js-dev", "watch-js", "build-scss", "watch-scss", "web-server"));
gulp.task('build', gulp.series("clean-dist", "copy-static-files", "build-js", "build-scss"));
gulp.task('watch', gulp.series("watch-static-files", "watch-js", "watch-scss", "web-server"));
