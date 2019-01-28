

const winpos = require('winpos');
const pixcolor = require('pixcolor');
const robot = require('robotjs');

const { OPTIONS } = require('./src/helpers/env');

const { WINDOW_STATES } = require('./src/window/window.states');
const { WINDOW_TRANSITIONS } = require('./src/window/window.transitions');
const { WINDOW_INFORMATION } = require('./src/window/window.information');
const { windowName } = require('./src/helpers/window');

const Logger = require('./src/helpers/logger');

// the nox header height
const NOX_HEADER_HEIGHT = OPTIONS.NOX_HEADER_HEIGHT;
const NOX_SIDEBAR_WIDTH = 40;

// track all of the current nox instance data
const noxInstances = [];

// get the current state based on the nox instance Left/Top
const getState = (x, y) => {

  let foundScreen = WINDOW_STATES.UNKNOWN;

  Object.keys(WINDOW_INFORMATION).forEach(screenId => {

    // if we have a screen we're on, or we're checking for unknown - don't.
    if(foundScreen || screenId === `${WINDOW_STATES.UNKNOWN}`) return;

    // if we can't find information on this screen id, it doesn't exist.
    const screen = WINDOW_INFORMATION[screenId];
    if(!screen) return;

    // if they have a pos of 0/0 they're probably not set up correctly, so we skip them.
    if(screen.pos.x === 0 || screen.pos.y === 0) {
      Logger.verbose(`Skipping ${screenId} (${windowName(screenId)})...`);
      return;
    }

    const screenX = x + screen.pos.x;
    const screenY = y + screen.pos.y + NOX_HEADER_HEIGHT;

    // get the color of the pixel at that particular location
    const hexColor = pixcolor([screenX, screenY + NOX_HEADER_HEIGHT], true);

    // move the mouse to the location in debug mode only
    if(OPTIONS.DEBUG_STATES[windowName(foundScreen)]) robot.moveMouse(screenX, screenY + NOX_HEADER_HEIGHT);

    // if we have a color set for this screen
    if(screen.hex) {
      Logger.verbose('SCREEN CHECK', windowName(screenId), 'foundcolor', hexColor, 'desiredcolor', screen.hex, 'x', screenX, 'y', screenY, 'match', hexColor === screen.hex);

      // if it matches, we have our screen
      if(screen.hex === hexColor) foundScreen = screenId;

    // should only happen when adding a new screen
    } else {
      Logger.verbose('POTENTIAL SCREEN', windowName(screenId), screenX, screenY, hexColor);

    }
  });

  return foundScreen;
};

// poll the nox instance
const poll = (noxIdx, lastState = WINDOW_STATES.UNKNOWN) => {
  const noxVmInfo = noxInstances[noxIdx];
  const { left, top } = noxVmInfo;

  const state = getState(left, top);
  const oldTransitions = WINDOW_TRANSITIONS[lastState];
  const curTransitions = WINDOW_TRANSITIONS[state];

  Logger.debug('-----------> FOUND STATE', windowName(state));

  // we only change state if it's a new state
  if(state !== lastState && state !== WINDOW_STATES.UNKNOWN) {
    Logger.log(`[Nox ${noxIdx}]`, 'New State', windowName(state));

    if(oldTransitions && oldTransitions.onLeave) {
      Logger.debug('===========> TRANSITION:LEAVE', windowName(lastState));
      oldTransitions.onLeave(noxVmInfo);
    }

    if(curTransitions && curTransitions.onEnter) {
      Logger.debug('===========> TRANSITION:ENTER', windowName(state));
      curTransitions.onEnter(noxVmInfo);
    }
    

  } else if(state === lastState) {
    if(curTransitions && curTransitions.onRepeat) {
      Logger.debug('===========> TRANSITION:REPEAT', windowName(state));
      curTransitions.onRepeat(noxVmInfo);
    }
    
  }

  // do it again
  setTimeout(() => poll(noxIdx, state), OPTIONS.POLL_RATE);
};

const run = async() => {

  let noxPlayerPositions = [];

  try {
    noxPlayerPositions = winpos(OPTIONS.NOX_WINDOW_NAME, true);
  } catch(e) {
    Logger.error(e);
    process.exit(1);
  }

  Logger.log(`Calibrated ${noxPlayerPositions.length} Nox Player location(s)... do not move them!`);
  Logger.debug('Positions:', noxPlayerPositions);

  noxPlayerPositions.forEach((loc, i) => {
    noxInstances[i] = {
      state: WINDOW_STATES.UNKNOWN,
      left: loc.Left,
      top: loc.Top,
      width: loc.Right - loc.Left,
      height: loc.Bottom - loc.Top,

      headerHeight: NOX_HEADER_HEIGHT,
      sidebarWidth: NOX_SIDEBAR_WIDTH,

      vmHeight: OPTIONS.NOX_RES_HEIGHT,
      vmWidth: OPTIONS.NOX_RES_WIDTH
    };
    poll(i, WINDOW_STATES.UNKNOWN);
  });
};

run();
