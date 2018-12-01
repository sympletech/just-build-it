# just-build-it

A reusable builder to compile es6 and scss from a source directory into a destination directory

Meant to be Simple and no frills

# Install

```
npm install just-build-it --save-dev
```

# Basic Usage

create a config in the root of your project named 

.just-build-it

`
{
    "src_path": "./src",
    "js_glob": "**/*.js",
    "scss_glob": "**/*.scss",
    "build_path": "./dist",
    "run_server": true,
    "server_port": 3000    
}
`

add the following 2 scripts to your package.json

`
  "scripts": {
    "dev": "just-build-it",
    "build": "just-build-it build"
  }
`
