const path = require('path');
const glob = require("glob-all");
// const fs = require('fs-extra');
// const readline = require('readline');
const LineByLineReader = require('line-by-line');

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

const getFileList = async (globArray) => new Promise((resolve, reject) => {
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

const findFilesIncluding = async ({source_file, src_path, glob_def, fileType}) => {
    const fileName = path.basename(source_file)
        .replace(`.${fileType}`, '')
        .replace('_', '')
        .toLowerCase();
    const potentialFiles = await lookupGlob({glob_def, src_path});
    const fileList = [];

    for (const potentialFile of potentialFiles) {
        const fileHasImport = await checkFileForImport({potentialFile, fileName, fileType});
        if (fileHasImport) {
            fileList.push(potentialFile);
        }
    }

    const fullFileList = new Set(fileList);
    for (const potentialFile of fileList) {
        const additionalFiles = await findFilesIncluding({source_file: potentialFile, src_path, glob_def, fileType});
        for (const additionalFile of additionalFiles) {
            fullFileList.add(additionalFile);
        }
    }

    return Array.from(fullFileList);
};

function checkFileForImport({potentialFile, fileName, fileType}) {
    return new Promise((resolve, reject) => {
        let fileHasImport = false;
        const lineByLineReader = new LineByLineReader(potentialFile);
        lineByLineReader.on('error', (err) => {
            resolve(false);
        });
        lineByLineReader.on('line', (line) => {
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
                fileHasImport = true;
                lineByLineReader.close();
            }
        });
        lineByLineReader.on('end', () => {
            resolve(fileHasImport);
        });







        // const lineReader = readline.createInterface({
        //     input: fs.createReadStream(potentialFile)
        // });
        // lineReader.on('line', (line) => {
        //     const importDirective = (() => {
        //         switch (fileType) {
        //             case 'js':
        //                 return 'import';
        //             case 'scss':
        //                 return '@import';
        //         }
        //     })();
        //     const includesFile = line.indexOf(importDirective) === 0 && line.toLowerCase().indexOf(fileName) > -1;

        //     if (includesFile) {
        //         fileHasImport = true;
        //         lineReader.close();
        //     }
        // });
        // lineReader.on('close', () => {
        //     resolve(fileHasImport);
        // });
    });
}


module.exports = {moveRemove, toGlobArray, getFileList, lookupGlob, getBuildPath, findFilesIncluding, checkFileForImport};
