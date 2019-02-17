
import { ipcRenderer, remote } from 'electron';
import fs from 'fs';

import Vue from 'vue/dist/vue.js';

const vue = new Vue({
  el: '#app',

  data: {
    isStarting: false,
    isRunning: false,
    isStopping: false,

    cliEnv: {
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
      'restart-delay': 10800000,
      'retry-fail-attempts': 10,
      'rush-delay': 1000,
      'rush-retry-delay': 5000,
      'rush-trues': 1,
      'safety-radius': 0,
      'safety-threshold': 0,
      'skip-achievements': false,
      'skip-gifts': false,
      'specific-event': 0,
      'specific-mission': 0,
      'stats': true,
      'swipe-duration': 100,

      'app-homescreen-x': 525,
      'app-homescreen-y': 160,
      'debug': false,
      'debug-pointer': '',
      'ignore-click': false,
      'nox-adb-path': 'C:\\Program Files\\Nox\\bin\\nox_adb.exe',
      'nox-calibrate': true,
      'nox-header-height': 30,
      'nox-res-width': 720,
      'nox-res-height': 1080,
      'nox-sidebar-width': 40,
      'nox-window-name': 'NoxPlayer',
      'verbose': false,
      'repl': false
    },

    groups: [
      {
        name: 'Farm Settings',

        fields: [
          { name: 'Farm Random Events?', val: 'farm-everything', type: 'checkbox',
            setTo: [
              { name: 'farm-story', val: false }
            ] },
          { name: 'Farm Story?', val: 'farm-story', type: 'checkbox',
            setTo: [
              { name: 'farm-everything', val: false }
            ] },
          { name: 'Farm In Single Player?', val: 'farm-single', type: 'checkbox' }
        ]
      },

      {
        name: 'Host Settings',

        fields: [
          { name: 'Event', val: 'host-event', type: 'number', min: 0 },
          { name: 'Mission', val: 'host-mission', type: 'number', min: 0 },
          { name: 'Start Delay', val: 'host-start-delay', type: 'number', min: 1000 },
          { name: 'Quit Delay', val: 'host-quit-delay', type: 'number', min: 5000 },
          { name: 'Stamina %', val: 'host-stam-percent', type: 'number', min: 0, max: 95 },
          { name: 'Host Story?', val: 'host-story', type: 'checkbox' }
        ]
      },

      {
        name: 'Event Farm Settings',

        fields: [
          { name: 'Event', val: 'specific-event', type: 'number', min: 0 },
          { name: 'Mission', val: 'specific-mission', type: 'number', min: 0 }
        ]
      },

      {
        name: 'Solo Farm Settings',

        fields: [
          { name: 'Event', val: 'single-event', type: 'number', min: 0 },
          { name: 'Mission', val: 'single-mission', type: 'number', min: 0 }
        ]
      },

      {
        name: 'Party Settings',

        fields: [
          { name: 'Retry Attempts', val: 'retry-fail-attempts', type: 'number', min: 0 },
          { name: 'Quit Delay', val: 'party-quit-delay', type: 'number', min: 5000 }
        ]
      },

      {
        name: 'Rush Settings',

        fields: [
          { name: 'Rush Delay', val: 'rush-delay', type: 'number', min: 0 },
          { name: 'Rush Attempts', val: 'rush-tries', type: 'number', min: 0 },
          { name: 'Rush Retry Delay', val: 'rush-retry-delay', type: 'number', min: 0 }
        ]
      },

      { name: 'Miscellaenous Settings',
    
        fields: [
          { name: 'Is JP?', val: 'is-jp', type: 'checkbox' },
          { name: 'Don\'t Click?', val: 'ignore-click', type: 'checkbox' },
          { name: 'Skip Achievements?', val: 'skip-achievements', type: 'checkbox' },
          { name: 'Skip Gifts?', val: 'skip-gifts', type: 'checkbox' },
          { name: 'Mouse Block Clicks?', val: 'mouse-hover-block', type: 'checkbox' },
          { name: 'Auto Refresh Stam?', val: 'auto-refresh-stam', type: 'checkbox' },
          { name: 'Swipe Duration', val: 'swipe-duration', type: 'number', min: 0 },
          { name: 'Safety Radius', val: 'safety-radius', type: 'number', min: 0 },
          { name: 'Safety Threshold', val: 'safety-threshold', type: 'number', min: 0 },
          { name: 'Poll Rate', val: 'poll-rate', type: 'number', min: 250 }
        ]
      },

      {
        name: 'Nox Settings',

        fields: [
          { name: 'ADB Path', val: 'nox-adb-path', type: 'text' },
          { name: 'Window Name', val: 'nox-window-name', type: 'text' },
          { name: 'Allow Move?', val: 'nox-allow-move', type: 'checkbox' },
          { name: 'Calibrate?', val: 'nox-calibrate', type: 'checkbox' },
          { name: 'Header Height', val: 'nox-header-height', type: 'number', min: 0 },
          { name: 'Sidebar Width', val: 'nox-sidebar-width', type: 'number', min: 0 },
          { name: 'VM Res Width', val: 'nox-res-width', type: 'number', min: 0 },
          { name: 'VM Res Height', val: 'nox-res-height', type: 'number', min: 0 }
        ]
      },

      {
        name: 'App Lifecycle Settings',

        fields: [
          { name: 'Kill Threshold', val: 'app-kill-threshold', type: 'number', min: 0 },
          { name: 'Restart Delay', val: 'restart-delay', type: 'number', min: 0 },
          { name: 'Homescreen X', val: 'app-homescreen-x', type: 'number', min: 0 },
          { name: 'Homescreen Y', val: 'app-homescreen-y', type: 'number', min: 0 }
        ]
      },

      {
        name: 'Debug Settings',

        fields: [
          { name: 'Debug?', val: 'debug', type: 'checkbox' },
          { name: 'Verbose?', val: 'verbose', type: 'checkbox' },
          { name: 'Debug Pointer(s)', val: 'debug-pointer', type: 'text' }
        ]
      }
    ]
  },

  methods: {
    run() {
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

    updateEnvValue(fieldData) {
      if(fieldData.setTo) {
        fieldData.setTo.forEach(({ name, val }) => {
          this.cliEnv[name] = val;
        });
      }

      this.update();
    },
    update() {
      localStorage.cliOpts = JSON.stringify(this.cliEnv);
    },

    callreplkey(key) {
      ipcRenderer.send('replkey', key);
    }
  },

  mounted() {
    if(localStorage.cliOpts) {
      this.cliEnv = JSON.parse(localStorage.cliOpts);
    }

    ipcRenderer.on('running', () => {
      vue.isRunning = true;
      vue.isStarting = false;
    });
    
    ipcRenderer.on('stopped', (ev, hasError) => {
      vue.isRunning = false;
      vue.isStopping = false;

      if(hasError) {
        alert('Stopped due to an error. Check the log file for more details.');
      }
    });
  }
});