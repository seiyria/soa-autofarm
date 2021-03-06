
import { ipcRenderer, remote } from 'electron';
import fs from 'fs';

import Vue from 'vue/dist/vue.js';
import VueFilterDateFormat from 'vue-filter-date-format';

Vue.use(VueFilterDateFormat);

const DEFAULT_OPTIONS = {
  'allow-m3': false,
  'app-kill-threshold': 600,
  'auto-tap-attack': false,
  'auto-refresh-stam': false,
  'farm-everything': false,
  'farm-single': false,
  'farm-story': false,
  'is-jp': false,
  'host-event': 0,
  'host-mission': 0,
  'host-quit-delay': 30000,
  'host-stam-percent': 0,
  'host-start-delay': 5000,
  'host-story': false,
  'mouse-hover-block': false,
  'nox-allow-move': false,
  'party-quit-delay': 30000,
  'poll-rate': 750,
  'post-combat-wait': 1,
  'restart-delay': 10800000,
  'retry-fail-attempts': 10,
  'rush-delay': 1000,
  'rush-retry-delay': 5000,
  'rush-tries': 1,
  'safety-radius': 0,
  'safety-threshold': 0,
  'skip-achievements': false,
  'skip-gifts': false,
  'specific-event': 0,
  'specific-mission': 0,
  'single-event': 0,
  'single-mission': 0,
  'stats': true,
  'swipe-duration': 100,
  'spawnsync-delay': 100,
  'unknown-click': false,

  'app-homescreen-x': 525,
  'app-homescreen-y': 160,
  'debug': false,
  'debug-pointer': '',
  'ignore-click': false,
  'nox-adb-path': 'C:\\Program Files\\Nox\\bin\\nox_adb.exe',
  'nox-path': 'C:\\Program Files\\Nox\\bin\\Nox.exe',
  'nox-calibrate': true,
  'nox-header-height': 30,
  'nox-res-width': 720,
  'nox-res-height': 1280,
  'nox-sidebar-width': 40,
  'nox-window-name': 'NoxPlayer',
  'verbose': false,
  'repl': false,
  'log-colors': false
};

