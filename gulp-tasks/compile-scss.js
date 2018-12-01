const gulp = require("gulp");
const glob = require("glob");
const path = require("path");
const scssCompiler = require('../compilers/scss-compiler');

const config = require('../config');
const scssGlob = `${config.src_path}/${config.scss_glob}`;

gulp.task('compile-scss', () => {
	buildScssFiles();
});

gulp.task('watch-scss', () => {
	console.log('Watching Scss Files');
	gulp.watch(`${config.src_path}/**/*.scss`, () => {
		buildScssFiles();
	});
});

function buildScssFiles() {
	console.log('Beginning Scss Compile');
	glob(scssGlob, (err, scssFiles) => {
		if (!err) {
			scssFiles.forEach((sourceScss) => {
				const sourceFile = path.basename(sourceScss);
				const sourceFolder = path.dirname(sourceScss);
				const destFolder = sourceFolder.replace(config.src_path, config.build_path);

				console.log(`compiling ${sourceScss} to ${destFolder}/${sourceFile.replace('scss', 'css')}`);
				scssCompiler({sourceFolder, sourceFile, destFolder});
			});
		}
	});
}
