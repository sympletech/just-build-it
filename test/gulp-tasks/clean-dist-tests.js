const expect = require('chai').expect;
const path = require('path');
const fs = require('fs-extra');

const {promisify} = require('util');
const stat = promisify(fs.stat);

const {cleanDist} = require('../../gulp-tasks/clean-dist');

it('should-clean-dist', async () => {
    try {
        const workingDir = `${path.resolve(__dirname, '../../test_src/clean-dist/should-clean-dist')}`;
        const testFile = `${path.resolve(workingDir, './test.txt')}`;
        await fs.ensureFile(testFile);
        await cleanDist([{"build_path": workingDir}]);

        try {
            await stat(testFile);
            expect.fail("File was not deleted");
        } catch (err) {
            expect(true).to.be.true;
        }
    } catch (err) {
        expect(err).to.equal(undefined);
    }
});
