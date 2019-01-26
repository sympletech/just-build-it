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

    it('getFileList-should-exclude-files', async () => {
        const fileList = await utils.getFileList([
            './test_src/utils/getFileList-should-exclude-files/**/*',
            '!./test_src/utils/getFileList-should-exclude-files/**/*.txt'
        ]);
        expect(fileList.length).to.equal(1);
    });

    it('getFileList-should-exclude-files-reverse', async () => {
        const fileList = await utils.getFileList([
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

    it('find-files-including-should-not-cause-an-infinate-loop', async () => {
        const workingDir = `${path.resolve(__dirname, '../../test_src/utils/find-files-including-should-not-cause-an-infinate-loop')}`;

        const fileList = await utils.findFilesIncluding({
            fileType: 'js',
            source_file: path.resolve(workingDir, './lib.js'),
            src_path: workingDir,
            glob_def: '**/*.js'
        });

        expect(fileList.length).to.equal(2);
    });

    it('find-files-including-should-work-for-scss-too', async () => {
        const workingDir = `${path.resolve(__dirname, '../../test_src/utils/find-files-including-should-work-for-scss-too')}`;

        const fileList = await utils.findFilesIncluding({
            fileType: 'scss',
            source_file: path.resolve(workingDir, './_module.scss'),
            src_path: workingDir,
            glob_def: '**/*.scss'
        });

        expect(fileList.length).to.equal(2);
    });

    it('check-file-for-import-should-find-file-name', async () => {
        const workingDir = `${path.resolve(__dirname, '../../test_src/utils/check-file-for-import-should-find-file-name')}`;
        const potentialFile = path.resolve(workingDir, './test.js');

        const {fileHasImport, knownFiles} = await utils.checkFileForImport({
            potentialFile,
            fileName: 'resource',
            fileType: 'js'
        });

        expect(fileHasImport).to.equal(true);
        expect(knownFiles[potentialFile]).to.not.be.null;
    });

    it('check-file-for-export-should-return-true-if-file-exports', async () => {
        const workingDir = `${path.resolve(__dirname, '../../test_src/utils/check-file-for-export-should-return-true-if-file-exports')}`;
        const source_file = path.resolve(workingDir, './test.js');

        const {fileHasExport, knownFiles} = await utils.checkFileForExport({
            source_file,
            fileType: 'js'
        });

        expect(fileHasExport).to.equal(true);
        expect(knownFiles[source_file]).to.not.be.null;
    });

    it('check-file-for-export-should-return-false-if-file-does-not-export', async () => {
        const workingDir = `${path.resolve(__dirname, '../../test_src/utils/check-file-for-export-should-return-false-if-file-does-not-export')}`;
        const source_file = path.resolve(workingDir, './test.js');

        const {fileHasExport} = await utils.checkFileForExport({
            source_file,
            fileType: 'js'
        });

        expect(fileHasExport).to.equal(false);
    });

    it('check-file-for-export-should-return-true-if-scss-has-underscore', async () => {
        const workingDir = `${path.resolve(__dirname, '../../test_src/utils/check-file-for-export-should-return-true-if-scss-has-underscore')}`;
        const source_file = path.resolve(workingDir, './_test.scss');

        const {fileHasExport} = await utils.checkFileForExport({
            source_file,
            fileType: 'scss'
        });

        expect(fileHasExport).to.equal(true);
    });   

    it('check-file-for-export-should-return-false-if-scss--does-not-have-underscore', async () => {
        const workingDir = `${path.resolve(__dirname, '../../test_src/utils/check-file-for-export-should-return-false-if-scss--does-not-have-underscore')}`;
        const source_file = path.resolve(workingDir, './test.scss');

        const {fileHasExport} = await utils.checkFileForExport({
            source_file,
            fileType: 'scss'
        });

        expect(fileHasExport).to.equal(false);
    });    
});

