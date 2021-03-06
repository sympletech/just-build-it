const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const config = require('../config');

gulp.task('web-server', () => {
    if (config.run_server) {
        setTimeout(() => {
            console.log('Starting Web Server');
            browserSync.init({
                open: false,
                port: config.server_port,
                server: {
                    baseDir: config.server_root,
                    directory: true
                },
                watch: false,
                watchOptions: config.watch_settings,
                watchEvents: ["add", "change"],
                cors: true,
                reloadOnRestart: false,
                notify: false,
                ui: false
            });
        }, 2000);
    }
});
