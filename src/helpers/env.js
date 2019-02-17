const argv = require('minimist')(process.argv.slice(2));

if(argv['help']) {
  console.log('--help Go look at the README.md!');
  process.exit(0);
}

const isUndefined = (val) => typeof val === 'undefined';

const buildOptions = (argv) => {
  return {
    POLL_RATE: isUndefined(argv['poll-rate'])                 ? 750           : argv['poll-rate'],            
    AUTO_TAP_ATTACK: isUndefined(argv['auto-tap-attack'])     ? false         : argv['auto-tap-attack'],
    FARM_EVERYTHING: isUndefined(argv['farm-everything'])     ? false         : argv['farm-everything'],
    RUSH_RETRIES: isUndefined(argv['rush-tries'])             ? 1             : argv['rush-tries'],
    RUSH_DELAY: isUndefined(argv['rush-delay'])               ? 1000          : argv['rush-delay'],
    RUSH_RETRY_DELAY: isUndefined(argv['rush-retry-delay'])   ? 5000          : argv['rush-retry-delay'],
    SWIPE_DURATION: isUndefined(argv['swipe-duration'])       ? 100           : argv['swipe-duration'],
    SKIP_ACHIEVEMENTS: isUndefined(argv['skip-achievements']) ? false         : argv['skip-achievements'],
    SKIP_GIFTS: isUndefined(argv['skip-gifts'])               ? false         : argv['skip-gifts'],
    MOUSE_BLOCK: isUndefined(argv['mouse-hover-block'])       ? false         : argv['mouse-hover-block'],
    PARTY_QUIT_DELAY: isUndefined(argv['party-quit-delay'])   ? 30000         : argv['party-quit-delay'],
    IS_JP: isUndefined(argv['is-jp'])                         ? false         : argv['is-jp'],
    APP_KILL_COUNT: isUndefined(argv['app-kill-threshold'])   ? 600           : argv['app-kill-threshold'],
    FARM_MISSIONS: isUndefined(argv['farm-story'])            ? false         : argv['farm-story'],
    SPECIFIC_EVENT: isUndefined(argv['specific-event'])       ? 0             : argv['specific-event'],
    SPECIFIC_MISSION: isUndefined(argv['specific-mission'])   ? 0             : argv['specific-mission'],
    SAFETY_RADIUS: isUndefined(argv['safety-radius'])         ? 0             : argv['safety-radius'],
    SAFETY_THRESHOLD: isUndefined(argv['safety-threshold'])   ? 0             : argv['safety-threshold'],
    RETRY_FAIL_ATT: isUndefined(argv['retry-fail-attempts'])  ? 10            : argv['retry-fail-attempts'],
    HOST_STAM_PERCENT: isUndefined(argv['host-stam-percent']) ? 0             : argv['host-stam-percent'],
    HOST_EVENT: isUndefined(argv['host-event'])               ? 0             : argv['host-event'],
    HOST_MISSION: isUndefined(argv['host-mission'])           ? 0             : argv['host-mission'],
    HOST_STORY: isUndefined(argv['host-story'])               ? false         : argv['host-story'],
    HOST_QUIT_DELAY: isUndefined(argv['host-quit-delay'])     ? 30000         : argv['host-quit-delay'],
    HOST_START_DELAY: isUndefined(argv['host-start-delay'])   ? 5000          : argv['host-start-delay'],
    RESTART_DELAY: isUndefined(argv['restart-delay'])         ? 10800000      : argv['restart-delay'],
    FARM_SINGLE: isUndefined(argv['farm-single'])             ? false         : argv['farm-single'],
    SINGLE_EVENT: isUndefined(argv['single-event'])           ? 0             : argv['single-event'],
    SINGLE_MISSION: isUndefined(argv['single-mission'])       ? 0             : argv['single-mission'],
    AUTO_REFRESH_STAM: isUndefined(argv['auto-refresh-stam']) ? false         : argv['auto-refresh-stam'],
    STATS: isUndefined(argv['stats'])                         ? true          : argv['stats'],

    DEBUG_STATES: isUndefined(argv['debug-pointer'])          ? []            : argv['debug-pointer'].split(',').reduce((prev, cur) => { prev[cur] = true; return prev; }, {}),
    DEBUG: isUndefined(argv['debug'])                         ? false         : argv['debug'],
    VERBOSE: isUndefined(argv['verbose'])                     ? false         : argv['verbose'],
    REPL: isUndefined(argv['repl'])                           ? true          : argv['repl'],
    NO_CLICK: isUndefined(argv['ignore-click'])               ? false         : argv['ignore-click'],

    HOMESCREEN_APP_X: isUndefined(argv['homescreen-app-x'])   ? 495           : argv['homescreen-app-x'],
    HOMESCREEN_APP_Y: isUndefined(argv['homescreen-app-y'])   ? 160           : argv['homescreen-app-y'],

    NOX_HEADER_HEIGHT: isUndefined(argv['nox-header-height']) ? 30            : argv['nox-header-height'],
    NOX_SIDEBAR_WIDTH: isUndefined(argv['nox-sidebar-width']) ? 40            : argv['nox-sidebar-width'],
    NOX_WINDOW_NAME: isUndefined(argv['nox-window-name'])     ? 'NoxPlayer'   : argv['nox-window-name'],
    NOX_RES_WIDTH: isUndefined(argv['nox-res-width'])         ? 720           : argv['nox-res-width'],
    NOX_RES_HEIGHT: isUndefined(argv['nox-res-height'])       ? 1280          : argv['nox-res-height'],
    NOX_ALLOW_MOVE: isUndefined(argv['nox-allow-move'])       ? false         : argv['nox-allow-move'],
    NOX_CALIBRATE: isUndefined(argv['nox-calibrate'])         ? true          : argv['nox-calibrate'],

    NOX_ADB_PATH: isUndefined(argv['nox-adb-path'])           ? 'C:\\Program Files\\Nox\\bin\\nox_adb.exe' : argv['nox-adb-path']
  };
};

