const moveRemove = (path, globDef) => {
    let globResult = "";
    if (globDef.indexOf('!') > -1) {
        globResult = `!${path}/${globDef.replace('!', '')}`;
    } else {
        globResult = `${path}/${globDef}`;
    }
    return globResult;
};

const toGlobArray = ({glob_def, src_path}) => {
    let globArrayDef;
    if (Array.isArray(glob_def)) {
        globArrayDef = glob_def.map((jGlob) => (moveRemove(src_path, jGlob)));
    } else {
        globArrayDef = moveRemove(src_path, glob_def);
    }
    return globArrayDef;
};

module.exports = {moveRemove, toGlobArray};
