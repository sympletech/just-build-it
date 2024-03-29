const webpack = require('webpack');
const path = require('path');
const babel = require('@babel/core');
const fs = require('fs-extra');

const { promisify } = require('util');
const unlink = promisify(fs.unlink);

async function jsCompiler({ sourceJs, sourcePath, outputDirName, outputName, minify }) {
    try {
        await compileWithWebpack({ sourceJs, outputDirName, outputName, minify });
    } catch (err) {
        try {
            await unlink(path.resolve(outputDirName, `./${outputName}`));
            await compileWithBabel({ sourceJs, sourcePath, outputDirName, outputName });
        } catch (err) {
            try {
                await unlink(path.resolve(outputDirName, `./${outputName}`));
                await copyFileAsIsToDest({ sourceJs, sourcePath, outputDirName });
            } catch (err) {
                console.error(`Unable to Compile ${sourceJs}`);
            }
        }
    }
}

function compileWithWebpack({ sourceJs, outputDirName, outputName, minify }) {
    return new Promise((resolve, reject) => {
        process.env.NODE_ENV = minify ? 'production' : 'development';

        webpack({
            entry: sourceJs,
            output: {
                path: path.resolve(outputDirName),
                filename: outputName
            },
            mode: minify ? 'production' : 'development',
            devtool: minify ? undefined : 'eval-source-map',
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                plugins: [
                                    ["@babel/plugin-proposal-private-methods", { "loose": true }],
                                    ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
                                    ["@babel/plugin-proposal-class-properties", { "loose": true }]
                                ],
                                presets: [
                                    [
                                        '@babel/preset-env',
                                        {
                                            "targets": {
                                                "browsers": [
                                                    ">0.25%",
                                                    "not ie 11",
                                                    "not op_mini all"
                                                ]
                                            }
                                        }
                                    ],
                                    'react-app'
                                ]
                            }
                        }
                    },
                    {
                        test: /\.m?js$/,
                        include: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                plugins: [
                                    ["@babel/plugin-proposal-private-methods", { "loose": true }],
                                    ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
                                    ["@babel/plugin-proposal-class-properties", { "loose": true }]
                                ],
                                presets: [
                                    [
                                        '@babel/preset-env',
                                        {
                                            "targets": {
                                                "browsers": ["last 2 versions"]
                                            }
                                        }
                                    ]
                                ]
                            }
                        }
                    }
                ]
            }
        }, (err, stats) => {
            if (err || stats.hasErrors()) {
                console.log('***********************');
                console.log(`ERROR WEBPACKING ${sourceJs} - Trying Babel`);
                const errors = stats?.compilation?.errors || [];
                console.log(errors.map((err) => err.message).join('\n'));
                console.log('***********************');
                reject(errors);
            } else {
                resolve(stats);
            }
        });
    });
}

function compileWithBabel({ sourceJs, sourcePath, outputDirName, outputName }) {
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

function copyFileAsIsToDest({ sourceJs, sourcePath, outputDirName }) {
    const savePath = path.resolve(sourceJs).replace(path.resolve(sourcePath), '');
    const destFile = `${path.resolve(outputDirName)}${savePath}`;
    return fs.copy(sourceJs, destFile);
}

module.exports = { jsCompiler, compileWithWebpack, compileWithBabel, copyFileAsIsToDest };
