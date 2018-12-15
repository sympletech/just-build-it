const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');

const {promisify} = require('util');
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

const jsCompiler = require('../../compilers/js-compiler');

it('should-build-a-basic-js-file', async () => {
    try {
        const workingDir = `${path.resolve(__dirname, '../../test_src/js-compiler/should-build-a-basic-js-file')}`;
        await jsCompiler({
            sourceJs: `${workingDir}/test.js`,
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
