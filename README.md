# just-build-it

A Zero Config builder to compile es6 and scss from a source directory into a destination directory

Meant to be Simple and no frills

Some configuration options exist however they are minimal, if you have specific needs building tool chains is actually pretty fun and WebPack is infiniatly configurable.

By default the builder will compile every .js file and .scss file (not starting with a _) in the src folder to the dist folder.  This can be modified using the js and scss glob settings in the config file which is explained below.

# Install

```
npm install just-build-it --save-dev
```

# Basic Usage

Add the following 2 scripts to your package.json

```javascript
  "scripts": {
    "start": "just-build-it",
    "build": "just-build-it build"
  }
```

Create an /src folder in your project and write some modern javascript and .scss

run `npm run build`

A /dist folder should appear with the files you want

# Watching and Serving

run `npm run dev`

A live reload server will start and watching will ensue.

# Avialable just-build-it modes (triggered by adding as second command in the package.json task)

default - ["clean-dist", "copy-static-files", "watch-static-files", "compile-js", "watch-js", "compile-scss", "watch-scss", "web-server"]

build - ["clean-dist", "copy-static-files", "compile-js", "compile-scss"]

watch - ["watch-static-files", "watch-js", "watch-scss", "web-server"]

And each task (entries on the right) can be called by name as well


# Additional configuration

create a config in the root of your project named 

.just-build-it

```javascript
{
    "run_server": true,
    "server_port": 3000,
    "server_root": "./dist",
    "builds": [
        {
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
        }
    ]
  }
```

Placing multiple entries in the builds folder of the config will start multiple builders (good for projects with lots of files)

# Under the hood

To compile JavaScript this toolchain is using Webpack with babel-loader and the following presets

['@babel/preset-env', 'react-app']

To compile SCSS this toolchain is using using gulp-sass

And it's SourceMaps are generated using gulp-sourcemaps as well

It's all wrapped in a few Gulp tasks

# Motivation

Make it symple to get started on projects, this build won't work for everything but it may work for alot of things