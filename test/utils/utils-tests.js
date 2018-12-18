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
        expect(globArray).to.equal(['my/path/test.scss']);
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
});

