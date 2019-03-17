const path = require('path');

// hardcoded width/height - do not change - values are calibrated based on these sizes
const WIN_SIZE_W = 559;
const WIN_SIZE_H = 1020;

const basepath = process.pkg ? process.cwd() : __dirname + '/ext';

// native deps
let winpos;
let rectshot;
let winsize;

// other deps / imports
const Jimp = require('jimp');
const sortBy = require('lodash.sortby');

// helpers
const { OPTIONS, isEnvValid, setOptions } = require('./helpers/env');

const { WINDOW_STATES } = require('./window/window.states');
const { WINDOW_TRANSITIONS } = require('./window/window.transitions');
const { WINDOW_INFORMATION } = require('./window/window.information');
const { windowName, getADBDevices, adbSettingToggle, clickScreenADB, killApp, restartVM } = require('./helpers/window');
const { rgbToHex, areColorsWithinTolerance } = require('./helpers/color');
const { replkeyhelper } = require('./helpers/repl');

const Logger = require('./helpers/logger');

// track all of the current nox instance data
let noxInstances = [];

// should the app be running?
let SHOULD_RUN = false;

// if the app fails, what should happen?
const globalOnFail = () => process.exit(0);

// when a status change happens, what happens?
// jokes on you, this is for UI only.
const globalOnStatus = () => {};

// it a joke, because it UI only.
const globalOnState = () => {};

// get the current state based on the nox instance Left/Top
const getState = async (noxVmInfo) => {

  let foundScreen = WINDOW_STATES.UNKNOWN;
  const screenshot = rectshot([noxVmInfo.left, noxVmInfo.top, noxVmInfo.width, noxVmInfo.height], true);
  const image = await Jimp.read(screenshot);
  noxVmInfo.curImageState = image;
  const OFFSET = OPTIONS.SAFETY_RADIUS;

  Object.keys(WINDOW_INFORMATION).forEach(screenId => {

    // if we have a screen we're on, or we're checking for unknown - don't.
    if(foundScreen || screenId === `${WINDOW_STATES.UNKNOWN}`) return;

    // if we can't find information on this screen id, it doesn't exist.
    const screen = WINDOW_INFORMATION[screenId];
    if(!screen) return;
    
    const transition = WINDOW_TRANSITIONS[screenId];
    if(transition && transition.canEnter && !transition.canEnter()) return;

    // if they have a pos of 0/0 they're probably not set up correctly, so we skip them.
    if(screen.pos.x === 0 || screen.pos.y === 0) {
      Logger.verbose(`Skipping ${screenId} (${windowName(screenId)})...`);
      return;
    }

    for(let screenX = screen.pos.x - OFFSET; screenX <= screen.pos.x + OFFSET; screenX++) {
      for(let screenY = screen.pos.y - OFFSET; screenY <= screen.pos.y + OFFSET; screenY++) {

        // get the color of the pixel at that particular location
        // robot.getColor doesn't work because it breaks if your coordinate is on a different monitor
        const hexColorRGBA = Jimp.intToRGBA(image.getPixelColor(screenX, screenY + OPTIONS.NOX_HEADER_HEIGHT));
        const hexColor = rgbToHex(hexColorRGBA);
    
        // move the mouse to the location in debug mode only
        // if(OPTIONS.DEBUG_STATES[windowName(screenId)] || screen.debug) robot.moveMouse(noxVmInfo.left + screenX, noxVmInfo.top + screenY + NOX_HEADER_HEIGHT);
    
        // if we have a color set for this screen
        if(screen.hex) {
          Logger.verbose(`[Nox ${noxVmInfo.index}]`, 'SCREEN CHECK', windowName(screenId), 'foundcolor', hexColor, 'desiredcolor', screen.hex, 'x', screenX, 'y', screenY, 'match', hexColor === screen.hex);
    
          // if it matches, we have our screen
          if(areColorsWithinTolerance(screen.hex, hexColor)) foundScreen = screenId;
    
        // should only happen when adding a new screen
        } else {
          Logger.verbose(`[Nox ${noxVmInfo.index}]`, 'POTENTIAL SCREEN', windowName(screenId), screenX, screenY, hexColor);
          if(OPTIONS.LOG_POTENTIAL_COLORS) {
            Logger.log(`[Nox ${noxVmInfo.index}]`, 'Screen Log', windowName(screenId), screenX, screenY, hexColor);
          }
        }

      }
    }
  });

  return foundScreen;
};

