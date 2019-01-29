const argv = require('minimist')(process.argv.slice(2));

const isUndefined = (val) => typeof val === 'undefined';

module.exports = {
  OPTIONS: {
    POLL_RATE: isUndefined(argv['poll-rate'])                 ? 500           : argv['poll-rate'],            
    AUTO_TAP_ATTACK: isUndefined(argv['auto-tap-attack'])     ? false         : argv['auto-tap-attack'],
    FARM_EVERYTHING: isUndefined(argv['farm-everything'])     ? true          : argv['farm-everything'],
    RUSH_RETRIES: isUndefined(argv['rush-retries'])           ? 3             : argv['rush-retries'],
    SWIPE_DURATION: isUndefined(argv['swipe-duration'])       ? 100           : argv['swipe-duration'],

    DEBUG_STATES: isUndefined(argv['debug-pointer'])          ? []            : argv['debug-pointer'].split(',').reduce((prev, cur) => { prev[cur] = true; return prev; }, {}),
    DEBUG: isUndefined(argv['debug'])                         ? false         : argv['debug'],
    VERBOSE: isUndefined(argv['verbose'])                     ? false         : argv['verbose'],

    HOMESCREEN_APP_X: isUndefined(argv['homescreen-app-x'])   ? 525           : argv['homescreen-app-x'],
    HOMESCREEN_APP_Y: isUndefined(argv['homescreen-app-y'])   ? 330           : argv['homescreen-app-y'],

    NOX_HEADER_HEIGHT: isUndefined(argv['nox-header-height']) ? 30            : argv['nox-header-height'],
    NOX_SIDEBAR_WIDTH: isUndefined(argv['nox-sidebar-width']) ? 40            : argv['nox-sidebar-width'],
    NOX_WINDOW_NAME: isUndefined(argv['nox-window-name'])     ? 'NoxPlayer'   : argv['nox-window-name'],
    NOX_RES_WIDTH: isUndefined(argv['nox-res-width'])         ? 720           : argv['nox-res-width'],
    NOX_RES_HEIGHT: isUndefined(argv['nox-res-height'])       ? 1280          : argv['nox-res-height']
  }
};
