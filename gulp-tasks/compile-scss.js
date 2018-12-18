const gulp = require("gulp");
const path = require("path");

const {lookupGlob} = require('../utils/utils');
const {scssCompiler} = require('../compilers/scss-compiler');

const config = require('../config');

const buildScssFiles = ({scss_glob, src_path, build_path}) => {
	const scssFiles = lookupGlob({glob_def: scss_glob, src_path});

	return Promise.all(scssFiles.map((sourceScss) => {
		const sourceFile = path.basename(sourceScss);
		const sourceFolder = path.dirname(sourceScss);
		return scssCompiler({sourceFolder, sourceFile, destFolder: path.resolve(build_path)});
	}));
};

const buildScss = (builds) => Promise.all(
	builds.map(({src_path, scss_glob, build_path}) =>
		buildScssFiles({src_path, scss_glob, build_path}))
);
gulp.task('build-scss', () => buildScss(config.builds));

const watchScss = (builds) => {
	console.log('Watching Scss Files');
	builds.forEach((buildConfig) => {
		const scssGlob = `${buildConfig.src_path}/${buildConfig.scss_glob}`;
		gulp.watch(`${config.src_path}/**/*.scss`, () => {
			buildScssFiles({scssGlob, src_path: buildConfig.src_path, build_path: buildConfig.build_path});
		});
	});
};
gulp.task('watch-scss', () => watchScss(config.builds));


module.exports = {buildScssFiles, buildScss, watchScss};
