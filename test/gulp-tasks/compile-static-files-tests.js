const expect = require('chai').expect;
const path = require('path');
const fs = require('fs-extra');

const {promisify} = require('util');
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

const {copyStaticFiles, copyStaticFilesTask} = require('../../gulp-tasks/copy-static-files');

it('should-copyStaticFiles', async () => {
    try {
        const workingDir = `${path.resolve(__dirname, '../../test_src/compile-static-files/should-copyStaticFiles')}`;
        await copyStaticFiles({
            static_files_glob: 'test.html',
            src_path: workingDir,
            build_path: path.resolve(workingDir, './build')
        });

        const fileStats = await stat(`${workingDir}/build/test.html`);
        expect(fileStats).to.not.be.null;

        await unlink(`${workingDir}/build/test.html`);
    } catch (err) {
        expect(err).to.equal(undefined);
    }
});

it('should-copyStaticFilesTask', async () => {
    try {
        const workingDir = `${path.resolve(__dirname, '../../test_src/compile-static-files/copyStaticFilesTask')}`;
        await copyStaticFilesTask([{
            static_files_glob: 'test.html',
            src_path: workingDir,
            build_path: path.resolve(workingDir, './build')
        }]);

        const fileStats = await stat(`${workingDir}/build/test.html`);
        expect(fileStats).to.not.be.null;

        await unlink(`${workingDir}//build/test.html`);
    } catch (err) {
        expect(err).to.equal(undefined);
    }
});
