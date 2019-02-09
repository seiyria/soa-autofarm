
const { OPTIONS } = require('./env');
const Logger = require('./logger');

const replkeyhelper = (key, noxState) => {

  // CTRL-C, q, kill app
  if(key.sequence === '\u0003' || key.name === 'q') {
    Logger.log(`[REPL "q"]`, 'See ya!');
    process.exit();
  }

  // n, log state
  if(key.name === 'n') {
    Logger.log(`[REPL "n"]`, 'Nox States:');
    Logger.log(noxState);
  }

  // debug logging
  if(key.name === 'd') {
    OPTIONS.DEBUG = !OPTIONS.DEBUG;
    if(!OPTIONS.DEBUG) {
      OPTIONS.VERBOSE = false;
    }

    Logger.log(`[REPL "d"]`, 'Debug: ', OPTIONS.DEBUG, 'Verbose: ', OPTIONS.VERBOSE);
  }

  // verbose logging
  if(key.name === 'v') {
    OPTIONS.VERBOSE = !OPTIONS.VERBOSE;
    if(OPTIONS.VERBOSE) OPTIONS.DEBUG = true;

    Logger.log(`[REPL "v"]`, 'Debug: ', OPTIONS.DEBUG, 'Verbose: ', OPTIONS.VERBOSE);
  }

  // turn clicking on or off
  if(key.name === 'c') {
    OPTIONS.NO_CLICK = !OPTIONS.NO_CLICK;

    Logger.log(`[REPL "c"]`, OPTIONS.NO_CLICK ? 'No more clicking!' : 'Will resume clicking!');
  }

  // print options
  if(key.name === 'o') {
    Logger.log(`[REPL "o"]`, 'Options:');
    Logger.log(OPTIONS);
  }
};

module.exports = {
  replkeyhelper
};