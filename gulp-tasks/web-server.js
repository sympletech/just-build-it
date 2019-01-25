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
                watch: true,
                watchOptions: {
                    ignoreInitial: true,
                    awaitWriteFinish: {
                        stabilityThreshold: 2000,
                        pollInterval: 100
                    }
                },
                watchEvents: ["add", "change"],
                cors: true,
                reloadOnRestart: true,
                notify: false,
                ui: false
            });
        }, 2000);
    }
});
