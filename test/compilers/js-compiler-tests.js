const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');

const {promisify} = require('util');
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

const {jsCompiler, compileWithBabel} = require('../../compilers/js-compiler');

it('should-build-a-basic-js-file', async () => {
    try {
        const workingDir = `${path.resolve(__dirname, '../../test_src/js-compiler/should-build-a-basic-js-file')}`;
        await jsCompiler({
            sourceJs: path.resolve(workingDir, './test.js'),
            outputDirName: workingDir,
            outputName: 'build.js',
            minify: false
        });

        const fileStats = await stat(`${workingDir}/build.js`);
        expect(fileStats).to.not.be.null;

        await unlink(`${workingDir}/build.js`);
    } catch (err) {
        expect(err).to.equal(undefined);
    }
});



it('should-compile-with-babel', async () => {
    try {
        const workingDir = `${path.resolve(__dirname, '../../test_src/js-compiler/should-compile-with-babel')}`;
        await compileWithBabel({
            sourceJs: path.resolve(workingDir, './test.js'), 
            sourcePath: workingDir, 
            outputDirName: path.resolve(workingDir, './build'),
            outputName: 'test.js'
        });

        const fileStats = await stat(`${workingDir}/build/test.js`);
        expect(fileStats).to.not.be.null;

        await unlink(`${workingDir}/build/test.js`);
    } catch (err) {
        expect(err).to.equal(undefined);
    }
});


it('should-just-babel-problem-files', async () => {
    try {
        const workingDir = `${path.resolve(__dirname, '../../test_src/js-compiler/should-just-babel-problem-files')}`;
        await jsCompiler({
            sourceJs: `${workingDir}/test.js`,
            sourcePath: workingDir,
            outputDirName: `${workingDir}/build`,
            outputName: 'test.js',
            minify: false
        });

        const fileStats = await stat(`${workingDir}/build/test.js`);
        expect(fileStats).to.not.be.null;

        await unlink(`${workingDir}/build/test.js`);
    } catch (err) {
        expect(err).to.equal(undefined);
    }
});
