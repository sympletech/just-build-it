const fs = require('fs-extra');

// const configPath = `${process.cwd()}/.just-build-it`;
// const configFile = fs.readFileSync(configPath, 'utf-8');
const configFile = "{}";

const config = Object.assign({}, {
    "src_path": "./src",
    "js_glob": "**/*.js",
    "scss_glob": "**/*.scss",
    "static_files_glob": [
        '/**/*.html',
        '/**/*.css',
        '/**/*.jpg',
        '/**/*.gif',
        '/**/*.png',
        '/**/*.svg'
    ],
    "build_path": "./dist",
    "run_server": true,
    "server_port": 3000
}, JSON.parse(configFile));

console.log('Initializing Just-Build-It with the following config:');
console.log(config);

module.exports = config;
