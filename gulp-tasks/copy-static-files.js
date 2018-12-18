const gulp = require("gulp");
const config = require('../config');
const fs = require('fs-extra');
const path = require('path');

const {lookupGlob} = require('../utils/utils');

const copyStaticFiles = ({static_files_glob, src_path, build_path}) => {
	console.log(`Building Javascript ${(new Date()).toTimeString()}`);
	const staticFiles = lookupGlob({glob_def: static_files_glob, src_path});

	return Promise.all(staticFiles.map((sourceFile) => {
		const savePath = path.resolve(sourceFile).replace(path.resolve(src_path), '');
		const destFile = `${path.resolve(build_path)}${savePath}`;
		return fs.copy(sourceFile, destFile);
	}));
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
