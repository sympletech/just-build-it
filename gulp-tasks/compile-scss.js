const gulp = require("gulp");
const path = require("path");

const {lookupGlob, getBuildPath} = require('../utils/utils');
const {scssCompiler} = require('../compilers/scss-compiler');

const config = require('../config');

const buildScssFiles = ({scss_glob, src_path, build_path}) => {
	console.log(`Building Scss`, src_path, scss_glob);
	const scssFiles = lookupGlob({glob_def: scss_glob, src_path});

	return Promise.all(scssFiles.map((sourceScss) => {
		const outputDirName = getBuildPath({source_file: sourceScss, src_path, build_path});
		const sourceFile = path.basename(sourceScss);
		const sourceFolder = path.dirname(sourceScss);
		return scssCompiler({sourceFolder, sourceFile, destFolder: outputDirName});
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
		const {src_path, scss_glob, build_path} = buildConfig;
		gulp.watch(`${src_path}/**/*.scss`, (evt) => {
			const fileName = evt.path;
			buildScssFiles({src_path, scss_glob, build_path});
		});
	});
};
gulp.task('watch-scss', () => watchScss(config.builds));


module.exports = {buildScssFiles, buildScss, watchScss};