const updateRestartTime = (noxVmInfo) => {
  noxVmInfo.restartTime = Date.now() + OPTIONS.RESTART_DELAY;
};

// poll the nox instance
const poll = async (noxVmInfo) => { 
  if(!noxVmInfo.adb) return;

  if(noxVmInfo.needsVMRestart) {
    noxVmInfo.needsVMRestart = false;
    restartVM(noxVmInfo);
  }

  const lastState = noxVmInfo.state;

  const state = +(await getState(noxVmInfo));
  const oldTransitions = WINDOW_TRANSITIONS[lastState];
  const curTransitions = WINDOW_TRANSITIONS[state];

  noxVmInfo.state = state;
  noxVmInfo.stateName = windowName(noxVmInfo.state);
  noxVmInfo.stateRepeats = noxVmInfo.stateRepeats || 0;
  noxVmInfo.absoluteStateRepeats = noxVmInfo.absoluteStateRepeats || 0;

  // check if we were flagged to restart. we do that if we're... not in combat, basically.
  if(noxVmInfo.shouldRestart && noxVmInfo.state !== WINDOW_STATES.UNKNOWN && !WINDOW_INFORMATION[state].ignoreKillswitch) {
    killApp(noxVmInfo, 'Restarting to clear up memory.');
    noxVmInfo.shouldRestart = false;
  }

  // if mouse block is set, we check mouse pos before running anything further.
  /*
  if(OPTIONS.MOUSE_BLOCK) {
    const { x, y } = robot.getMousePos();
    
    if(x > left && x < left + width && y > top && y < top + height) {
      Logger.debug(`[Nox ${noxVmInfo.index}]`, '---> MOUSE ---> BLOCK');
      return;
    }
  }
  */

  Logger.debug(`[Nox ${noxVmInfo.index}]`, '-----------> FOUND STATE', noxVmInfo.stateName);

  // we only change state if it's a new state
  if(state !== lastState) {
    noxVmInfo.stateRepeats = 0;
    noxVmInfo.absoluteStateRepeats = 0;

    if(state !== WINDOW_STATES.UNKNOWN) {
      Logger.log(`[Nox ${noxVmInfo.index}]`, 'New State', noxVmInfo.stateName);
  
      if(oldTransitions && oldTransitions.onLeave) {
        Logger.debug(`[Nox ${noxVmInfo.index}]`, '===========> TRANSITION:LEAVE', noxVmInfo.stateName);
        oldTransitions.onLeave(noxVmInfo);
      }
  
      if(curTransitions && curTransitions.onEnter) {
        Logger.debug(`[Nox ${noxVmInfo.index}]`, '===========> TRANSITION:ENTER', noxVmInfo.stateName);
        curTransitions.onEnter(noxVmInfo);

        noxVmInfo.stats[noxVmInfo.stateName] = noxVmInfo.stats[noxVmInfo.stateName] || 0;
        noxVmInfo.stats[noxVmInfo.stateName]++;
      }
    }
    

  } else if(state === lastState) {
    noxVmInfo.absoluteStateRepeats++;

    if(!WINDOW_INFORMATION[state].ignoreKillswitch && !OPTIONS.NO_CLICK) {
      noxVmInfo.stateRepeats++;
    }
    
    if(noxVmInfo.stateRepeats > OPTIONS.APP_KILL_COUNT) {
      noxVmInfo.stateRepeats = 0;
      noxVmInfo.absoluteStateRepeats = 0;
      killApp(noxVmInfo, 'Killing app due to large state repeat count (possibly frozen).');
    } 

    if(curTransitions && curTransitions.onRepeat) {
      Logger.debug(`[Nox ${noxVmInfo.index}]`, '===========> TRANSITION:REPEAT', noxVmInfo.stateName);
      curTransitions.onRepeat(noxVmInfo);
    }
    
  }
};

