
// ./nox_adb shell input touchscreen swipe 100 200 100 200 200 (x y destx desty duration)
// to SCROLL THE SCROLL BAR JUST CLICK IT AT THE DESIRED LOC ./nox_adb shell input touchscreen swipe 630 680 630 680 100

const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

const Logger = require('./logger');
const { OPTIONS } = require('./env');

const NOX_ADB_PATH = OPTIONS.NOX_ADB_PATH;

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
  exec(`"${NOX_ADB_PATH}" -s ${noxVmInfo.adb} shell input touchscreen swipe ${x} ${y} ${x} ${y} ${OPTIONS.SWIPE_DURATION}`);
};

const tryTransitionState = (noxVmInfo, curState, nextState) => {
  const nextStateRef = transitionState(curState, nextState);
  if(!nextStateRef) return;

  const { x, y } = nextStateRef;
  clickScreen(noxVmInfo, x, y);
}

const killApp = (noxVmInfo) => {
  exec(`"${NOX_ADB_PATH}" -s ${noxVmInfo.adb} shell am force-stop com.square_enix.android_googleplay.StarOcean${OPTIONS.IS_JP ? 'j' : 'n'}`);
};

const getADBDevices = () => {
  const res = execSync(`"${NOX_ADB_PATH}" devices`).toString();
  return res.split('\n').slice(1).map(x => x.split('\t')[0]).slice(0, -2);
};

module.exports = {
  windowName,
  transitionState,
  clickScreen,
  tryTransitionState,
  killApp,
  getADBDevices
};