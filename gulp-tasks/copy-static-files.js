const gulp = require("gulp");
const config = require('../config');
const glob = require("glob-all");
const fs = require('fs-extra');
const path = require('path');

const {toGlobArray} = require('../utils/utils');

const copyStaticFiles = ({static_files_glob, src_path, build_path}) => {
	console.log(`Building Javascript ${(new Date()).toTimeString()}`);
	const staticFilesArray = toGlobArray({glob_def: static_files_glob, src_path});
	const staticFiles = glob.sync(staticFilesArray);
	const buildPromises = staticFiles.map((sourceFile) => {
		const savePath = path.resolve(sourceFile).replace(path.resolve(src_path), '');
		const destFile = `${path.resolve(build_path)}${savePath}`;
		return fs.copy(sourceFile, destFile);
	});
	return Promise.all(buildPromises);
};

const copyStaticFilesTask = (builds) => Promise.all(
	builds.map(copyStaticFiles)
);
gulp.task('copy-static-files', () => copyStaticFilesTask(config.builds));

const watchStaticFilesTask = (builds) => {
	console.log('watching Static Files...');
	builds.forEach((buildConfig) => {
		const staticGlob = buildConfig.static_files_glob.map((fileGlob) => (`${buildConfig.src_path}/${fileGlob}`));
		gulp.watch(staticGlob, () => {
			copyStaticFiles(buildConfig);
		});
	});
};
gulp.task('watch-static-files', () => watchStaticFilesTask(config.builds));

module.exports = {copyStaticFiles, copyStaticFilesTask, watchStaticFilesTask};
