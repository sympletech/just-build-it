const gulp = require("gulp");
const glob = require("glob");
const path = require("path");
const scssCompiler = require('../compilers/scss-compiler');

const config = require('../config');


gulp.task('build-scss', () => {
	config.builds.forEach((buildConfig) => {
		const scssGlob = `${buildConfig.src_path}/${buildConfig.scss_glob}`;
		buildScssFiles({scssGlob, src_path: buildConfig.src_path, build_path: buildConfig.build_path});
	});
});

gulp.task('watch-scss', () => {
	console.log('Watching Scss Files');
	config.builds.forEach((buildConfig) => {
		const scssGlob = `${buildConfig.src_path}/${buildConfig.scss_glob}`;
		gulp.watch(`${config.src_path}/**/*.scss`, () => {
			buildScssFiles({scssGlob, src_path: buildConfig.src_path, build_path: buildConfig.build_path});
		});
	});
});

function buildScssFiles({scssGlob, src_path, build_path}) {
	console.log(`Building SCSS ${(new Date()).toTimeString()}`);
	glob(scssGlob, (err, scssFiles) => {
		if (!err) {
			scssFiles.forEach((sourceScss) => {
				const sourceFile = path.basename(sourceScss);
				const sourceFolder = path.dirname(sourceScss);
				const destFolder = sourceFolder.replace(src_path, build_path);
				scssCompiler({sourceFolder, sourceFile, destFolder});
			});
		}
	});
}
