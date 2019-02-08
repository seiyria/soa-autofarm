
const { OPTIONS } = require('./env');

const replkeyhelper = (key, noxState) => {

  // CTRL-C, q, kill app
  if(key.sequence === '\u0003' || key.name === 'q') {
    process.exit();
  }

  // n, log state
  if(key.name === 'n') {
    console.log(noxState);
  }

  // debug logging
  if(key.name === 'd') {
    OPTIONS.DEBUG = !OPTIONS.DEBUG;
    if(!OPTIONS.DEBUG) {
      OPTIONS.VERBOSE = false;
    }
  }

  // verbose logging
  if(key.name === 'v') {
    OPTIONS.VERBOSE = !OPTIONS.VERBOSE;
    if(OPTIONS.VERBOSE) OPTIONS.DEBUG = true;
  }
};

module.exports = {
  replkeyhelper
};