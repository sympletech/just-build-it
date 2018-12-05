const gulp = require("gulp");
const glob = require("glob");
const path = require("path");
const jsCompiler = require('../compilers/js-compiler');

const config = require('../config');

gulp.task('compile-js', () => {
    config.builds.forEach((buildConfig) => {
        const jsGlob = `${buildConfig.src_path}/${buildConfig.js_glob}`;
        buildJsFiles({jsGlob, src_path: buildConfig.src_path, build_path: buildConfig.build_path});
    });
});

gulp.task('watch-js', () => {
    console.log('Watching Javascript Files');
    config.builds.forEach((buildConfig) => {
        gulp.watch(`${buildConfig.src_path}/**/*.js`, () => {
            const jsGlob = `${buildConfig.src_path}/${buildConfig.js_glob}`;
            buildJsFiles({jsGlob, src_path: buildConfig.src_path, build_path: buildConfig.build_path});
        });
    });
});

function buildJsFiles({jsGlob, src_path, build_path}) {
    console.log('Beginning Javascript Compile');
    glob(jsGlob, (err, jsFiles) => {
        if (!err) {
            jsFiles.forEach((sourceJs) => {
                const outputName = path.basename(sourceJs);
                const outputDirName = path.dirname(sourceJs).replace(src_path, build_path);

                console.log(`compiling ${sourceJs} to ${outputDirName}/${outputName}`);
                jsCompiler({sourceJs, outputDirName, outputName});
            });
        }
    });
}
