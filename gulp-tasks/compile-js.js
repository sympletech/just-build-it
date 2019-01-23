const gulp = require("gulp");
const path = require("path");

const {lookupGlob, getBuildPath, findFilesIncluding} = require('../utils/utils');
const {jsCompiler} = require('../compilers/js-compiler');

const config = require('../config');

const buildJsFiles = async ({js_glob, src_path, build_path, minify}) => {
    console.log(`Building Javascript`, src_path, js_glob);
    const jsFiles = await lookupGlob({glob_def: js_glob, src_path});

    for (const sourceJs of jsFiles) {
        const outputName = path.basename(sourceJs);
        const outputDirName = getBuildPath({source_file: sourceJs, src_path, build_path});
        await jsCompiler({sourceJs, outputDirName, outputName, minify});
    }
};

const buildJs = async (builds, minify) => {
    for (const {js_glob, src_path, build_path} of builds) {
        await buildJsFiles({js_glob, src_path, build_path, minify});
    }
};

gulp.task('build-js-dev', async () => await buildJs(config.builds, false));
gulp.task('build-js', async () => await buildJs(config.builds, true));

const watchJs = (builds) => {
    console.log('Watching Javascript Files');
    builds.forEach(({js_glob, src_path, build_path}) => {
        gulp.watch(`${src_path}/**/*.js`, async (evt) => {
            const fileName = evt.path;
            const filesIncluding = await findFilesIncluding({
                fileType: 'js',
                source_file: evt.path,
                src_path,
                glob_def: js_glob
            });

            const buildlist = [fileName, ...filesIncluding].map((entry) =>
                path.resolve(entry)
                    .replace(path.resolve(src_path), '')
                    .replace('\\', '/'));

            await buildJsFiles({js_glob: buildlist, src_path, build_path, minify: false});
        });
    });
};
gulp.task('watch-js', () => watchJs(config.builds));


module.exports = {buildJsFiles, buildJs, watchJs};