const pollBoth = async (noxes, onState) => {
  const waits = [];

  noxes.forEach(nox => {
    waits.push(poll(nox));
  });

  await Promise.all(waits);

  onState(noxes.map(nox => ({ stateName: nox.stateName, stateRepeats: nox.absoluteStateRepeats })));

  noxes.forEach(nox => {
    if(Date.now() < nox.restartTime) return;
    Logger.log('Flagged Nox instance(s) for restart.');
    nox.shouldRestart = true;

    updateRestartTime(nox);
  });

  // do it again
  if(!SHOULD_RUN) {
    Logger.log('Stopping...');
    return;
  }

  setTimeout(() => pollBoth(noxes, onState), OPTIONS.POLL_RATE);
};

const repositionNoxWindow = (loc, i) => {
  const obj = {
    state: WINDOW_STATES.UNKNOWN,
    left: loc.Left,
    top: loc.Top,
    width: loc.Right - loc.Left,
    height: loc.Bottom - loc.Top,

    headerHeight: OPTIONS.NOX_HEADER_HEIGHT,
    sidebarWidth: OPTIONS.NOX_SIDEBAR_WIDTH,

    vmHeight: OPTIONS.NOX_RES_HEIGHT,
    vmWidth: OPTIONS.NOX_RES_WIDTH,
    index: i,
    stats: {},

    // curImageState
    // adb
    // shouldRestart
    // stats
    // restartTime
  };

  noxInstances[i] = Object.assign({}, noxInstances[i] || {}, obj);
};

const getNoxPositions = () => {
  let noxPlayerPositions = [];

  try {
    noxPlayerPositions = winpos(OPTIONS.NOX_WINDOW_NAME, true);
  } catch(e) {
    Logger.error(e);
    onFail(e.message);
    return;
  }

  return sortBy(noxPlayerPositions, 'Left');
};

const calibrateNoxPositions = async (noxVmLocations, adbs) => {
  Logger.log(`Calibrating ${noxVmLocations.length} Nox Player location(s) with respect to ADB...`);

  const calibrateStartTimeout = () => {
    return new Promise(resolve => setTimeout(resolve, 1000));  
  };

  for(let adb of adbs) {
    adbSettingToggle(adb, 1);
    await calibrateStartTimeout();
    
    clickScreenADB(adb, 30, 500);

    for(let noxVmInfo of noxVmLocations) {
      await calibrateStartTimeout();

      const { headerHeight } = noxVmInfo;

      const screenshot = rectshot([noxVmInfo.left, noxVmInfo.top, noxVmInfo.width, noxVmInfo.height], true);
      const image = await Jimp.read(screenshot);

      const hexColorRGBA = Jimp.intToRGBA(image.getPixelColor(500, headerHeight + 5));
      
      // if it has the click settings bar up top and it has a gigantic chunk of red, it's this one
      if(hexColorRGBA.r > 200) {
        noxVmInfo.adb = adb;
        Logger.log(`Calibrated ${adb} and tied it to Nox ${noxVmInfo.index}`);
        break;
      }
    }

    adbSettingToggle(adb, 0);
    await calibrateStartTimeout();
  }
};

const resizeWindows = () => {
  Logger.log('Resizing windows...');
  winsize([OPTIONS.NOX_WINDOW_NAME, WIN_SIZE_W, WIN_SIZE_H], true);
};

const initEdgeFunctions = (edge) => {
  winpos = edge.func(path.join(basepath, 'winpos.cs'));
  rectshot = edge.func(path.join(basepath, 'rectshot.cs'));
  winsize = edge.func(path.join(basepath, 'winsize.cs'));
};

