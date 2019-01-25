const gulp = require("gulp");
const path = require("path");
const chokidar = require('chokidar');

const {lookupGlob, getBuildPath, findFilesIncluding} = require('../utils/utils');
const {scssCompiler} = require('../compilers/scss-compiler');

const config = require('../config');

const buildScssFiles = async ({scss_glob, src_path, build_path}) => {
	console.log(`Building Scss`, src_path, scss_glob);
	const scssFiles = await lookupGlob({glob_def: scss_glob, src_path});

	for (const sourceScss of scssFiles) {
		const outputDirName = getBuildPath({source_file: sourceScss, src_path, build_path});
		const sourceFile = path.basename(sourceScss);
		const sourceFolder = path.dirname(sourceScss);
		await scssCompiler({sourceFolder, sourceFile, destFolder: outputDirName});
	}
};

const buildScss = async (builds) => {
	for (const {src_path, scss_glob, build_path} of builds) {
		await buildScssFiles({src_path, scss_glob, build_path});
	}
};
gulp.task('build-scss', () => buildScss(config.builds));

const watchScss = (builds) => {
	console.log('Watching Scss Files');
	builds.forEach((buildConfig) => {
		const {src_path, scss_glob, build_path} = buildConfig;
		chokidar.watch(scss_glob, config.watch_settings)
			.on('add', buildWatchedFile)
			.on('change', buildWatchedFile);

		async function buildWatchedFile(filePath) {
			const fileName = path.resolve(__dirname + filePath);
			console.log(`Preparing to Build ${fileName}`);
			const filesIncluding = await findFilesIncluding({
				fileType: 'scss',
				source_file: fileName,
				src_path,
				glob_def: scss_glob
			});

			const buildlist = [fileName, ...filesIncluding].map((entry) =>
				path.resolve(entry)
					.replace(path.resolve(src_path), '')
					.replace('\\', '/'));

			await buildScssFiles({src_path, scss_glob: buildlist, build_path});
		}
	});
};
gulp.task('watch-scss', () => watchScss(config.builds));


module.exports = {buildScssFiles, buildScss, watchScss};
