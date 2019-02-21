
const logMessages = [];

const fs = require('fs');
const logFile = `logfile-${Date.now()}.log`;

const { OPTIONS } = require('./env');

const formattedDate = () => new Date().toLocaleString();

const _doLog = (msg) => {
  if(!OPTIONS.DEBUG) return;
  
  logMessages.push(msg);
  fs.writeFile(process.cwd() + '/' + logFile, logMessages.map(x => x.join(' ')).join('\r\n'), () => {});
};

const debug = (...args) => {
  if(!OPTIONS.DEBUG) return;
  
  const msg = [formattedDate(), '[Debug]', ...args];
  console.debug(...msg);
  _doLog(msg);
};

const verbose = (...args) => {
  if(!(OPTIONS.DEBUG && OPTIONS.VERBOSE)) return;

  const msg = [formattedDate(), '[Verbose]', ...args];
  console.debug(...msg);
  _doLog(msg);
}

const log = (...args) => {
  const msg = [formattedDate(), ...args];
  console.log(...msg);
  _doLog(msg);
};

const error = (...args) => {
  const msg = [formattedDate(), '[Error]', ...args];
  console.error(...msg);
  _doLog(msg);
};

module.exports = { debug, verbose, log, error };