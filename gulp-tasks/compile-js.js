const gulp = require("gulp");
const glob = require("glob");
const path = require("path");
const jsCompiler = require('../compilers/js-compiler');

const config = require('../config');
const jsGlob = `${config.src_path}/${config.js_glob}`;

gulp.task('compile-js', () => {
    buildJsFiles();
});

gulp.task('watch-js', () => {
    console.log('Watching Javascript Files');
    gulp.watch(`${config.src_path}/**/*.js`, () => {
        buildJsFiles();
    });
});

function buildJsFiles() {
    console.log('Beginning Javascript Compile');
    glob(jsGlob, (err, jsFiles) => {
        if (!err) {
            jsFiles.forEach((sourceJs) => {
                const outputName = path.basename(sourceJs);
                const outputDirName = path.dirname(sourceJs).replace(config.src_path, config.build_path);

                console.log(`compiling ${sourceJs} to ${outputDirName}/${outputName}`);
                jsCompiler({sourceJs, outputDirName, outputName});
            });
        }
    });
}
