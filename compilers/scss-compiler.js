const gulp = require("gulp");
const sass = require("gulp-sass");
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');

function scssCompiler({sourceFolder, sourceFile, destFolder}) {
	gulp.src(`${sourceFolder}/${sourceFile}`, {base: sourceFolder})
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.identityMap())
		.pipe(sassGlob())
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(destFolder))
		.on('error', (err) => {
			console.log(err);
			this.emit('end');
		});
}

module.exports = scssCompiler;
