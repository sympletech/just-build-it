#! /usr/bin/env node

const mode = process.argv[2] || 'default';

const gulp = require('gulp');
require('../gulpfile');

gulp.start(mode);