const run = async ({ onFail, onStatus, onState, options, edge } = {}) => {

  if(!onFail) onFail = globalOnFail;
  if(!onStatus) onStatus = globalOnStatus;
  if(!onState) onState = globalOnState;

  if(!edge) {
    Logger.log('[Startup Error]', 'No Edge available!');
    Logger.log('Exiting...');
    onFail('No edge available!');
    return;
  }

  initEdgeFunctions(edge);

  if(options) {
    setOptions(options);
  }

  const error = isEnvValid(OPTIONS);
  if(error) {
    Logger.log('[Startup Error]', error);
    Logger.log('Exiting...');
    onFail(error);
    return;
  }

  SHOULD_RUN = true;

  resizeWindows();

  const noxPlayerPositions = getNoxPositions();

  Logger.log(`Getting ${noxPlayerPositions.length} Nox Player location(s)...`);
  Logger.debug('Positions:', noxPlayerPositions);

  let adb = [];

  try {
    adb = getADBDevices();
  } catch(e) {
    onFail(e.message);
    return;
  }

  onStatus({ type: 'success', value: `Warming up...` });

  if(adb.length === 0 || noxPlayerPositions.length === 0) {
    onStatus({ type: 'warning', value: `Did not find any running instances of Nox.` });
    return;
  }

  if(adb.length !== noxPlayerPositions.length) {
    Logger.error(`Found ${adb.length} devices via ADB but could only find ${noxPlayerPositions.length} instances in Windows. Something is wrong.`);

    onStatus({ type: 'warning', value: `Running ${adb.length} instances of Nox (but could only find ${noxPlayerPositions.length})...` });
  }

  const VM_NAMES = OPTIONS.NOX_VM_NAMES.split(',');
  noxPlayerPositions.forEach((noxVmInfo, i) => {
    updateRestartTime(noxVmInfo);
    noxVmInfo.noxInternalVMName = (VM_NAMES[i] || '').trim();
  });

  noxInstances = noxPlayerPositions;
  
  // do different things if we calibrate than if we don't
  if(OPTIONS.NOX_CALIBRATE && noxPlayerPositions.length > 1) {
    noxPlayerPositions.forEach((loc, i) => {
      repositionNoxWindow(loc, i);
    });

    try {
      await calibrateNoxPositions(noxInstances, adb);
    } catch(e) {
      onFail(e.message);
      return;
    }

    onStatus({ type: 'success', value: `Running ${adb.length} instances of Nox...` });

    noxInstances.forEach((loc) => {
      if(loc.adb) return;
      Logger.error(`Found a Nox when calibrating with no ADB set. We can't keep doing this, captain. We're going to remove that Nox.`);
      onStatus({ type: 'danger', value: 'Did not find the correct number of Nox instances that ADB reports. Can still operate normally, but not sure what will happen from here on out.' });
    });

    noxInstances = noxInstances.filter(x => x.adb);

    // early check if someone cancels while starting
    if(!SHOULD_RUN) {
      onStatus({ type: '', value: `` });
      Logger.log('Early exit - see ya!');
      return;
    }

    pollBoth(noxInstances, onState);

  // run the nox instances in order, same order as adb
  } else {
    onStatus({ type: 'success', value: `Running ${adb.length} instances of Nox...` });

    noxPlayerPositions.forEach((loc, i) => {
      repositionNoxWindow(loc, i);
  
      noxInstances[i].adb = adb[i];
    });

    pollBoth(noxInstances, onState);
  }

  if(OPTIONS.NOX_ALLOW_MOVE) {
  
    const reposition = () => {
      Logger.debug('Repositioning Nox windows...');
      
      const noxPlayerPositions = getNoxPositions();
  
      noxPlayerPositions.forEach((loc, i) => {
        repositionNoxWindow(loc, i);
      });
    };
  
    setInterval(() => reposition(), OPTIONS.POLL_RATE);
  }
  
  if(OPTIONS.REPL) {
    require('readline').emitKeypressEvents(process.stdin);
  
    if(process.stdin.setRawMode) {
      process.stdin.setRawMode(true);
    
      process.stdin.on('keypress', (chunk, key) => {
        replkeyhelper(key, noxInstances);
      });
    
      Logger.log('Starting in REPL mode... See README for key combinations!');
    } else {
      Logger.log('Could not start in REPL mode.');
    }
  }
};

const stop = () => {
  SHOULD_RUN = false;
};

const replkeycall = (key) => {
  replkeyhelper({ name: key }, noxInstances);
};

const updateOptions = (options) => {
  setOptions(options);
};

module.exports = {
  run,
  stop,
  replkeycall,
  updateOptions
};