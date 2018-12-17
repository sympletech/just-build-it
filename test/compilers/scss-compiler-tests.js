const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');

const {promisify} = require('util');
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

const {scssCompiler} = require('../../compilers/scss-compiler');

it('should-build-a-basic-scss-file', async () => {
    try {
        const workingDir = `${path.resolve(__dirname, '../../test_src/scss-compiler/should-build-a-basic-scss-file')}`;
        await scssCompiler(
            {
                sourceFolder: `${workingDir}`,
                sourceFile: `test.scss`,
                destFolder: `${workingDir}`
            });

        const fileStats = await stat(`${workingDir}/test.css`);
        expect(fileStats).to.not.be.null;

        await unlink(`${workingDir}/test.css`);
        await unlink(`${workingDir}/test.css.map`);
    } catch (err) {
        expect(err).to.equal(undefined);
    }
});
