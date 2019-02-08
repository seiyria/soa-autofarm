
const { OPTIONS } = require('./env');

const formattedDate = () => new Date().toLocaleString();

const debug = (...args) => {
  if(!OPTIONS.DEBUG) return;
  
  console.debug(formattedDate(), '[Debug]', ...args);
};

const verbose = (...args) => {
  if(!(OPTIONS.DEBUG && OPTIONS.VERBOSE)) return;

  console.debug(formattedDate(), '[Verbose]', ...args);
}

const log = (...args) => {
  console.log(formattedDate(), ...args);
};

const error = (...args) => {
  console.error(formattedDate(), '[Error]', ...args);
};

module.exports = { debug, verbose, log, error };