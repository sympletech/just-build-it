const pkg = require.main.require(`${process.cwd()}/package.json`);
const config = pkg.just_build_it;
module.exports = config;
