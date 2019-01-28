
// ./nox_adb shell input touchscreen swipe 100 200 100 200 200 (x y destx desty duration)
// to SCROLL THE SCROLL BAR JUST CLICK IT AT THE DESIRED LOC ./nox_adb shell input touchscreen swipe 630 680 630 680 100

const NOX_ADB_PATH = 'D:\\Program Files\\Nox\\bin\\nox_adb.exe';

const exec = require('child_process').exec;

const Logger = require('./logger');
const { OPTIONS } = require('./env');

const { WINDOW_NAMES } = require('../window/window.states');
const { WINDOW_CLICKS } = require('../window/window.clicks');

const windowName = (id) => WINDOW_NAMES[id] || `UNKNOWN (${id})`;

const transitionState = (curState, nextState) => {
  if(!WINDOW_CLICKS[curState]) {
    Logger.error(`State "${windowName(curState)}" has no transition entry.`);
    return null;
  }

  if(!WINDOW_CLICKS[curState][nextState]) {
    Logger.error(`Transition "${windowName(curState)}" -> "${windowName(nextState)}" does not exist.`);
    return null;
  }

  return WINDOW_CLICKS[curState][nextState];
};

const clickScreen = (noxVmInfo, screenX, screenY) => {
  
  const { headerHeight, vmHeight, vmWidth, height, width } = noxVmInfo;

  const x = Math.floor(screenX * (vmWidth / width));
  const y = headerHeight + Math.floor(screenY * (vmHeight / height));

  Logger.verbose(`Clicking screen at ${x} ${y}`);
  exec(`"${NOX_ADB_PATH}" shell input touchscreen swipe ${x} ${y} ${x} ${y} ${OPTIONS.SWIPE_DURATION}`);
};

const tryTransitionState = (noxVmInfo, curState, nextState) => {
  const nextStateRef = transitionState(curState, nextState);
  if(!nextStateRef) return;

  const { x, y } = nextStateRef;
  clickScreen(noxVmInfo, x, y);
}

module.exports = {
  windowName,
  transitionState,
  clickScreen,
  tryTransitionState
};