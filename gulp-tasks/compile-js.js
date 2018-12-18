const gulp = require("gulp");
const path = require("path");

const {lookupGlob, getBuildPath, findFilesIncluding} = require('../utils/utils');
const {jsCompiler} = require('../compilers/js-compiler');

const config = require('../config');

const buildJsFiles = ({js_glob, src_path, build_path, minify}) => {
    console.log(`Building Javascript`, src_path, js_glob);
    const jsFiles = lookupGlob({glob_def: js_glob, src_path});
    return Promise.all(jsFiles.map((sourceJs) => {
        const outputName = path.basename(sourceJs);
        const outputDirName = getBuildPath({source_file: sourceJs, src_path, build_path});
        return jsCompiler({sourceJs, outputDirName, outputName, minify});
    }));
};

const buildJs = (builds, minify) => Promise.all(
    builds.map(({js_glob, src_path, build_path}) =>
        buildJsFiles({js_glob, src_path, build_path, minify}))
);
gulp.task('build-js-dev', () => buildJs(config.builds, false));
gulp.task('build-js', () => buildJs(config.builds, true));

const watchJs = (builds) => {
    console.log('Watching Javascript Files');
    builds.forEach(({js_glob, src_path, build_path}) => {
        gulp.watch(`${src_path}/**/*.js`, async (evt) => {
            const fileName = evt.path;
            const filesIncluding = await findFilesIncluding({
                source_file: evt.path,
                src_path,
                glob_def: js_glob
            });
            const buildlist = [fileName, ...filesIncluding].map((entry) =>
                path.resolve(entry)
                    .replace(path.resolve(src_path), '')
                    .replace('\\', '/'));

            buildJsFiles({js_glob: buildlist, src_path, build_path, minify: false});
        });
    });
};
gulp.task('watch-js', () => watchJs(config.builds));


module.exports = {buildJsFiles, buildJs, watchJs};
