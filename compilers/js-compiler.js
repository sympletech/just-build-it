const webpack = require('webpack');
const path = require('path');
const babel = require('@babel/core');
const fs = require('fs-extra');

const {promisify} = require('util');
const unlink = promisify(fs.unlink);

async function jsCompiler({sourceJs, sourcePath, outputDirName, outputName, minify}) {
    try {
        await compileWithWebpack({sourceJs, outputDirName, outputName, minify});
    } catch (err) {
        try {
            await unlink(path.resolve(outputDirName, `./${outputName}`));
            await compileWithBabel({sourceJs, sourcePath, outputDirName, outputName});
        } catch (err) {
            console.error(`Unable to Compile ${sourceJs}`);
        }
    }
}

function compileWithWebpack({sourceJs, outputDirName, outputName, minify}) {
    return new Promise((resolve, reject) => {
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
                console.log(`ERROR WEBPACKING ${sourceJs} - Tring Babel`);
                console.log(stats.compilation.errors.map((err) => err.message).join('\n'));
                console.log('***********************');
                reject(stats.compilation.errors);
            } else {
                resolve(stats);
            }
        });
    });
}

function compileWithBabel({sourceJs, sourcePath, outputDirName, outputName}) {
    return new Promise(async (resolve, reject) => {
        babel.transformFile(sourceJs, {
            cwd: sourcePath,
            filename: outputName,
            presets: ['@babel/preset-env']
        }, async (err, result) => {
            if (err) {
                reject(err);
            }

            const saveAs = path.resolve(outputDirName, `./${outputName}`);
            await fs.ensureFile(saveAs);
            fs.writeFile(saveAs, result.code, 'utf8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

module.exports = {jsCompiler, compileWithWebpack, compileWithBabel};
