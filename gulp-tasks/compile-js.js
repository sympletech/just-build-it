const gulp = require("gulp");
const glob = require("glob");
const path = require("path");
const jsCompiler = require('../compilers/js-compiler');

const config = require('../config');

gulp.task('compile-js', () => {
    console.log('Beginning Javascript Compile');
    glob(`${config.src_path}/${config.js_glob}`, (err, jsFiles) => {
        if (!err) {
            jsFiles.forEach((sourceJs) => {
                const outputName = path.basename(sourceJs);
                const outputDirName = path.dirname(sourceJs).replace(config.src_path, config.build_path);
                const saveAs = `${outputDirName}/${outputName}`;

                console.log(`compiling ${sourceJs} to ${saveAs}`);
                jsCompiler({sourceJs, outputDirName, outputName});
            });
        }
    });
});


