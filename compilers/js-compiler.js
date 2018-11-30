const gulp = require("gulp");
const rollup_stream = require('rollup-stream');
const rollup_plugin_json = require('rollup-plugin-json');
const rollup_plugin_node_resolve = require('rollup-plugin-node-resolve');
const rollup_plugin_commonjs = require('rollup-plugin-commonjs');
const rollup_plugin_babel = require('rollup-plugin-babel');
const babel_preset_env = require('@babel/preset-env');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');

function jsCompiler({sourceJs, outputDirName, outputName}) {
    rollup_stream({
        input: sourceJs,
        format: 'umd',
        name: 'myApp',
        sourcemap: true,
        plugins: [
            rollup_plugin_json(),
            rollup_plugin_node_resolve(),
            rollup_plugin_commonjs({
                include: 'node_modules/**'
            }),
            rollup_plugin_babel({
                babelrc: false,
                plugins: [],
                presets: [
                    [babel_preset_env, {
                        modules: false,
                        targets: {
                            "browsers": ['last 2 versions', 'Safari >6', 'IE > 10']
                        }
                    }]
                ]
            })
        ]
    })
        .pipe(
            source(sourceJs)
        )
        .pipe(
            buffer()
        )
        .pipe(
            sourcemaps.init({
                loadMaps: true
            })
        )
        .pipe(
            rename(outputName)
        )
        .pipe(
            sourcemaps.write('.')
        )
        .pipe(
            gulp.dest(outputDirName)
        );
}

module.exports = jsCompiler;
