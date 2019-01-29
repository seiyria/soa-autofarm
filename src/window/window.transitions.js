const { OPTIONS } = require('../helpers/env');

const { WINDOW_STATES } = require('./window.states');

const { tryTransitionState, clickScreen } = require('../helpers/window');

const WINDOW_TRANSITIONS = {

  [WINDOW_STATES.UNKNOWN]: {},

  // priority states
  [WINDOW_STATES.HAS_GIFT]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.BRIDGE, WINDOW_STATES.GIFT_BOX);
    }
  },

  [WINDOW_STATES.HAS_ACHIEVEMENT_BRIDGE]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.BRIDGE, WINDOW_STATES.ACHIEVEMENTS);
    }
  },

  [WINDOW_STATES.HAS_ACHIEVEMENT_LIST]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN, WINDOW_STATES.ACHIEVEMENTS);
    }
  },

  [WINDOW_STATES.HAS_ACHIEVEMENT_MAP]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN_MAP, WINDOW_STATES.ACHIEVEMENTS);
    }
  },

  // android shit
  [WINDOW_STATES.ANDROID_HOMESCREEN]: {
    onRepeat: (noxVmInfo) => {
      clickScreen(noxVmInfo, OPTIONS.HOMESCREEN_APP_X, OPTIONS.HOMESCREEN_APP_Y);
    }
  },

  // other states
  [WINDOW_STATES.BRIDGE]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.BRIDGE, WINDOW_STATES.EVENT_SCREEN);
    }
  },

  [WINDOW_STATES.BRIDGE_UPDATE_NEWS]: {
    onRepeat: (noxVmInfo) => {
      clickScreen(noxVmInfo, 285, 850);
    }
  },

  [WINDOW_STATES.TITLE_SCREEN]: {
    onRepeat: (noxVmInfo) => {
      clickScreen(noxVmInfo, 250, 285);
    }
  },

  // GIFT BOX 
  [WINDOW_STATES.GIFT_BOX]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.GIFT_BOX, WINDOW_STATES.GIFT_BOX_MODAL);
    }
  },
  [WINDOW_STATES.GIFT_BOX_MODAL]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.GIFT_BOX_MODAL, WINDOW_STATES.GIFT_BOX);
    }
  },

  [WINDOW_STATES.GIFT_BOX_EMPTY]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.GIFT_BOX_EMPTY, WINDOW_STATES.BRIDGE);
    }
  },

  // ACHIEVEMENTS
  [WINDOW_STATES.ACHIEVEMENTS_AVAIL]: {
    onRepeat: (noxVmInfo) => {
      // repeatedly click the top achievement
      clickScreen(noxVmInfo, 250, 285);
    }
  },

  [WINDOW_STATES.ACHIEVEMENTS_MODAL]: {
    onRepeat: (noxVmInfo) => {
      // click the close button on the "earned achievement" modal
      clickScreen(noxVmInfo, 275, 580);
    }
  },

  [WINDOW_STATES.ACHIEVEMENTS]: {
    onRepeat: (noxVmInfo) => {
      // click the close button
      clickScreen(noxVmInfo, 280, 800);
    }
  },

  // EVENT LIST
  [WINDOW_STATES.EVENT_SCREEN]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN, WINDOW_STATES.EVENT_JOIN_ALL);
    }
  },
  
  [WINDOW_STATES.EVENT_SCREEN_MAP]: {
    onRepeat: (noxVmInfo) => {
      // for now, just join all
      // TODO allow for joining a custom slot
      if(OPTIONS.FARM_EVERYTHING) {
        clickScreen(noxVmInfo, 85, 855);
        return;
      }

      tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN_MAP, WINDOW_STATES.EVENT_JOIN_ALL);
    }
  },

  [WINDOW_STATES.EVENT_SCREEN_MISSION]: {
    onRepeat: (noxVmInfo) => {
      // for now, just join all
      // TODO allow for joining a custom slot
      if(OPTIONS.FARM_EVERYTHING) {
        clickScreen(noxVmInfo, 85, 855);
        return;
      }

      tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN_MISSION, WINDOW_STATES.EVENT_JOIN_ALL);
    }
  },

  [WINDOW_STATES.EVENT_JOIN_ALL]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_JOIN_ALL, WINDOW_STATES.MISSION_START_MP_MATCH);
    }
  },

  [WINDOW_STATES.EVENT_SCREEN_STORY]: {
    onRepeat: (noxVmInfo) => {
      clickScreen(noxVmInfo, 180, 530);
    }
  },

  // MISSION
  [WINDOW_STATES.MISSION_START_MP]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_MP, WINDOW_STATES.MISSION_START_MP_MATCH);
    }
  },

  [WINDOW_STATES.MISSION_START_MP_MATCH]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_MP_MATCH, WINDOW_STATES.MISSION_START_QUEUE);
    }
  },

  [WINDOW_STATES.MISSION_START]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_QUEUE_RETRY, WINDOW_STATES.MISSION_START_QUEUE);
    }
  },

  [WINDOW_STATES.MISSION_START_DISBAND]: {
    onRepeat: (noxVmInfo) => {
      clickScreen(noxVmInfo, 345, 610);
    }
  },

  [WINDOW_STATES.MISSION_START_QUEUE_RETRY]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_QUEUE_RETRY, WINDOW_STATES.MISSION_START_QUEUE);
    }
  },

  [WINDOW_STATES.MISSION_START_CHAR_DETAILS]: {
    onRepeat: (noxVmInfo) => {
      clickScreen(noxVmInfo, 330, 850);
    }
  },

  // COMBAT
  [WINDOW_STATES.COMBAT]: {
    onRepeat: (noxVmInfo) => {
      if(OPTIONS.AUTO_TAP_ATTACK) clickScreen(noxVmInfo, 275, 475);
    }
  },

  [WINDOW_STATES.COMBAT_DISCONNECT]: {
    onRepeat: (noxVmInfo) => {
      clickScreen(noxVmInfo, 325, 545);
    }
  },

  [WINDOW_STATES.COMBAT_DISCONNECT_2]: {
    onRepeat: (noxVmInfo) => {
      clickScreen(noxVmInfo, 325, 545);
    }
  },


  [WINDOW_STATES.COMBAT_START_RUSH_1]: {
    onEnter: (noxVmInfo) => {
      const checks = [
        [130, 760], // slot 2
        [130, 840], // slot 3
        [130, 920]  // slot 4
      ];

      let totalChecks = [];
      for(let i = 0; i < OPTIONS.RUSH_RETRIES; i++) totalChecks = totalChecks.concat(checks);

      totalChecks.forEach((check, i) => {
        const checkTime = OPTIONS.RUSH_DELAY + (OPTIONS.POLL_RATE * i);
        setTimeout(() => clickScreen(noxVmInfo, check[0], check[1]), checkTime);
      });
    }
  },

  [WINDOW_STATES.COMBAT_START_RUSH_2]: {
    onEnter: (noxVmInfo) => {
      const checks = [
        [130, 680], // slot 1
        [130, 840], // slot 3
        [130, 920]  // slot 4
      ];

      let totalChecks = [];
      for(let i = 0; i < OPTIONS.RUSH_RETRIES; i++) totalChecks = totalChecks.concat(checks);

      totalChecks.forEach((check, i) => {
        const checkTime = OPTIONS.RUSH_DELAY + (OPTIONS.POLL_RATE * i);
        setTimeout(() => clickScreen(noxVmInfo, check[0], check[1]), checkTime);
      });
    }
  },

  [WINDOW_STATES.COMBAT_START_RUSH_3]: {
    onEnter: (noxVmInfo) => {
      const checks = [
        [130, 680], // slot 1
        [130, 760], // slot 2
        [130, 920]  // slot 4
      ];

      let totalChecks = [];
      for(let i = 0; i < OPTIONS.RUSH_RETRIES; i++) totalChecks = totalChecks.concat(checks);

      totalChecks.forEach((check, i) => {
        const checkTime = OPTIONS.RUSH_DELAY + (OPTIONS.POLL_RATE * i);
        setTimeout(() => clickScreen(noxVmInfo, check[0], check[1]), checkTime);
      });
    }
  },

  [WINDOW_STATES.COMBAT_START_RUSH_4]: {
    onEnter: (noxVmInfo) => {
      const checks = [
        [130, 680], // slot 1
        [130, 760], // slot 2
        [130, 840]  // slot 3
      ];

      let totalChecks = [];
      for(let i = 0; i < OPTIONS.RUSH_RETRIES; i++) totalChecks = totalChecks.concat(checks);

      totalChecks.forEach((check, i) => {
        const checkTime = OPTIONS.RUSH_DELAY + (OPTIONS.POLL_RATE * i);
        setTimeout(() => clickScreen(noxVmInfo, check[0], check[1]), checkTime);
      });
    }
  },

  // POST-COMBAT
  [WINDOW_STATES.REWARD1]: {
    onRepeat: (noxVmInfo) => {
      clickScreen(noxVmInfo, 280, 800);
    }
  },

  [WINDOW_STATES.REWARD2]: {
    onRepeat: (noxVmInfo) => {
      clickScreen(noxVmInfo, 280, 800);
    }
  },

  [WINDOW_STATES.REWARD3]: {
    onRepeat: (noxVmInfo) => {
      clickScreen(noxVmInfo, 280, 800);
    }
  },

  // STORY MISSIONS
  [WINDOW_STATES.STORY_SCREEN]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.STORY_SCREEN, WINDOW_STATES.BRIDGE);
    }
  },
};

module.exports = { WINDOW_TRANSITIONS };