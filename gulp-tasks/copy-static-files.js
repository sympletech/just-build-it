const gulp = require("gulp");
const config = require('../config');



function copyStaticFiles(buildConfig) {
	console.log('Copying static files');
	const staticGlob = buildConfig.static_files_glob.map((fileGlob) => (`${buildConfig.src_path}/${fileGlob}`));
	gulp.src(staticGlob, {base: buildConfig.src_path})
		.pipe(gulp.dest(buildConfig.build_path));
}

gulp.task('copy-static-files', () => {
	config.builds.forEach((buildConfig) => {
		copyStaticFiles(buildConfig);
	});
});

gulp.task('watch-static-files', () => {
	console.log('watching Static Files...');
	config.builds.forEach((buildConfig) => {
		const staticGlob = buildConfig.static_files_glob.map((fileGlob) => (`${buildConfig.src_path}/${fileGlob}`));
		gulp.watch(staticGlob, () => {
			copyStaticFiles(buildConfig);
		});
	});
});

