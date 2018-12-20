const expect = require('chai').expect;
const path = require('path');
const utils = require('../../utils/utils');

describe('utils', () => {
    it('moveRemove-should-move-!-to-start', () => {
        const globDef = utils.moveRemove('./somepath', '!**/*.txt');
        expect(globDef).to.equal('!./somepath/**/*.txt');
    });

    it('toGlobArray-should-return-single-glob', () => {
        const globArray = utils.toGlobArray({glob_def: 'test.scss', src_path: 'my/path'});
        expect(JSON.stringify(globArray)).to.equal(JSON.stringify(['my/path/test.scss']));
    });

    it('getFileList-should-exclude-files', () => {
        const fileList = utils.getFileList([
            './test_src/utils/getFileList-should-exclude-files/**/*',
            '!./test_src/utils/getFileList-should-exclude-files/**/*.txt'
        ]);
        expect(fileList.length).to.equal(1);
    });

    it('getFileList-should-exclude-files-reverse', () => {
        const fileList = utils.getFileList([
            '!./test_src/utils/getFileList-should-exclude-files/**/*.txt',
            './test_src/utils/getFileList-should-exclude-files/**/*'
        ]);
        expect(fileList.length).to.equal(1);
    });

    it('find-files-including-should-find-files', async () => {
        const workingDir = `${path.resolve(__dirname, '../../test_src/utils/find-files-including-should-find-files')}`;

        const fileList = await utils.findFilesIncluding({
            fileType: 'js',
            source_file: path.resolve(workingDir, './lib.js'),
            src_path: workingDir,
            glob_def: '**/*.js'
        });

        expect(fileList.length).to.equal(1);
    });

    it('find-files-including-should-be-recurisive', async () => {
        const workingDir = `${path.resolve(__dirname, '../../test_src/utils/find-files-including-should-be-recurisive')}`;

        const fileList = await utils.findFilesIncluding({
            fileType: 'js',
            source_file: path.resolve(workingDir, './lib.js'),
            src_path: workingDir,
            glob_def: '**/*.js'
        });

        expect(fileList.length).to.equal(2);
    });    
});

