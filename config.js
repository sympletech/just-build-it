const fs = require('fs-extra');

const configPath = `${process.cwd()}/.just-build-it`;
const configFile = fs.readFileSync(configPath, 'utf-8');

console.log('Initializing Just-Build-It with the following config:');
console.log(configFile);

const config = Object.assign({}, JSON.parse(configFile), {
    "src_path": "./src",
    "js_glob": "**/*.js",
    "scss_glob": "**/*.scss",
    "build_path": "./dist"
});
module.exports = config;
