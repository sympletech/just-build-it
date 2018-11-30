const gulp = require("gulp");
const fs = require('fs-extra');

const config = require('../config');

gulp.task('clean-dist', () => {
    console.log('cleaning dist folder.');
    fs.removeSync(config.build_path);
    console.log('dist folder has been cleaned.');
});
