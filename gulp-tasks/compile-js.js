const gulp = require("gulp");
const glob = require("glob");
const path = require("path");
const jsCompiler = require('../compilers/js-compiler');

const config = require('../config');

gulp.task('build-js', () => {
    config.builds.forEach((buildConfig) => {
        const jsGlob = `${buildConfig.src_path}/${buildConfig.js_glob}`;
        buildJsFiles({jsGlob, src_path: buildConfig.src_path, build_path: buildConfig.build_path, minify: true});
    });
});

gulp.task('watch-js', () => {
    console.log('Watching Javascript Files');
    config.builds.forEach((buildConfig) => {
        gulp.watch(`${buildConfig.src_path}/**/*.js`, () => {
            const jsGlob = `${buildConfig.src_path}/${buildConfig.js_glob}`;
            buildJsFiles({jsGlob, src_path: buildConfig.src_path, build_path: buildConfig.build_path, minify: false});
        });
    });
});

function buildJsFiles({jsGlob, src_path, build_path, minify}) {
    console.log(`Building Javascript ${(new Date()).toTimeString()}`);
    glob(jsGlob, (err, jsFiles) => {
        if (!err) {
            jsFiles.forEach((sourceJs) => {
                const outputName = path.basename(sourceJs);
                const outputDirName = path.dirname(sourceJs).replace(src_path, build_path);
                jsCompiler({sourceJs, outputDirName, outputName, minify});
            });
        }
    });
}