const vue = new Vue({
  el: '#app',

  data: {
    isStarting: false,
    isRunning: false,
    isStopping: false,

    statusMessage: '',
    statusType: '',

    state: [],

    cliEnv: Object.assign({}, DEFAULT_OPTIONS),

    groups: [
      {
        name: 'Farm Settings',

        fields: [
          { name: 'Farm Random Events?', val: 'farm-everything', type: 'checkbox',
            desc: 'When checked, will hit the "Join All" button on the event page to farm anything available.',
            setTo: [
              { name: 'farm-story', val: false },
              { name: 'farm-single', val: false }
            ] },
          { name: 'Farm Story?', val: 'farm-story', type: 'checkbox',
            desc: 'When checked, will hit the "Join All" button on the missions (story) page to farm any story mission in your current map.',
            setTo: [
              { name: 'farm-everything', val: false }
            ] },
          { name: 'Farm In Single Player?', val: 'farm-single', type: 'checkbox',
            desc: 'When checked, will farm in single player mode instead of multiplayer.',
            setTo: [
              { name: 'farm-everything', val: false }
            ]
          }
        ],

        explainer(cliEnv) {
          if(cliEnv['farm-everything']) return 'Farming every event and mission possible, randomly, using Join All.';
          if(cliEnv['farm-story']) return 'Farming exclusively story missions.';
          if(cliEnv['farm-single']) return 'Farming in single player mode.';

          return 'Not farming anything from this category. You might be doing specific missions or events.';
        }
      },

      {
        name: 'Host Settings',

        fields: [
          { name: 'Event', val: 'host-event', type: 'number', min: 0,
            desc: 'The desired event number to host. 0 = disable. 1 = top event. Will not scroll down.',
            setTo: [
              { name: 'host-story', val: false }
            ] },
          { name: 'Mission', val: 'host-mission', type: 'number', min: 0,
            desc: 'The desired mission number to host. 0 = disable. 1 = top event. Will not scroll down.',
            setTo: [
              { name: 'host-story', val: false }
            ]  },
          { name: 'Start Delay', val: 'host-start-delay', type: 'number', min: 1000,
            desc: 'The delay between the first person joining your room, and you hitting the start button.' },
          { name: 'Quit Delay', val: 'host-quit-delay', type: 'number', min: 5000,
            desc: 'The delay between you quitting and creating a new room after no one joins it.' },
          { name: 'Stamina %', val: 'host-stam-percent', type: 'number', min: 0, max: 95,
            desc: 'The stamina % you want to host. This program doesn\'t do your math homework - shoot for 50-70% in general. 0 = disable.' },
          { name: 'Host Story?', val: 'host-story', type: 'checkbox',
            desc: 'When checked, will host the current story mission.',
            setTo: [
              { name: 'host-event', val: 0 },
              { name: 'host-mission', val: 0 }
            ] }
        ],

        explainer(cliEnv) {
          if(!+cliEnv['host-stam-percent']) return 'Unable to host. Stamina % must be > 0 to enable hosting.';
          if(cliEnv['host-story']) return 'Hosting story mode explicitly. Will not host anything else.';

          const hostEv = +cliEnv['host-event'];
          const hostMi = +cliEnv['host-mission'];

          if(hostEv && hostMi) return `Hosting specifically event ${hostEv} and mission ${hostMi}. Will not host if you are hosting specific event. This is for "farm everything" mode. To make it work while farming a specific event, set Host Event to 0.`;
          if(!hostEv && hostMi) return `Hosting specifically mission ${hostMi}, which will work even if you are farming a specific event. This is for "farm specific" mode. To make it work for "farm everything" mode, set the Host Event to a number.`;

          return 'Not hosting anything, despite having Stamina % set.';
        }
      },

      {
        name: 'Event Farm Settings',

        fields: [
          { name: 'Event', val: 'specific-event', type: 'number', min: 0,
            desc: 'The desired event number to farm. 0 = disable. 1 = top event. Will not scroll down.' },
          { name: 'Mission', val: 'specific-mission', type: 'number', min: 0,
            desc: 'The desired mission number to farm. 0 = disable. 1 = top event. Will not scroll down.' }
        ],

        explainer(cliEnv) {
          const specificEv = +cliEnv['specific-event'];
          const specificMi = +cliEnv['specific-mission'];

          if(specificEv && specificMi) return `Farming specifically event ${specificEv} and mission ${specificMi}.`;
          if(specificEv && !specificMi) return `Farming specifically event ${specificEv}, using Join All to find a mission.`;

          return 'Not farming a specific event or mission.';
        }
      },

      {
        name: 'Solo Farm Settings',

        fields: [
          { name: 'Event', val: 'single-event', type: 'number', min: 0,
            desc: 'The desired event number to SOLO farm. Only active when Single Player Farming. 0 = disable. 1 = top event. Will not scroll down.' },
          { name: 'Mission', val: 'single-mission', type: 'number', min: 0,
            desc: 'The desired event number to SOLO farm. Only active when Single Player Farming. 0 = disable. 1 = top event. Will not scroll down.' }
        ],

        explainer(cliEnv) {
          const specificEv = +cliEnv['single-event'];
          const specificMi = +cliEnv['single-mission'];

          if(specificEv && specificMi) return `Solo-farming specifically event ${specificEv} and mission ${specificMi}.`;

          return 'Not solo-farming a specific event or mission.';
        }
      },

      {
        name: 'Party Settings',

        fields: [
          { name: 'Retry Attempts', val: 'retry-fail-attempts', type: 'number', min: 0,
            desc: 'The number of attempts to "retry" looking for a lobby before killing the app (prevents accidental stuckness).' },
          { name: 'Quit Delay', val: 'party-quit-delay', type: 'number', min: 5000,
            desc: 'The delay between joining a party room and quitting (in case the host does not start in a reasonable timeframe).' },
          { name: 'Post Combat Ticks', val: 'post-combat-wait', type: 'number', min: 0,
            desc: 'The number of ticks to wait at the follow/block screen, in case you want to follow someone back. Higher = more delay.' },
          { name: 'Allow M3?', val: 'allow-m3', type: 'checkbox',
            desc: 'Want to enable this for M3 related content? If disabled, you will leave lobbies that say "Unable to Revive".' },
          { name: 'Stamp: Join', val: 'stamp-join', type: 'number', min: 0, max: 4,
            desc: 'The stamp to post when you join a room. Only supports 1, 2, 3, 4. 0 = disable.' },
        ]
      },

      {
        name: 'Rush Settings',

        fields: [
          { name: 'Rush Delay', val: 'rush-delay', type: 'number', min: 0,
            desc: 'The delay between the first person rushing, and you hitting the rush button. Recommended to be >1000ms due to lag on first rush.' },
          { name: 'Rush Attempts', val: 'rush-tries', type: 'number', min: 0,
            desc: 'The number of times you attempt to click the rush button. Recommended to be >3 due to lag sometimes making it not work correctly.' },
          { name: 'Rush Retry Delay', val: 'rush-retry-delay', type: 'number', min: 0,
            desc: 'The delay between rush attempts. Recommended to be >5000ms due to lag between character rushes.' },
          { name: 'Rush When Possible?', val: 'rush-minmax', type: 'checkbox',
            desc: 'If you want to rush when everyone is able to (either dead, or full rush) then turn this on. It might be a bit more procesor-intensive, though.' },
        ]
      },

      { name: 'Miscellaneous Settings',
    
        fields: [
          { name: 'Is JP?', val: 'is-jp', type: 'checkbox',
            desc: 'Playing on JP?' },
          { name: 'Don\'t Click?', val: 'ignore-click', type: 'checkbox',
            desc: 'Whether or not the app should click for you. Useful to pause your farming for whatever reason. Also available as a quick action.' },
          { name: 'Skip Achievements?', val: 'skip-achievements', type: 'checkbox',
            desc: 'Whether or not you want it to get achievements for you. You probably do.' },
          { name: 'Skip Gifts?', val: 'skip-gifts', type: 'checkbox',
            desc: 'Whether or not you want it to get gifts for you. This is spotty and difficult to support for some reason, so it is recommended to be off.' },
          { name: 'Mouse Block Clicks?', val: 'mouse-hover-block', type: 'checkbox',
            desc: 'Does not work at this time.' },
          { name: 'Click On Unknown?', val: 'unknown-click', type: 'checkbox',
            desc: 'Click in areas likely to dismiss the "UNKNOWN" state. Clicking is sparse, but saves you from getting to an app reset.' },
          { name: 'Auto Refresh Stam?', val: 'auto-refresh-stam', type: 'checkbox',
            desc: 'Whether or not to automatically refresh stamina when you run out and are hosting / Single Player Farming.' },
          { name: 'Swipe Duration', val: 'swipe-duration', type: 'number', min: 0,
            desc: 'The default swipe duration for the app. The game seems to recognize a swipe duration of >100ms, but you can mess with it if you really want, \'kay?' },
          { name: 'Safety Radius', val: 'safety-radius', type: 'number', min: 0,
            desc: 'Whether or not to check pixels near the current one for the right color. It is a possibly useful thing, but it may or may not be for you. Higher numbers = more processing.' },
          { name: 'Safety Threshold', val: 'safety-threshold', type: 'number', min: 0,
            desc: 'How flexible the pixel checker should be (in %). 0 = exact match. Can create false positives the higher you go.' },
          { name: 'Poll Rate', val: 'poll-rate', type: 'number', min: 250,
            desc: 'How often to check the screen. Too low of a number will freeze the Nox VM, so be careful. One tick = the poll rate.' },
          { name: 'SpawnSync Delay', val: 'spawnsync-delay', type: 'number', min: 100,
            desc: 'Delay between running a command and killing the terminal. If you get spawnSync errors, increase this until you don\'t.' }
        ]
      },

      {
        name: 'Nox Settings',

        fields: [
          { name: 'ADB Path', val: 'nox-adb-path', type: 'text',
            desc: 'The path to your nox_adb.exe file.' },
          { name: 'Nox Path', val: 'nox-path', type: 'text',
            desc: 'The path to your Nox.exe file.' },
          { name: 'Window Name', val: 'nox-window-name', type: 'text',
            desc: 'The name of your window. It doesn\'t have to be exact, it just has to contain this value.' },
          { name: 'VM Name(s)', val: 'nox-vm-names', type: 'text',
            desc: 'A comma-separated list of your VMs. Should be ordered in the display order of your VMs on your screen. Typically formatted like Nox_X. If set, instead of killing app and returning to homescreen, will kill the VM and restart it. REQUIRES A RESTART TO WORK CORRECTLY.' },
          { name: 'Allow Move?', val: 'nox-allow-move', type: 'checkbox',
            desc: 'Check this if you plan to move the Nox windows around while playing. Not really recommended, but things happen.' },
          { name: 'Calibrate?', val: 'nox-calibrate', type: 'checkbox',
            desc: 'Not really sure why this is an option but if you set up your Nox VMs correctly you might not need to calibrate them. Only useful with >1 VM and will only trigger in that case anyway.' },
          { name: 'Header Height', val: 'nox-header-height', type: 'number', min: 0,
            desc: 'The height of the Nox header-bar. It\'s 30px, but if you want to customize it, here you go. I\'m not your dad, you do what you want.' },
          { name: 'Sidebar Width', val: 'nox-sidebar-width', type: 'number', min: 0,
            desc: 'The width of the Nox side bar. I don\'t even think this value is used in the program, but such is life.' },
          { name: 'VM Res Width', val: 'nox-res-width', type: 'number', min: 0,
            desc: 'The width of the Nox VM (internally). Unless you have a real reason not to, you should probably only have it set to 720.' },
          { name: 'VM Res Height', val: 'nox-res-height', type: 'number', min: 0,
            desc: 'The height of the Nox VM (internally). Unless you have a real reason not to, you should probably only have it set to 1280.' }
        ]
      },

      {
        name: 'App Lifecycle Settings',

        fields: [
          { name: 'Kill Threshold', val: 'app-kill-threshold', type: 'number', min: 0,
            desc: 'The number of ticks to trigger an app kill. This can help if the app freezes for some reason.' },
          { name: 'Restart Delay', val: 'restart-delay', type: 'number', min: -1,
            desc: 'The delay between opening and restarting the app. When a restart is triggered, the app will kill and reload to free memory. The default is some absurd number like 3 hours. You may not need this, but you should have it anyway. -1 to disable.' },
          { name: 'Homescreen X', val: 'app-homescreen-x', type: 'number', min: 0,
            desc: 'The X position of the app on the homescreen. Eventually there will be a tool to get the x/y where you click, but this is not there yet.' },
          { name: 'Homescreen Y', val: 'app-homescreen-y', type: 'number', min: 0,
            desc: 'The Y position of the app on the homescreen. Eventually there will be a tool to get the x/y where you click, but this is not there yet.' }
        ]
      },

      {
        name: 'Debug Settings',

        fields: [
          { name: 'Debug?', val: 'debug', type: 'checkbox',
            desc: 'If you want to spit out log files, this is pretty cool.' },
          { name: 'Verbose?', val: 'verbose', type: 'checkbox',
            desc: 'If you want really noisy log files, this is super cool.' },
          { name: 'Log Colors?', val: 'log-colors', type: 'checkbox',
            desc: 'If you want to log potential screen colors for adding new screens, this is super cool.' },
          { name: 'Debug Pointer(s)', val: 'debug-pointer', type: 'text',
            desc: 'This doesn\'t even work at the moment, but I\'ll fix it one of these times.' }
        ]
      }
    ]
  },

  methods: {
    run() {
      this.resetStatus();
      this.isStarting = true;
      ipcRenderer.send('run', this.cliEnv);
    },
    stop() {
      this.isStopping = true;
      ipcRenderer.send('stop');
    },

    saveConfig() {
      const path = remote.dialog.showSaveDialog({ title: 'Save Config', defaultPath: process.cwd() + '/config.soaafconfig' });
      fs.writeFileSync(path, JSON.stringify(this.cliEnv, null, 4), 'utf-8');
      alert(`Saved config to ${path}.`)
    },
    loadConfig() {
      const path = remote.dialog.showOpenDialog({ title: 'Load Config', defaultPath: process.cwd() + '/config.soaafconfig' });
      const fileData = fs.readFileSync(path[0], 'utf-8');

      try {
        const data = JSON.parse(fileData);
        this.cliEnv = Object.assign({}, this.cliEnv, data);
        this.update();
        alert(`Loaded config from ${path}!`);
      } catch(e) {
        alert(e);
      }

    },
    resetConfig() {
      this.cliEnv = Object.assign({}, DEFAULT_OPTIONS);
    },

    updateEnvValue(fieldData) {
      if(this.cliEnv[fieldData.val] && fieldData.setTo) {
        fieldData.setTo.forEach(({ name, val }) => {
          this.cliEnv[name] = val;
        });
      }

      this.update();
    },
    update() {
      localStorage.cliOpts = JSON.stringify(this.cliEnv);

      if(this.isRunning) {
        ipcRenderer.send('options', this.cliEnv);
      }
    },

    toggleClick() {
      this.cliEnv['ignore-click'] = !this.cliEnv['ignore-click'];
      this.update();
    },

    callreplkey(key) {
      ipcRenderer.send('replkey', key);
    },

    resetStatus() {
      this.statusType = '';
      this.statusMessage = '';
    },
    setStatus(status) {
      this.statusType = status.type;
      this.statusMessage = status.value;
    },

    setState(state) {
      this.state = state.map(s => {
        s.stateWhen = new Date(s.stateWhen);
        return s;
      });
    }
  },

  mounted() {
    if(localStorage.cliOpts) {
      this.cliEnv = Object.assign({}, DEFAULT_OPTIONS, JSON.parse(localStorage.cliOpts));
    }

    ipcRenderer.on('running', () => {
      vue.isRunning = true;
      vue.isStarting = false;
    });
    
    ipcRenderer.on('stopped', (_, hasError) => {
      vue.isRunning = false;
      vue.isStopping = false;

      if(hasError) {
        const err = hasError === true ? 'Check the log file for more details.' : hasError;

        this.setStatus({ type: 'danger', value: err });
      } else {
        this.resetStatus();
      }
    });

    ipcRenderer.on('status', (_, status) => {
      this.setStatus(status);
    });

    ipcRenderer.on('state', (_, states) => {
      this.setState(states);
    });
  }
});