const webpack = require("webpack");
const path = require('path');

function jsCompiler({sourceJs, outputDirName, outputName, minify}) {
    process.env.NODE_ENV = minify ? 'production' : 'development';
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
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', 'react-app']
                        }
                    }
                }
            ]
        }

    }, (err, stats) => {
        if (err || stats.hasErrors()) {
            console.log('***********************');
            console.log(`ERROR COMPILING ${sourceJs}`);
            console.log(stats.compilation.errors);
            console.log('***********************');
        }
    });
}

module.exports = jsCompiler;
