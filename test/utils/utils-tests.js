const expect = require('chai').expect;
const utils = require('../../utils/utils');

describe('utils', () => {
    it('toGlobArray-should-return-single-glob', () => {
        const globArray = utils.toGlobArray({glob_def: 'test.scss', src_path: 'my/path'});
        expect(globArray).to.equal('my/path/test.scss');
    });
});

