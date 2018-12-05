const fs = require('fs-extra');

const configPath = `${process.cwd()}/.just-build-it`;
const configFile = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf-8') : '{}';
const configParsed = JSON.parse(configFile);

const builds = configParsed.builds.map((buildConfig) => (Object.assign({}, {
    "src_path": "./src",
    "build_path": "./dist",
    "js_glob": "**/*.js",
    "scss_glob": "**/*.scss",
    "static_files_glob": [
        "/**/*.html",
        "/**/*.css",
        "/**/*.jpg",
        "/**/*.gif",
        "/**/*.png",
        "/**/*.svg"
    ]
}, buildConfig)));

delete configParsed.builds;

const config = Object.assign({}, {
    "run_server": true,
    "server_port": 3000,
    "server_root": "./dist"
}, configParsed, {builds});

console.log('Initializing Just-Build-It with the following config:');
console.log(config);

module.exports = config;
