const gulp = require("gulp");
const glob = require("glob-all");
const path = require("path");
const jsCompiler = require('../compilers/js-compiler');

const config = require('../config');

gulp.task('build-js', () => {
    config.builds.forEach(({js_glob, src_path, build_path}) => {
        const jsGlob = toGlobArray({js_glob, src_path});
        buildJsFiles({jsGlob, src_path, build_path, minify: true});
    });
});


function toGlobArray({js_glob, src_path}) {
    let jsGlob;
    if (Array.isArray(js_glob)) {
        jsGlob = js_glob.map((jGlob) => (moveRemove(src_path, jGlob)));
    } else {
        jsGlob = moveRemove(src_path, js_glob);
    }
    return jsGlob;
}

function moveRemove(path, globDef) {
    let globResult = "";
    if (globDef.indexOf('!') > -1) {
        globResult = `!${path}/${globDef.replace('!', '')}`;
    } else {
        globResult = `${path}/${globDef}`;
    }
    return globResult;
}

gulp.task('watch-js', () => {
    console.log('Watching Javascript Files');
    config.builds.forEach((buildConfig) => {
        gulp.watch(`${buildConfig.src_path}/**/*.js`, () => {
            const jsGlob = `${buildConfig.src_path}/${buildConfig.js_glob}`;
            buildJsFiles({jsGlob, src_path: buildConfig.src_path, build_path: buildConfig.build_path, minify: false});
        });
    });
});

function buildJsFiles({js_glob, src_path, build_path, minify}) {
    console.log(`Building Javascript ${(new Date()).toTimeString()}`);
    const jsGlobArray = toGlobArray({js_glob, src_path});
    const jsFiles = glob.sync(jsGlobArray);
    jsFiles.forEach((sourceJs) => {
        const outputName = path.basename(sourceJs);
        const outputDirName = path.dirname(sourceJs).replace(src_path, build_path);
        jsCompiler({sourceJs, outputDirName, outputName, minify});
    });
}
