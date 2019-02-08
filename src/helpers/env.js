const argv = require('minimist')(process.argv.slice(2));

const isUndefined = (val) => typeof val === 'undefined';

module.exports = {
  OPTIONS: {
    POLL_RATE: isUndefined(argv['poll-rate'])                 ? 750           : argv['poll-rate'],            
    AUTO_TAP_ATTACK: isUndefined(argv['auto-tap-attack'])     ? false         : argv['auto-tap-attack'],
    FARM_EVERYTHING: isUndefined(argv['farm-everything'])     ? true          : argv['farm-everything'],
    RUSH_RETRIES: isUndefined(argv['rush-tries'])             ? 1             : argv['rush-tries'],
    RUSH_DELAY: isUndefined(argv['rush-delay'])               ? 1000          : argv['rush-delay'],
    SWIPE_DURATION: isUndefined(argv['swipe-duration'])       ? 100           : argv['swipe-duration'],
    SKIP_ACHIEVEMENTS: isUndefined(argv['skip-achievements']) ? false         : argv['skip-achievements'],
    SKIP_GIFTS: isUndefined(argv['skip-gifts'])               ? false         : argv['skip-gifts'],
    MOUSE_BLOCK: isUndefined(argv['mouse-hover-block'])       ? false         : argv['mouse-hover-block'],
    PARTY_QUIT_DELAY: isUndefined(argv['party-quit-delay'])   ? 30000         : argv['party-quit-delay'],
    IS_JP: isUndefined(argv['is-jp'])                         ? false         : argv['is-jp'],
    APP_KILL_COUNT: isUndefined(argv['app-kill-threshold'])   ? 600           : argv['app-kill-threshold'],
    FARM_MISSIONS: isUndefined(argv['farm-story'])            ? false         : argv['farm-story'],
    SPECIFIC_EVENT: isUndefined(argv['specific-event'])       ? false         : argv['specific-event'],
    SPECIFIC_MISSION: isUndefined(argv['specific-mission'])   ? false         : argv['specific-mission'],
    SAFETY_RADIUS: isUndefined(argv['safety-radius'])         ? 0             : argv['safety-radius'],
    RETRY_FAIL_ATT: isUndefined(argv['retry-fail-attempts'])  ? 10            : argv['retry-fail-attempts'],
    HOST_STAM_PERCENT: isUndefined(argv['host-stam-percent']) ? 0             : argv['host-stam-percent'],
    HOST_EVENT: isUndefined(argv['host-event'])               ? 0             : argv['host-event'],
    HOST_MISSION: isUndefined(argv['host-mission'])           ? 0             : argv['host-mission'],
    HOST_STORY: isUndefined(argv['host-story'])               ? false         : argv['host-story'],
    HOST_QUIT_DELAY: isUndefined(argv['host-quit-delay'])     ? 30000         : argv['host-quit-delay'],
    HOST_START_DELAY: isUndefined(argv['host-start-delay'])   ? 5000          : argv['host-start-delay'],

    DEBUG_STATES: isUndefined(argv['debug-pointer'])          ? []            : argv['debug-pointer'].split(',').reduce((prev, cur) => { prev[cur] = true; return prev; }, {}),
    DEBUG: isUndefined(argv['debug'])                         ? false         : argv['debug'],
    VERBOSE: isUndefined(argv['verbose'])                     ? false         : argv['verbose'],
    REPL: isUndefined(argv['repl'])                           ? true          : argv['repl'],
    NO_CLICK: isUndefined(argv['no-click'])                   ? false         : argv['no-click'],

    HOMESCREEN_APP_X: isUndefined(argv['homescreen-app-x'])   ? 495           : argv['homescreen-app-x'],
    HOMESCREEN_APP_Y: isUndefined(argv['homescreen-app-y'])   ? 160           : argv['homescreen-app-y'],

    NOX_HEADER_HEIGHT: isUndefined(argv['nox-header-height']) ? 30            : argv['nox-header-height'],
    NOX_SIDEBAR_WIDTH: isUndefined(argv['nox-sidebar-width']) ? 40            : argv['nox-sidebar-width'],
    NOX_WINDOW_NAME: isUndefined(argv['nox-window-name'])     ? 'NoxPlayer'   : argv['nox-window-name'],
    NOX_RES_WIDTH: isUndefined(argv['nox-res-width'])         ? 720           : argv['nox-res-width'],
    NOX_RES_HEIGHT: isUndefined(argv['nox-res-height'])       ? 1280          : argv['nox-res-height'],
    NOX_ALLOW_MOVE: isUndefined(argv['nox-allow-move'])       ? false         : argv['nox-allow-move'],
    NOX_CALIBRATE: isUndefined(argv['nox-calibrate'])         ? false         : argv['nox-calibrate'],

    NOX_ADB_PATH: isUndefined(argv['nox-adb-path'])           ? 'D:\\Program Files\\Nox\\bin\\nox_adb.exe' : argv['nox-adb-path']
  }
};
