const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');
const jsCompiler = require('../../compilers/js-compiler');

it('should-build-a-basic-js-file', async (done) => {
    const workingDir = `${path.resolve(__dirname, './should-build-a-basic-js-file')}`;
    await jsCompiler({
        sourceJs: `${workingDir}/**/*.js`,
        outputDirName: `${workingDir}/**/build`,
        outputName: 'build.js',
        minify: false
    });

    const fileExists = await fs.exists(`${workingDir}/build/build.js`);
    expect(fileExists).to.be(true);
    done();
});