let OPTIONS = buildOptions(argv);

const setOptions = (opts) => OPTIONS = buildOptions(opts);

const isEnvValid = (OPTIONS) => {

  // non-game options
  if(OPTIONS.POLL_RATE <= 100) return '--poll-rate too fast! Must be > 100.';
  if(OPTIONS.SWIPE_DURATION <= 50) return '--swipe-duration will not properly register as a swipe at <= 50.';

  // game related options
  if(OPTIONS.HOST_STAM_PERCENT > 95) return '--host-stam-percent should be < 95 (higher values are inaccurate).';
  if(OPTIONS.RETRY_FAIL_ATT <= 1) return '--retry-fail-attempts should be > 1 (you might see a lot more app quits otherwise).';
  if(OPTIONS.PARTY_QUIT_DELAY < 5000) return '--party-quit-delay should be at least 5000 (5s) or you will quit parties way too quickly.';
  if(OPTIONS.HOST_QUIT_DELAY < 5000) return '--host-quit-delay should be at least 5000 (5s) or you will cycle host lobbies way too quickly.';
  if(OPTIONS.HOST_START_DELAY < 1000) return '--host-start-delay should be at least 1000 (1s) to allow other people to join.'

  if(OPTIONS.FARM_EVERYTHING && OPTIONS.FARM_MISSIONS) return '--farm-story and --farm-everything specified. Choose one.';
  if(OPTIONS.FARM_SINGLE && OPTIONS.FARM_MISSIONS) return '--farm-story and --farm-single specified. Choose one.';
  if(OPTIONS.FARM_EVERYTHING && OPTIONS.FARM_SINGLE) return '--farm-single and --farm-everything specified. Choose one.';

  if(!OPTIONS.FARM_EVERYTHING
  && !OPTIONS.FARM_SINGLE
  && !OPTIONS.FARM_MISSIONS
  && !OPTIONS.SPECIFIC_EVENT) return 'One of the following is required: --farm-single, --farm-everything, --farm-story, --specific-event';

  if(OPTIONS.RUSH_RETRIES < 1) return '--rush-retries should be at least 1. You don\'t want to be that guy.';
  if(OPTIONS.RUSH_DELAY < 1000) return '--rush-delay should be at least 1000 (1s). You will not successfully rush otherwise.';

  if(OPTIONS.RESTART_DELAY < 3600000) return '--restart-delay should be at least 3600000 (1h) or you\'re not going to get anything done.';

  if(OPTIONS.FARM_SINGLE && !OPTIONS.SINGLE_EVENT) return '--farm-single specified but no --single-event.';
  if(OPTIONS.SINGLE_EVENT && OPTIONS.SPECIFIC_EVENT) return '--single-event and --specific-event specified. Choose one.';
  if(OPTIONS.SINGLE_MISSION && OPTIONS.SPECIFIC_MISSION) return '--single-mission and --specific-mission specified. Choose one.';

  if(OPTIONS.HOST_EVENT && !OPTIONS.HOST_STAM_PERCENT) return '--host-stam-percent must be set if you set --host-event.';

  // no error
  return '';
};

module.exports = {
  OPTIONS,
  isEnvValid,
  setOptions
};
