const gulp = require('gulp');
const pkg = require.main.require(`${process.cwd()}/package.json`);


gulp.task('testing', () => {
    console.log(`testing....${pkg.name}`);
});


gulp.task('default', ['testing'], () => {});
