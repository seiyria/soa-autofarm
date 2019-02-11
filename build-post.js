
const fs = require('fs');

fs.copyFileSync('./src/ext/rectshot.cs', './build/rectshot.cs');
fs.copyFileSync('./src/ext/winpos.cs', './build/winpos.cs');
fs.copyFileSync('./node_modules/edge-cs/lib/edge-cs.dll', './build/edge-cs.dll');
fs.copyFileSync('./node_modules/robotjs/build/Release/robotjs.node', './build/robotjs.node');