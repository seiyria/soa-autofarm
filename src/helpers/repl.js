
const { OPTIONS } = require('./env');

const replkeyhelper = (key, noxState) => {

  // CTRL-C, q, kill app
  if(key.sequence === '\u0003' || key.name === 'q') {
    console.log('See ya!');
    process.exit();
  }

  // n, log state
  if(key.name === 'n') {
    console.log('Nox States:');
    console.log(noxState);
  }

  // debug logging
  if(key.name === 'd') {
    OPTIONS.DEBUG = !OPTIONS.DEBUG;
    if(!OPTIONS.DEBUG) {
      OPTIONS.VERBOSE = false;
    }

    console.log('Debug: ', OPTIONS.DEBUG, 'Verbose: ', OPTIONS.VERBOSE);
  }

  // verbose logging
  if(key.name === 'v') {
    OPTIONS.VERBOSE = !OPTIONS.VERBOSE;
    if(OPTIONS.VERBOSE) OPTIONS.DEBUG = true;

    console.log('Debug: ', OPTIONS.DEBUG, 'Verbose: ', OPTIONS.VERBOSE);
  }

  // turn clicking on or off
  if(key.name === 'c') {
    OPTIONS.NO_CLICK = !OPTIONS.NO_CLICK;

    console.log(OPTIONS.NO_CLICK ? 'No more clicking!' : 'Will resume clicking!');
  }

  // print options
  if(key.name === 'o') {
    console.log(OPTIONS);
  }
};

module.exports = {
  replkeyhelper
};