const winpos = require('winpos');
const rectshot = require('rectshot');
const robot = require('robotjs');
const Jimp = require('jimp');

const sortBy = require('lodash.sortby');

const { OPTIONS } = require('./src/helpers/env');

const { WINDOW_STATES } = require('./src/window/window.states');
const { WINDOW_TRANSITIONS } = require('./src/window/window.transitions');
const { WINDOW_INFORMATION } = require('./src/window/window.information');
const { windowName, getADBDevices, rgbToHex, adbSettingToggle, clickScreenADB } = require('./src/helpers/window');

const Logger = require('./src/helpers/logger');

// the nox header height
const NOX_HEADER_HEIGHT = OPTIONS.NOX_HEADER_HEIGHT;
const NOX_SIDEBAR_WIDTH = 40;

// track all of the current nox instance data
let noxInstances = [];

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
        const hexColorRGBA = Jimp.intToRGBA(image.getPixelColor(screenX, screenY + NOX_HEADER_HEIGHT));
        const hexColor = rgbToHex(hexColorRGBA);
    
        // move the mouse to the location in debug mode only
        if(OPTIONS.DEBUG_STATES[windowName(screenId)] || screen.debug) robot.moveMouse(noxVmInfo.left + screenX, noxVmInfo.top + screenY + NOX_HEADER_HEIGHT);
    
        // if we have a color set for this screen
        if(screen.hex) {
          Logger.verbose(`[Nox ${noxVmInfo.index}]`, 'SCREEN CHECK', windowName(screenId), 'foundcolor', hexColor, 'desiredcolor', screen.hex, 'x', screenX, 'y', screenY, 'match', hexColor === screen.hex);
    
          // if it matches, we have our screen
          if(screen.hex === hexColor) foundScreen = screenId;
    
        // should only happen when adding a new screen
        } else {
          Logger.verbose(`[Nox ${noxVmInfo.index}]`, 'POTENTIAL SCREEN', windowName(screenId), screenX, screenY, hexColor);
    
        }

      }
    }
  });

  return foundScreen;
};

// poll the nox instance
const poll = async (noxIdx, lastState = WINDOW_STATES.UNKNOWN) => { 
  const noxVmInfo = noxInstances[noxIdx];
  if(!noxVmInfo.adb) return;

  const { left, top, width, height } = noxVmInfo;

  const state = await getState(noxVmInfo);
  const oldTransitions = WINDOW_TRANSITIONS[lastState];
  const curTransitions = WINDOW_TRANSITIONS[state];

  noxVmInfo.state = +state;
  noxVmInfo.stateRepeats = noxVmInfo.stateRepeats || 0;

  if(OPTIONS.MOUSE_BLOCK) {
    const { x, y } = robot.getMousePos();
    
    if(x > left && x < left + width && y > top && y < top + height) {
      Logger.debug(`[Nox ${noxIdx}]`, '---> MOUSE ---> BLOCK');
      setTimeout(() => poll(noxIdx, state), OPTIONS.POLL_RATE);
      return;
    }
  }

  Logger.debug(`[Nox ${noxIdx}]`, '-----------> FOUND STATE', windowName(state));

  // we only change state if it's a new state
  if(state !== lastState) {
    noxVmInfo.stateRepeats = 0;

    if(state !== WINDOW_STATES.UNKNOWN) {
      Logger.log(`[Nox ${noxIdx}]`, 'New State', windowName(state));
  
      if(oldTransitions && oldTransitions.onLeave) {
        Logger.debug(`[Nox ${noxIdx}]`, '===========> TRANSITION:LEAVE', windowName(lastState));
        oldTransitions.onLeave(noxVmInfo);
      }
  
      if(curTransitions && curTransitions.onEnter) {
        Logger.debug(`[Nox ${noxIdx}]`, '===========> TRANSITION:ENTER', windowName(state));
        curTransitions.onEnter(noxVmInfo);
      }
    }
    

  } else if(state === lastState) {
    noxVmInfo.stateRepeats++;
    
    if(noxVmInfo.stateRepeats > OPTIONS.APP_KILL_COUNT) {
      noxVmInfo.stateRepeats = 0;
      killApp(noxVmInfo, 'Killing app due to large UNKNOWN count.');
    } 

    if(curTransitions && curTransitions.onRepeat) {
      Logger.debug(`[Nox ${noxIdx}]`, '===========> TRANSITION:REPEAT', windowName(state));
      curTransitions.onRepeat(noxVmInfo);
    }
    
  }

  // do it again
  setTimeout(() => poll(noxIdx, state), OPTIONS.POLL_RATE);
};

const repositionNoxWindow = (loc, i) => {
  const obj = {
    state: WINDOW_STATES.UNKNOWN,
    left: loc.Left,
    top: loc.Top,
    width: loc.Right - loc.Left,
    height: loc.Bottom - loc.Top,

    headerHeight: NOX_HEADER_HEIGHT,
    sidebarWidth: NOX_SIDEBAR_WIDTH,

    vmHeight: OPTIONS.NOX_RES_HEIGHT,
    vmWidth: OPTIONS.NOX_RES_WIDTH,
    index: i,

    // curImageState
    // adb
  };

  noxInstances[i] = Object.assign({}, noxInstances[i] || {}, obj);
};

const getNoxPositions = () => {
  let noxPlayerPositions = [];

  try {
    noxPlayerPositions = winpos(OPTIONS.NOX_WINDOW_NAME, true);
  } catch(e) {
    Logger.error(e);
    process.exit(1);
  }

  return sortBy(noxPlayerPositions, 'Left');
};

const calibrateNoxPositions = async (noxVmLocations, adbs) => {
  Logger.log(`Calibrating ${noxVmLocations.length} Nox Player location(s) with respect to ADB...`);

  const calibrateStartTimeout = async () => {
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
        break;
      }
    }

    adbSettingToggle(adb, 0);
    await calibrateStartTimeout();
  }
};

const run = async () => {

  const noxPlayerPositions = getNoxPositions();

  Logger.log(`Calibrating ${noxPlayerPositions.length} Nox Player location(s)...`);
  Logger.debug('Positions:', noxPlayerPositions);

  const adb = getADBDevices();

  if(adb.length !== noxPlayerPositions.length) {
    Logger.error(`Found ${adb.length} devices via ADB but could only find ${noxPlayerPositions.length} instances in Windows. Something is wrong.`);
  }

  // do different things if we calibrate than if we don't
  if(OPTIONS.NOX_CALIBRATE) {
    noxPlayerPositions.forEach((loc, i) => {
      repositionNoxWindow(loc, i);
    });

    await calibrateNoxPositions(noxInstances, adb);

    noxInstances.forEach((loc) => {
      if(loc.adb) return;
      Logger.error(`Found a Nox when calibrating with no ADB set. We can't keep doing this, captain. We're going to remove that Nox.`);
    });

    noxInstances = noxInstances.filter(x => x.adb);

    noxInstances.forEach((nox, i) => poll(i, WINDOW_STATES.UNKNOWN));

  // run the nox instances in order, same order as adb
  } else {
    noxPlayerPositions.forEach((loc, i) => {
      repositionNoxWindow(loc, i);
  
      noxInstances[i].adb = adb[i];
      poll(i, WINDOW_STATES.UNKNOWN);
    });
  }
};

run();

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
