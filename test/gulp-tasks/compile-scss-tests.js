const expect = require('chai').expect;
const path = require('path');
const fs = require('fs-extra');

const {promisify} = require('util');
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

const {buildScssFiles, buildScss} = require('../../gulp-tasks/compile-scss');

describe('compile-scss', () => {
    it('should-buildScssFiles', async () => {
        try {
            const workingDir = `${path.resolve(__dirname, '../../test_src/gulp-tasks/compile-scss/should-buildScssFiles')}`;
            await buildScssFiles({
                scss_glob: 'test.scss',
                src_path: workingDir,
                build_path: path.resolve(workingDir)
            });
    
            const fileStats = await stat(`${workingDir}/test.css`);
            expect(fileStats).to.not.be.null;
    
            await unlink(`${workingDir}/test.css`);
            await unlink(`${workingDir}/test.css.map`);
        } catch (err) {
            expect(err).to.equal(undefined);
        }
    });
    
    it('should-buildScss', async () => {
        try {
            const workingDir = `${path.resolve(__dirname, '../../test_src/gulp-tasks/compile-scss/should-buildScss')}`;
            await buildScss([{
                scss_glob: 'test.scss',
                src_path: workingDir,
                build_path: path.resolve(workingDir)
            }]);
    
            const fileStats = await stat(`${workingDir}/test.css`);
            expect(fileStats).to.not.be.null;
    
            await unlink(`${workingDir}/test.css`);
        } catch (err) {
            expect(err).to.equal(undefined);
        }
    });
});
