const webpack = require("webpack");
const path = require('path');

function jsCompiler({sourceJs, outputDirName, outputName, minify}) {
    webpack({
        entry: sourceJs,
        output: {
            path: path.resolve(outputDirName),
            filename: outputName
        },
        mode: minify ? 'production' : 'development',
        devtool: minify ? '' : 'eval-source-map',
        module: {
            rules: [
                {
                    test: /js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        }

    }, (err, stats) => {
        if (err || stats.hasErrors()) {
            console.log('***********************');
            console.log(`ERROR COMPILING ${sourceJs}`);
            console.log(stats);
            console.log('***********************');
        }
    });
}

module.exports = jsCompiler;
