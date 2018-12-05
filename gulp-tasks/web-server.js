const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const config = require('../config');

gulp.task('web-server', () => {
    if (config.run_server) {
        console.log('Starting Web Server');
        browserSync.init({
            open: false,
            port: config.server_port,
            server: {
                baseDir: config.server_root,
                directory: true
            },
            watchOptions: {
                ignoreInitial: true
            },
            files: [
                `${config.build_path}/**/*`
            ],
            cors: true,
            reloadOnRestart: true
        });
    }
});
