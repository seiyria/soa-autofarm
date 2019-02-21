
// to SCROLL THE SCROLL BAR JUST CLICK IT AT THE DESIRED LOC ./nox_adb shell input touchscreen swipe 630 680 630 680 100

const Jimp = require('jimp');

const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

const Logger = require('./logger');
const { OPTIONS } = require('./env');

const { WINDOW_NAMES, WINDOW_STATES } = require('../window/window.states');
const { WINDOW_CLICKS } = require('../window/window.clicks');
const { rgbToHex } = require('./color');

const windowName = (id) => WINDOW_NAMES[id] || `UNKNOWN (${id})`;

const windowId = (name) => WINDOW_STATES[name] || `UNKNOWN (${name})`;

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

const clickScreenADB = (adb, x, y) => {
  exec(`"${OPTIONS.NOX_ADB_PATH}" -s ${adb} shell input touchscreen swipe ${x} ${y} ${x} ${y} ${OPTIONS.SWIPE_DURATION}`);
}

const clickScreen = (noxVmInfo, screenX, screenY) => {
  if(OPTIONS.NO_CLICK) return;
  
  const { headerHeight, vmHeight, vmWidth, height, width } = noxVmInfo;

  const x = Math.floor(screenX * (vmWidth / width));
  const y = headerHeight + Math.floor(screenY * (vmHeight / height));

  Logger.verbose(`Clicking screen at ${x} ${y}`);
  clickScreenADB(noxVmInfo.adb, x, y);
};

const tryTransitionState = (noxVmInfo, curState, nextState) => {
  const nextStateRef = transitionState(curState, nextState);
  if(!nextStateRef) return;

  const { x, y } = nextStateRef;
  clickScreen(noxVmInfo, x, y);
}

const killApp = (noxVmInfo, reason) => {
  Logger.log(`[Nox ${noxVmInfo.index}]`, reason || 'Killed for unknown reason.');
  exec(`"${OPTIONS.NOX_ADB_PATH}" -s ${noxVmInfo.adb} shell am force-stop com.square_enix.android_googleplay.StarOcean${OPTIONS.IS_JP ? 'j' : 'n'}`);
};

const getADBDevices = () => {
  const res = execSync(`"${OPTIONS.NOX_ADB_PATH}" devices`).toString();
  return res.split('\r\n').slice(1).map(x => x.split('\t')[0]).slice(0, -2);
};

const adbSettingToggle = (adb, toggle) => {
  exec(`"${OPTIONS.NOX_ADB_PATH}" -s ${adb} shell settings put system pointer_location ${toggle}`);
}
const isAtLeastPercentStaminaFull = (noxVmInfo) => {
  const percent = OPTIONS.HOST_STAM_PERCENT;
  if(percent <= 0) return false;

  const STAM_MIN_PIX = 16;
  const STAM_MAX_PIX = 212;
  const STAM_Y_PIX = 56;

  const CHECK_PIX = Math.floor(STAM_MIN_PIX + (STAM_MAX_PIX - STAM_MIN_PIX) * (percent / 100));

  const hexAt = rgbToHex(Jimp.intToRGBA(noxVmInfo.curImageState.getPixelColor(CHECK_PIX, noxVmInfo.headerHeight + STAM_Y_PIX)));

  // starting with 0 means it's in the gray range, background color, aka stamina used
  // in this case, we should *not* host
  return !hexAt.startsWith('0');
};

module.exports = {
  windowName,
  windowId,
  transitionState,
  clickScreenADB,
  clickScreen,
  tryTransitionState,
  killApp,
  getADBDevices,
  adbSettingToggle,
  isAtLeastPercentStaminaFull
};