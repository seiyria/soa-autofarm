
const fs = require('fs');
const Jimp = require('jimp');

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

  // dump everything about the current state. u is for ugh.
  if(key.name === 'u') {

    const ts = Date.now();

    Logger.Log(`[REPL "u"]`, `Dumping state and screen for ${noxState.length} Nox. Timestamp: ${ts}`);

    noxState.forEach(async (noxVmInfo, i) => {
      const cloneState = Object.assign({}, noxVmInfo);
      delete cloneState.curImageState;

      fs.writeFile(process.cwd() + `/${ts}-state-${i}.json`, JSON.stringify({ options: OPTIONS, vm: cloneState }, null, 4), () => {});
      fs.writeFile(process.cwd() + `/${ts}-screen-${i}.png`, await noxVmInfo.curImageState.getBufferAsync(Jimp.MIME_PNG), () => {});
    });

  }
};

module.exports = {
  replkeyhelper
};