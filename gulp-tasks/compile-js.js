const gulp = require("gulp");
const glob = require("glob-all");
const path = require("path");

const {toGlobArray} = require('../utils/utils');
const {jsCompiler} = require('../compilers/js-compiler');

const config = require('../config');

const buildJsFiles = ({js_glob, src_path, build_path, minify}) => {
    console.log(`Building Javascript ${(new Date()).toTimeString()}`);
    const jsGlobArray = toGlobArray({glob_def: js_glob, src_path});
    const jsFiles = glob.sync(jsGlobArray);
    const buildPromises = jsFiles.map((sourceJs) => {
        const outputName = path.basename(sourceJs);
        return jsCompiler({sourceJs, outputDirName: path.resolve(build_path), outputName, minify});
    });
    return Promise.all(buildPromises);
};

const buildJs = (builds) => Promise.all(
    builds.map(({js_glob, src_path, build_path}) =>
        buildJsFiles({js_glob, src_path, build_path, minify: true}))
);
gulp.task('build-js', () => buildJs(config.builds));

const watchJs = (builds) => {
    console.log('Watching Javascript Files');
    builds.forEach(({js_glob, src_path, build_path}) => {
        gulp.watch(`${src_path}/**/*.js`, () => {
            buildJsFiles({js_glob, src_path, build_path, minify: false});
        });
    });
};
gulp.task('watch-js', () => watchJs(config.builds));


module.exports = {buildJsFiles, buildJs, watchJs};
