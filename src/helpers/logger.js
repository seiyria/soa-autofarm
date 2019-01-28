
const { OPTIONS } = require('./env');

const IS_DEBUG = OPTIONS.DEBUG;
const IS_VERBOSE = IS_DEBUG && OPTIONS.VERBOSE;

const formattedDate = () => new Date().toLocaleString();

const debug = (...args) => {
  if(!IS_DEBUG) return;
  
  console.debug(formattedDate(), '[Debug]', ...args);
};

const verbose = (...args) => {
  if(!IS_VERBOSE) return;

  console.debug(formattedDate(), '[Verbose]', ...args);
}

const log = (...args) => {
  console.log(formattedDate(), ...args);
};

const error = (...args) => {
  console.error(formattedDate(), '[Error]', ...args);
};

module.exports = { debug, verbose, log, error };