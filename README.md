# just-build-it

A reusable builder to compile es6 and scss from a source directory into a destination directory

Meant to be Simple and no frills

# Install

```
npm install just-build-it --save-dev
```

# Basic Usage

Add the following 2 scripts to your package.json

`

  "scripts": {

    "dev": "just-build-it",

    "build": "just-build-it build"

  }

`

Create an /src folder in your project and write some modern javascript and .scss

run `npm run build`

A /dist folder should appear with the files you want

# Watching and Serving

run `npm run dev`

A live reload server will start and watching will ensue.

# Additional configuration

create a config in the root of your project named 

.just-build-it

`
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
`

Placing multiple entries in the builds folder of the config will start multiple builders (good for projects with lots of files)
