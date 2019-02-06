
// ./nox_adb shell input touchscreen swipe 100 200 100 200 200 (x y destx desty duration)
// to SCROLL THE SCROLL BAR JUST CLICK IT AT THE DESIRED LOC ./nox_adb shell input touchscreen swipe 630 680 630 680 100

const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

const Logger = require('./logger');
const { OPTIONS } = require('./env');

const NOX_ADB_PATH = OPTIONS.NOX_ADB_PATH;

const { WINDOW_NAMES, WINDOW_STATES } = require('../window/window.states');
const { WINDOW_CLICKS } = require('../window/window.clicks');

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

// sadly, this doesn't work at all. but I'm keeping the code here in case I can figure out a way to tie NoxVMHandle <-> NoxPlayer
const getTCPAndWindowNames = () => {

  const cmd = `Get-NetTCPConnection | 
  Select LocalAddress, LocalPort, State, OwningProcess, @{n='WindowTitle';e={(Get-Process -ErrorAction Ignore -Id $_.OwningProcess).MainWindowTitle}} |
  Where {$_.State -eq 'Established' -and $_.WindowTitle -match '${OPTIONS.NOX_WINDOW_NAME}*'} | 
  Format-Table -AutoSize`.split('\n').join(' ');

  const retval = execSync(`powershell.exe -Command "${cmd}"`).toString();

  return retval.split('\r\n').slice(3, -3).map(x => x.trim().replace(/\s\s+/g, ' ')).map(x => {
    const [ip, port, , , name] = x.split(' ');
    return { addr: `${ip}:${port}`, name };
  });
};

const getADBDevices = () => {
  const res = execSync(`"${NOX_ADB_PATH}" devices`).toString();
  return res.split('\r\n').slice(1).map(x => x.split('\t')[0]).slice(0, -2);
};

const componentToHexString = (num) => num.toString(16).padStart(2, '0');

const rgbToHex = ({ r, g, b }) => {
  return (componentToHexString(r) + componentToHexString(g) + componentToHexString(b)).toUpperCase();
};

module.exports = {
  windowName,
  windowId,
  transitionState,
  clickScreen,
  tryTransitionState,
  killApp,
  getADBDevices,
  getTCPAndWindowNames,
  rgbToHex
};