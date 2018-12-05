const gulp = require("gulp");
const fs = require('fs-extra');

const config = require('../config');

gulp.task('clean-dist', () => {
    console.log('cleaning dist folders.');
    config.builds.forEach((buildConfig) => {
        fs.removeSync(buildConfig.build_path);
    });
    console.log('dist folders have been cleaned.');
});
