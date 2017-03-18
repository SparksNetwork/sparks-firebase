/*
This bootstrap function loads all the compiled functions from the dist.
'npm run build' compiles the ./src folder into the ./dist folder.
*/

"use strict";
const R = require('ramda')
const ex = require('./dist')

R.keys(ex).forEach(function(k) { exports[k] = ex[k] })
