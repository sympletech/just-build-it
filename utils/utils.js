const path = require('path');
const glob = require("glob-all");
const fs = require("fs-extra");

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

const getFileList = (globArray) => new Promise((resolve, reject) => {
    const includeStmts = globArray.filter((glb) => glb.indexOf('!') === -1);
    const excludeStmts = globArray.filter((glb) => glb.indexOf('!') === 0);
    const orderedGlob = [...includeStmts, ...excludeStmts];
    glob(orderedGlob, (err, fileList) => {
        if (err) {
            reject(err);
        } else {
            resolve(fileList);
        }
    });
});

const lookupGlob = async ({glob_def, src_path}) => {
    const globArray = toGlobArray({glob_def, src_path});
    const fileList = await getFileList(globArray);
    return fileList;
};

const getBuildPath = ({source_file, src_path, build_path}) => {
    const fullSourcePath = path.resolve(path.dirname(source_file));
    const subFolder = fullSourcePath.replace(path.resolve(src_path), '');
    const outputDirName = path.resolve(build_path, `./${subFolder}`);
    return outputDirName;
};

const findFilesIncluding = async ({source_file, src_path, glob_def, fileType, filesChecked = new Set(), knownFiles = {}}) => {
    const {fileHasExport} = await checkFileForExport({source_file, fileType, knownFiles});
    if (fileHasExport) {
        const fileName = path.basename(source_file)
            .replace(`.${fileType}`, '')
            .replace('_', '')
            .toLowerCase();
        const potentialFiles = await lookupGlob({glob_def, src_path});
        const fileList = [];

        await Promise.all(potentialFiles.map((potentialFile) => new Promise((resolve) => {
            checkFileForImport({
                potentialFile,
                fileName,
                fileType,
                knownFiles
            }).then((importCheck) => {
                if (importCheck.fileHasImport) {
                    fileList.push(potentialFile);
                }
                resolve();
            });
        })));

        filesChecked.add(source_file);

        const fullFileList = new Set(fileList);
        for (const potentialFile of fileList) {
            if (!filesChecked.has(potentialFile)) {
                const additionalFiles = await findFilesIncluding({source_file: potentialFile, src_path, glob_def, fileType, filesChecked});
                for (const additionalFile of additionalFiles) {
                    fullFileList.add(additionalFile);
                }
            }
        }
        return Array.from(fullFileList);
    } else {
        return [source_file];
    }
};

async function checkFileForExport({source_file, fileType, knownFiles = {}}) {
    let fileHasExport = false;
    if (fileType === 'js') {
        const fileContents = await fs.readFile(source_file, 'utf8');

        const importLines = fileContents
            .split('\n').filter((lineContent) => (lineContent.indexOf('import') > -1))
            .map((lineContent) => (lineContent.toLowerCase()));

        knownFiles[source_file] = importLines;
        fileHasExport = fileContents.indexOf('export') > -1;
    }

    if (fileType === 'scss') {
        fileHasExport = path.basename(source_file).indexOf('_') === 0;
    }

    return {fileHasExport, knownFiles};
}

async function checkFileForImport({potentialFile, fileName, fileType, knownFiles = {}}) {
    let importLines = [];

    if (knownFiles[potentialFile]) {
        importLines = knownFiles[potentialFile];
    } else {
        const fileContents = await fs.readFile(potentialFile, 'utf8');
        const importDirective = (() => {
            switch (fileType) {
                case 'js':
                    return 'import';
                case 'scss':
                    return '@import';
            }
        })();
        importLines = fileContents
            .split('\n').filter((lineContent) => (lineContent.indexOf(importDirective) > -1))
            .map((lineContent) => (lineContent.toLowerCase()));

        knownFiles[potentialFile] = importLines;
    }

    const fileHasImport = importLines.some((lineContent) => lineContent.indexOf(fileName) > -1);
    return {fileHasImport, knownFiles};
}


module.exports = {moveRemove, toGlobArray, getFileList, lookupGlob, getBuildPath, findFilesIncluding, checkFileForExport, checkFileForImport};
