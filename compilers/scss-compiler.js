const gulp = require("gulp");
const plumber = require('gulp-plumber');
const sass = require("gulp-sass")(require('node-sass'));
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');

function scssCompiler({sourceFolder, sourceFile, destFolder}) {
	return new Promise((resolve, reject) => {
		gulp.src(`${sourceFolder}/${sourceFile}`, {base: sourceFolder})
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(sourcemaps.identityMap())
			.pipe(sassGlob())
			.pipe(sass({
				outputStyle: 'compressed'
			}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(destFolder))
			.on('end', () => {
				resolve();
			})
			.on('error', (err) => {
				console.log(err);
				this.emit('end');
				reject(err);
			});
	});
}

module.exports = {scssCompiler};
