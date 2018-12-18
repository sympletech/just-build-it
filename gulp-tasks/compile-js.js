const gulp = require("gulp");
const path = require("path");

const {lookupGlob, getBuildPath} = require('../utils/utils');
const {jsCompiler} = require('../compilers/js-compiler');

const config = require('../config');

const buildJsFiles = ({js_glob, src_path, build_path, minify}) => {
    console.log(`Building Javascript ${(new Date()).toTimeString()}`);
    const jsFiles = lookupGlob({glob_def: js_glob, src_path});
    return Promise.all(jsFiles.map((sourceJs) => {
        const outputName = path.basename(sourceJs);
        const outputDirName = getBuildPath({source_file: sourceJs, src_path, build_path});
        return jsCompiler({sourceJs, outputDirName, outputName, minify});
    }));
};

const buildJs = (builds) => Promise.all(
    builds.map(({js_glob, src_path, build_path}) =>
        buildJsFiles({js_glob, src_path, build_path, minify: true}))
);
gulp.task('build-js', () => buildJs(config.builds));

const watchJs = (builds) => {
    console.log('Watching Javascript Files');
    builds.forEach(({js_glob, src_path, build_path}) => {
        gulp.watch(`${src_path}/**/*.js`, (evt) => {
            const fileName = evt.path;

            buildJsFiles({js_glob, src_path, build_path, minify: false});
        });
    });
};
gulp.task('watch-js', () => watchJs(config.builds));


module.exports = {buildJsFiles, buildJs, watchJs};
