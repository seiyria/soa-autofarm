
const { WINDOW_STATES } = require('./window.states');

const WINDOW_CLICKS = {

  // BRIDGE -> *
  [WINDOW_STATES.BRIDGE]: {
    [WINDOW_STATES.EVENT_SCREEN]: { x: 100, y: 830 },
    [WINDOW_STATES.STORY_SCREEN]: { x: 230, y: 830 },
    [WINDOW_STATES.GIFT_BOX]: { x: 500, y: 225 },
    [WINDOW_STATES.ACHIEVEMENTS]: { x: 500, y: 315 }
  },

  // * -> BRIDGE
  [WINDOW_STATES.SESSION_EXPIRED]: {
    [WINDOW_STATES.BRIDGE]: { x: 285, y: 520 }
  },
  [WINDOW_STATES.BRIDGE_UPDATE_NEWS]: {
    [WINDOW_STATES.BRIDGE]: { x: 285, y: 850 }
  },
  [WINDOW_STATES.BRIDGE_DAILY_BOX]: {
    [WINDOW_STATES.BRIDGE]: { x: 285, y: 830 }
  },
  [WINDOW_STATES.BRIDGE_SUPPORT_MEDALS]: {
    [WINDOW_STATES.BRIDGE]: { x: 285, y: 620 }
  },
  [WINDOW_STATES.TITLE_SCREEN]: {
    [WINDOW_STATES.BRIDGE]: { x: 250, y: 285 }
  },

  // ACHIEVEMENTS -> *
  [WINDOW_STATES.ACHIEVEMENTS_AVAIL]: {
    [WINDOW_STATES.ACHIEVEMENTS_MODAL]: { x: 250, y: 285 }
  },
  [WINDOW_STATES.ACHIEVEMENTS_MODAL]: {
    [WINDOW_STATES.ACHIEVEMENTS]: { x: 275, y: 580 }
  },
  [WINDOW_STATES.ACHIEVEMENTS]: {
    [WINDOW_STATES.BRIDGE]: { x: 280, y: 800 }
  },
  [WINDOW_STATES.ACHIEVEMENTS_CAT_CLEAR]: {
    [WINDOW_STATES.BRIDGE]: { x: 280, y: 800 }
  },

  // GIFT BOX -> *
  [WINDOW_STATES.GIFT_BOX]: {
    [WINDOW_STATES.GIFT_BOX_MODAL]: { x: 460, y: 850 }
  },
  [WINDOW_STATES.GIFT_BOX_MODAL]: {
    [WINDOW_STATES.GIFT_BOX]: { x: 280, y: 610 }
  },
  [WINDOW_STATES.GIFT_BOX_EMPTY]: {
    [WINDOW_STATES.BRIDGE]: { x: 100, y: 850 }
  },
  
  // EVENT SCREEN -> *
  [WINDOW_STATES.EVENT_SCREEN]: {
    [WINDOW_STATES.BRIDGE]: { x: 130, y: 840 },
    [WINDOW_STATES.ACHIEVEMENTS]: { x: 480, y: 200 },
    [WINDOW_STATES.EVENT_JOIN_ALL]: { x: 400, y: 850 }
  },
  [WINDOW_STATES.EVENT_SCREEN_MISSION]: {
    [WINDOW_STATES.EVENT_SCREEN]: { x: 85, y: 855 },
    [WINDOW_STATES.ACHIEVEMENTS]: { x: 480, y: 200 },
    [WINDOW_STATES.EVENT_JOIN_ALL]: { x: 400, y: 850 }
  },
  [WINDOW_STATES.EVENT_SCREEN_MAP]: {
    [WINDOW_STATES.BRIDGE]: { x: 85, y: 855 },
    [WINDOW_STATES.ACHIEVEMENTS]: { x: 480, y: 300 },
    [WINDOW_STATES.EVENT_JOIN_ALL]: { x: 400, y: 850 },
  },
  [WINDOW_STATES.EVENT_SCREEN_STORY]: {
    [WINDOW_STATES.EVENT_SCREEN_MAP]: { x: 180, y: 530 }
  },
  [WINDOW_STATES.EVENT_JOIN_ALL]: {
    [WINDOW_STATES.MISSION_START_QUEUE]: { x: 375, y: 455 },
    [WINDOW_STATES.MISSION_START_MP_MATCH]: { x: 375, y: 455 }
  },

  // MISSION SCREEN -> *
  [WINDOW_STATES.MISSION_START]: {
    [WINDOW_STATES.MISSION_START_MP]: { x: 420, y: 690 }
  },
  [WINDOW_STATES.MISSION_START_MP]: {
    [WINDOW_STATES.MISSION_START_MP_MATCH]: { x: 330, y: 490 }
  },
  [WINDOW_STATES.MISSION_START_MP_MATCH]: {
    [WINDOW_STATES.MISSION_START_QUEUE]: { x: 425, y: 690 }
  },
  [WINDOW_STATES.MISSION_START_QUEUE_RETRY]: {
    [WINDOW_STATES.MISSION_START_QUEUE]: { x: 330, y: 520 }
  },
  [WINDOW_STATES.MISSION_START_DISBAND]: {
    [WINDOW_STATES.MISSION_START_MP]: { x: 345, y: 610 }
  },
  [WINDOW_STATES.MISSION_START_PARTY]: {
    [WINDOW_STATES.MISSION_START_PARTY_LEAVE]: { x: 330, y: 830 }
  },
  [WINDOW_STATES.MISSION_START_PARTY_LEAVE]: {
    [WINDOW_STATES.MISSION_START_PARTY_LEFT]: { x: 435, y: 610 }
  },
  [WINDOW_STATES.MISSION_START_PARTY_LEFT]: {
    [WINDOW_STATES.MISSION_START_MP]: { x: 300, y: 590 }
  },
  [WINDOW_STATES.MISSION_START_CHAR_DETAILS]: {
    [WINDOW_STATES.MISSION_START_MP]: { x: 330, y: 850 }
  },
  [WINDOW_STATES.MISSION_START_DISCONNECT]: {
    [WINDOW_STATES.MISSION_START_MP]: { x: 345, y: 610 }
  },
  [WINDOW_STATES.MISSION_START_UNKNOWN_ERR]: {
    [WINDOW_STATES.MISSION_START_MP]: { x: 300, y: 590 }
  },
  [WINDOW_STATES.MISSION_START_UNSTABLE_ERR]: {
    [WINDOW_STATES.MISSION_START_MP]: { x: 300, y: 590 }
  },
  [WINDOW_STATES.COMBAT_DISCONNECT]: {
    [WINDOW_STATES.MISSION_START_MP]: { x: 325, y: 545 }
  },
  [WINDOW_STATES.COMBAT_DISCONNECT_2]: {
    [WINDOW_STATES.MISSION_START_MP]: { x: 325, y: 545 }
  },

  // ACHIEVEMENT -> BOX
  [WINDOW_STATES.HAS_ACHIEVEMENT_BRIDGE]: {
    [WINDOW_STATES.ACHIEVEMENTS]: { x: 500, y: 315 }
  },
  [WINDOW_STATES.HAS_ACHIEVEMENT_LIST]: {
    [WINDOW_STATES.ACHIEVEMENTS]: { x: 500, y: 175 }
  },
  [WINDOW_STATES.HAS_ACHIEVEMENT_MAP]: {
    [WINDOW_STATES.ACHIEVEMENTS]: { x: 500, y: 270 }
  },

  // REWARD -> *
  [WINDOW_STATES.REWARD1]: {
    [WINDOW_STATES.REWARD2]: { x: 280, y: 800 }
  },
  [WINDOW_STATES.REWARD2]: {
    [WINDOW_STATES.REWARD3]: { x: 280, y: 800 }
  },
  [WINDOW_STATES.REWARD3]: {
    [WINDOW_STATES.EVENT_SCREEN_MISSION]: { x: 280, y: 800 }
  },

  // STORY SCREEN -> *
  [WINDOW_STATES.STORY_SCREEN]: {
    [WINDOW_STATES.BRIDGE]: { x: 50, y: 930 },
    [WINDOW_STATES.EVENT_JOIN_ALL]: { x: 400, y: 850 }
  },

  // UPDATES -> *
  [WINDOW_STATES.UPDATED_DATA_AVAILABLE]: {
    [WINDOW_STATES.UPDATE_SCREEN]: { x: 300, y: 590 }
  },
  [WINDOW_STATES.UPDATE_SCREEN]: {
    [WINDOW_STATES.BRIDGE]: { x: 300, y: 850 }
  },
};

module.exports = {
  WINDOW_CLICKS
};