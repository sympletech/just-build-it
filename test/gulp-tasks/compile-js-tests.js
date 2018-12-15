const expect = require('chai').expect;
const path = require('path');
const fs = require('fs-extra');

const {promisify} = require('util');
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

const {buildJsFiles, buildJs, watchJs} = require('../../gulp-tasks/compile-js');

it('should-buildJsFiles', async () => {
    try {
        const workingDir = `${path.resolve(__dirname, '../../test_src/compile-js/should-buildJsFiles')}`;
        await buildJsFiles({
            js_glob: 'test.js',
            src_path: workingDir,
            build_path: path.resolve(workingDir, './build'),
            minify: false
        });

        const fileStats = await stat(`${workingDir}/build/test.js`);
        expect(fileStats).to.not.be.null;

        await unlink(`${workingDir}/build/test.js`);
    } catch (err) {
        expect(err).to.be(undefined);
    }
});

it('should-buildJs', async () => {
    try {
        const workingDir = `${path.resolve(__dirname, '../../test_src/compile-js/should-buildJs')}`;
        await buildJs([{
            js_glob: 'test.js',
            src_path: workingDir,
            build_path: path.resolve(workingDir, './build')
        }]);

        const fileStats = await stat(`${workingDir}/build/test.js`);
        expect(fileStats).to.not.be.null;

        await unlink(`${workingDir}/build/test.js`);
    } catch (err) {
        expect(err).to.be(undefined);
    }
});
