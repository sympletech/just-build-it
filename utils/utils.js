const path = require('path');
const glob = require("glob-all");

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
        globArrayDef = [moveRemove(src_path, glob_def)];
    }
    return globArrayDef;
};

const getFileList = (globArray) => {
    const includeStmts = globArray.filter((glb) => glb.indexOf('!') === -1);
    const excludeStmts = globArray.filter((glb) => glb.indexOf('!') === 0);
    const orderedGlob = [...includeStmts, ...excludeStmts];
    const fileList = glob.sync(orderedGlob);
    return fileList;
};

const lookupGlob = ({glob_def, src_path}) => {
    const globArray = toGlobArray({glob_def, src_path});
    const fileList = getFileList(globArray);
    return fileList;
};

const getBuildPath = ({source_file, src_path, build_path}) => {
    const fullSourcePath = path.resolve(path.dirname(source_file));
    const subFolder = fullSourcePath.replace(path.resolve(src_path), '');
    const outputDirName = path.resolve(build_path, `./${subFolder}`);
    return outputDirName;
};

module.exports = {moveRemove, toGlobArray, getFileList, lookupGlob, getBuildPath};
