const gulp = require("gulp");
const fs = require('fs-extra');

const config = require('../config');

const cleanDist = (builds) => new Promise((resolve) => {
    console.log('cleaning dist folders.');
    builds.forEach((buildConfig) => {
        fs.removeSync(buildConfig.build_path);
    });
    console.log('dist folders have been cleaned.');
    resolve();
});

gulp.task('clean-dist', () => {
    cleanDist(config.builds);
});

module.exports = {cleanDist};
