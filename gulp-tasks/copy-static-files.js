const gulp = require("gulp");
const chokidar = require('chokidar');
const config = require('../config');
const fs = require('fs-extra');
const path = require('path');

const {lookupGlob} = require('../utils/utils');

const copyStaticFiles = async ({static_files_glob, src_path, build_path}) => {
	console.log(`Copying Static Files ${(new Date()).toTimeString()}`);
	const staticFiles = await lookupGlob({glob_def: static_files_glob, src_path});

	for (const sourceFile of staticFiles) {
		const savePath = path.resolve(sourceFile).replace(path.resolve(src_path), '');
		const destFile = `${path.resolve(build_path)}${savePath}`;
		await fs.copy(sourceFile, destFile);
	}
};

const copyStaticFilesTask = async (builds) => {
	for (const {static_files_glob, src_path, build_path} of builds) {
		await copyStaticFiles({static_files_glob, src_path, build_path});
	}
};

gulp.task('copy-static-files', async () => await copyStaticFilesTask(config.builds));

const watchStaticFilesTask = (builds) => {
	console.log('watching Static Files...');
	builds.forEach((buildConfig) => {
		const staticGlob = buildConfig.static_files_glob.map((fileGlob) => (`${buildConfig.src_path}/${fileGlob}`));
		chokidar.watch(staticGlob, {
            ignoreInitial: true,
            followSymlinks: true			
		}).on('all', async () => {
			await copyStaticFiles(buildConfig);
		});
	});
};
gulp.task('watch-static-files', () => watchStaticFilesTask(config.builds));

module.exports = {copyStaticFiles, copyStaticFilesTask, watchStaticFilesTask};
