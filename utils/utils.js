const path = require('path');
const glob = require("glob-all");
const fs = require('fs-extra');
const readline = require('readline');

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

const findFilesIncluding = async ({source_file, src_path, glob_def, fileType}) => {
    const fileName = path.basename(source_file)
        .replace(`.${fileType}`, '')
        .toLowerCase();
    const potentialFiles = lookupGlob({glob_def, src_path});
    const fileList = [];

    await Promise.all(
        potentialFiles.map((pFile) => new Promise((resolve) => {
            const lineReader = readline.createInterface({
                input: fs.createReadStream(pFile)
            });
            lineReader.on('line', async (line) => {
                const importDirective = (() => {
                    switch (fileType) {
                        case 'js':
                            return 'import';
                        case 'scss':
                            return '@import';
                    }
                })();
                const includesFile = line.indexOf(importDirective) === 0 && line.toLowerCase().indexOf(fileName) > -1;

                if (includesFile) {
                    fileList.push(pFile);
                    lineReader.close();
                    resolve();
                }
            });
            lineReader.on('close', () => {
                resolve();
            });
        }))
    );

    const fullFileList = new Set(fileList);
    await Promise.all(fileList.map(async (pFile) => {
        const additionalFiles = await findFilesIncluding({source_file: pFile, src_path, glob_def, fileType});
        additionalFiles.forEach((aFile) => {
            fullFileList.add(aFile);
        });
    }));

    return Array.from(fullFileList);
};


module.exports = {moveRemove, toGlobArray, getFileList, lookupGlob, getBuildPath, findFilesIncluding};
