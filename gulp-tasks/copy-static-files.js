const gulp = require("gulp");
const config = require('../config');

const staticGlob = config.static_files_glob.map((fileGlob) => (`${config.src_path}/${fileGlob}`));

function copyStaticFiles() {
    console.log('Copying static files');
	gulp.src(staticGlob, {base: config.src_path})
		.pipe(gulp.dest(config.build_path));
}

gulp.task('copy-static-files', () => {
	copyStaticFiles();
});

gulp.task('watch-static-files', () => {
	console.log('watching Static Files...');
	gulp.watch(staticGlob, () => {
		copyStaticFiles();
	});
});

