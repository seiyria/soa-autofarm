const invert = require('lodash.invert');
/*
 * States we don't have to worry about!
 * ------------------------------------
 * RANK_UP - We rank up and can click anywhere to dismiss it.
 * MISSION_STARTING - Not super necessary really. Will be treated as UNKNOWN while loading.
 */

const WINDOW_STATES = {
  UNKNOWN: 0,                             // unknown state

  HAS_ACHIEVEMENT_MAP: 1,                 // if you have an achievement and are on a map screen (story, event map)
  HAS_ACHIEVEMENT_LIST: 2,                // if you have an achievement and are on a list screen (events, missions)
  HAS_ACHIEVEMENT_BRIDGE: 3,              // if you have an achievement and are on the bridge

  HAS_GIFT: 10,                           // if you have a gift available

  ANDROID_HOMESCREEN: 20,                 // if you're on the android homescreen

  TITLE_SCREEN: 41,                       // if you're at the title screen
  UPDATED_DATA_AVAILABLE: 42,             // if you're at the "updated data available" prompt
  UPDATE_SCREEN: 43,                      // if you're on the data download screen
  SESSION_EXPIRED: 44,

  BRIDGE: 50,
  BRIDGE_UPDATE_NEWS: 51,
  BRIDGE_DAILY_BOX: 52,
  BRIDGE_SUPPORT_MEDALS: 53,

  ACHIEVEMENTS_AVAIL: 61,
  ACHIEVEMENTS: 62,
  ACHIEVEMENTS_MODAL: 63,
  ACHIEVEMENTS_CAT_CLEAR: 64,

  GIFT_BOX: 71,
  GIFT_BOX_MODAL: 72,
  GIFT_BOX_MODAL_LB: 73,
  GIFT_BOX_EMPTY: 74,

  EVENT_SCREEN: 80,
  EVENT_SCREEN_MAP: 81,
  EVENT_SCREEN_MISSION: 82,
  EVENT_JOIN_ALL: 83,
  EVENT_SCREEN_STORY: 84,

  MISSION_START: 90,
  MISSION_START_MP: 91,
  MISSION_START_MP_MATCH: 92,
  MISSION_START_QUEUE: 93,
  MISSION_START_QUEUE_RETRY: 94,
  MISSION_START_DISBAND: 95,
  MISSION_START_CHAR_DETAILS: 96,
  MISSION_START_DISCONNECT: 97,
  MISSION_START_PARTY_LEAVE: 98,
  MISSION_START_PARTY_LEFT: 99,
  MISSION_START_UNKNOWN_ERR: 100,
  MISSION_START_UNSTABLE_ERR: 101,
  MISSION_HOST: 102,
  MISSION_HOST_RECRUIT: 103,
  MISSION_HOST_RECRUIT_MODAL: 104,
  MISSION_HOST_MODAL_REQ2: 105,
  MISSION_HOST_MODAL_REQ0: 106,
  MISSION_START_STAMPS: 107,
  MISSION_HOST_START_YES: 108,
  MISSION_HOST_START_NO: 109,
  MISSION_HOST_DISBAND: 110,
  
  MISSION_START_PARTY: 111,

  COMBAT_START_RUSH_1: 120,
  COMBAT_START_RUSH_2: 121,
  COMBAT_START_RUSH_3: 122,
  COMBAT_START_RUSH_4: 123,
  COMBAT_DISCONNECT: 124,
  COMBAT_DISCONNECT_2: 125,
  COMBAT: 126,

  REWARD1: 130,
  REWARD2: 131,
  REWARD3: 132,

  STORY_SCREEN: 140
};

const WINDOW_NAMES = invert(WINDOW_STATES);

module.exports = {
  WINDOW_STATES,
  WINDOW_NAMES
};