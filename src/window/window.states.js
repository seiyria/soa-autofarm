const invert = require('lodash.invert');
/*
 * States we don't have to worry about!
 * ------------------------------------
 * MISSION_STARTING - Not super necessary really. Will be treated as UNKNOWN while loading.
 * SUPPORT_RANK_UP - Treated as "support medals" popup, so it doesn't have to be worried about.
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
  SESSION_EXPIRED: 44,                    // if you got the "session expired" popup
  SUSPENDED_DATA: 45,                     // "resume from suspended data" screen

  BRIDGE: 50,                             // if you're on the bridge
  BRIDGE_UPDATE_NEWS: 51,                 // if you can see the bridge update news popup
  BRIDGE_DAILY_BOX: 52,                   // if you're opening a bridge daily box
  BRIDGE_SUPPORT_MEDALS: 53,              // if you're getting support medals

  ACHIEVEMENTS_AVAIL: 61,                 // if you have available achievements (denoted by the yellow mark on top of it)
  ACHIEVEMENTS: 62,                       // the general achievements panel, no achievements available
  ACHIEVEMENTS_MODAL: 63,                 // the popoup from when you click an achievement
  ACHIEVEMENTS_CAT_CLEAR: 64,             // if you cleared the category of achievements (for example, after you've cleared the event achievements)

  GIFT_BOX: 71,                           // the gift box screen
  GIFT_BOX_MODAL: 72,                     // the gift box modal from when you accept something
  GIFT_BOX_MODAL_LB: 73,                  // the gift box modal from when you LB a character
  GIFT_BOX_EMPTY: 74,                     // an empty, sad gift box screen

  EVENT_SCREEN: 80,                       // the event listing page
  EVENT_SCREEN_MAP: 81,                   // a specific event, the map screen for it (ffbe, nier, etc)
  EVENT_SCREEN_MISSION: 82,               // a specific event, the mission list screen for it (reruns, frost tree, etc)
  EVENT_JOIN_ALL: 83,                     // the "join all" button
  EVENT_SCREEN_STORY: 84,                 // the story mission map area (bridge -> missions)

  MISSION_START: 90,                      // the modal with "join lobby" / "search with lobby id"
  MISSION_START_MP: 91,                   // the party selection screen
  MISSION_START_MP_MATCH: 92,             // the actual party lobby screen
  MISSION_START_QUEUE: 93,                // the "joining..." screen
  MISSION_START_QUEUE_RETRY: 94,          // the "joining..." screen, but with "retry" enabled
  MISSION_START_DISBAND: 95,              // the popup for when the lobby is disbanded
  MISSION_START_CHAR_DETAILS: 96,         // the party character detail popup (from the party selection screen)
  MISSION_START_DISCONNECT: 97,           // the popup for when you get disconnected from a lobby
  MISSION_START_PARTY_LEAVE: 98,          // the "are you sure you want to leave the party" popup
  MISSION_START_PARTY_LEFT: 99,           // the "you have left the party" popup
  MISSION_START_UNKNOWN_ERR: 100,         // the "unknown error" popup
  MISSION_START_UNSTABLE_ERR: 101,        // the "you have an unstable connection error" popup

  MISSION_HOST_SINGLE: 102,               // the party screen, but from a single-player perspective
  MISSION_HOST: 103,                      // the party screen, but from a hosting perspective
  MISSION_HOST_RECRUIT: 104,              // the party screen, but in a state where you can hit the recruit button
  MISSION_HOST_RECRUIT_MODAL: 105,        // the "begin recruiting?" modal
  MISSION_HOST_MODAL_REQ2: 106,           // the popup you get when you have 1 or 2 missing party members and go to start
  MISSION_HOST_MODAL_REQ0: 107,           // the popup you get when you have a full party
  MISSION_START_STAMPS: 108,              // the stamp menu popup on the mission screen
  MISSION_HOST_START_YES: 109,            // if you can start the mission, this state is visible
  MISSION_HOST_START_NO: 110,             // if you can't start the mission, this state is visible
  MISSION_HOST_DISBAND: 111,              // disbanding the mission popup
  
  MISSION_START_PARTY: 112,               // the "plain" host leader party screen (recruit state is checked first because it is prioritized)

  MISSION_SINGLE_CHARCHOICE: 113,         // the "character on loan" screen in single player
  MISSION_SINGLE_READYMODAL: 114,         // the "start mission" popup

  COMBAT_START_RUSH_1: 140,               // combat - the first person is rushing
  COMBAT_START_RUSH_2: 141,               // combat - the second person is rushing
  COMBAT_START_RUSH_3: 142,               // combat - the third person is rushing
  COMBAT_START_RUSH_4: 143,               // combat - the fourth person is rushing
  COMBAT_DISCONNECT: 144,                 // the "you have been disconnected" popup in combat
  COMBAT_DISCONNECT_2: 145,               // another disconnect popup.

  COMBAT: 146,                            // the "plain" combat state (checked last because other states are more important)

  REWARD1: 150,                           // the first reward screen
  REWARD2: 151,                           // the second reward screen
  REWARD3: 152,                           // the third reward screen
  REWARD_RANKUP: 153,                     // the reward rank-up popup

  STORY_SCREEN: 160                       // the mission popup for story missions
};

const WINDOW_NAMES = invert(WINDOW_STATES);

module.exports = {
  WINDOW_STATES,
  WINDOW_NAMES
};