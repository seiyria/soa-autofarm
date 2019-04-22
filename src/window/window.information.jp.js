
const { WINDOW_STATES } = require('./window.states');

// the Y coord is -30 to account for the header
// never look for FFFFFF or 000000 - you will find them in too many places
const WINDOW_INFORMATION = {

  // these 4 states have the highest priority, so they get checked first
  [WINDOW_STATES.HAS_ACHIEVEMENT_MAP]:        { hex: 'FF7777', pos: { x: 470, y: 250 } },
  [WINDOW_STATES.HAS_ACHIEVEMENT_LIST]:       { hex: 'F79999', pos: { x: 470, y: 175 } },
  [WINDOW_STATES.HAS_ACHIEVEMENT_BRIDGE]:     { hex: 'FF6767', pos: { x: 475, y: 290 } },
  [WINDOW_STATES.HAS_GIFT]:                   { hex: 'FF6D6D', pos: { x: 485, y: 205 } },

  // rest of the states
  [WINDOW_STATES.UNKNOWN]:                    { hex: '000000', pos: { x: 100, y: 130 } },

  [WINDOW_STATES.ANDROID_HOMESCREEN]:         { hex: '030407', pos: { x: 460, y: 20 }, ignoreKillswitch: true },
  [WINDOW_STATES.ANDROID_APP_CRASH]:          { hex: '132535', pos: { x: 195, y: 420, ignoreKillswitch: true } },
  [WINDOW_STATES.ANDROID_APP_NOT_RESPOND]:    { hex: '4FB3AA', pos: { x: 470, y: 555, ignoreKillswitch: true } },

  [WINDOW_STATES.TITLE_SCREEN]:               { hex: 'DBBA68', pos: { x: 280, y: 570 } },
  [WINDOW_STATES.UPDATED_DATA_AVAILABLE]:     { hex: '9AA8BA', pos: { x: 465, y: 425 } },
  [WINDOW_STATES.UPDATE_SCREEN]:              { hex: 'B8DAFC', pos: { x: 400, y: 120 }, ignoreKillswitch: true },
  [WINDOW_STATES.SESSION_EXPIRED]:            { hex: 'E8EBEF', pos: { x: 480, y: 455 } },
  [WINDOW_STATES.SUSPENDED_DATA]:             { hex: '91A1B6', pos: { x: 35, y: 450 } },

  [WINDOW_STATES.BRIDGE]:                     { hex: 'BCE3F5', pos: { x: 120, y: 825 } },
  [WINDOW_STATES.BRIDGE_UPDATE_NEWS]:         { hex: 'FCFCFD', pos: { x: 280, y: 870 } },
  [WINDOW_STATES.BRIDGE_DAILY_BOX]:           { hex: 'FFF9C3', pos: { x: 460, y: 150 } }, // v
  [WINDOW_STATES.BRIDGE_SUPPORT_MEDALS]:      { hex: '10364A', pos: { x: 375, y: 350 } }, // v

  [WINDOW_STATES.ACHIEVEMENTS_AVAIL]:         { hex: 'EB9800', pos: { x: 300, y: 290 } },
  [WINDOW_STATES.ACHIEVEMENTS]:               { hex: '21416B', pos: { x: 290, y: 175 } },
  [WINDOW_STATES.ACHIEVEMENTS_MODAL]:         { hex: '304E75', pos: { x: 335, y: 410 } },
  [WINDOW_STATES.ACHIEVEMENTS_CAT_CLEAR]:     { hex: '1F406A', pos: { x: 240, y: 430 } }, // v

  [WINDOW_STATES.GIFT_BOX]:                   { hex: '0C4277', pos: { x: 410, y: 870 } },
  [WINDOW_STATES.GIFT_BOX_MODAL]:             { hex: '161F28', pos: { x: 395, y: 380 } },
  [WINDOW_STATES.GIFT_BOX_MODAL_LB]:          { hex: '193452', pos: { x: 335, y: 390 } }, // v
  [WINDOW_STATES.GIFT_BOX_EMPTY]:             { hex: '071016', pos: { x: 410, y: 870 } },
  
  [WINDOW_STATES.EVENT_SCREEN]:               { hex: 'E0E0E0', pos: { x: 160, y: 365 } },
  [WINDOW_STATES.EVENT_SCREEN_MAP]:           { hex: 'D6D6D6', pos: { x: 75, y: 160 } },
  [WINDOW_STATES.EVENT_SCREEN_MAP_ENDING]:    { hex: 'todo', pos: { x: 150, y: 225 } },   // t
  [WINDOW_STATES.EVENT_SCREEN_MISSION]:       { hex: '86CCF1', pos: { x: 115, y: 295 } },
  [WINDOW_STATES.EVENT_JOIN_ALL]:             { hex: '466184', pos: { x: 385, y: 345 } },
  [WINDOW_STATES.EVENT_SCREEN_STORY]:         { hex: '053B81', pos: { x: 500, y: 450 } },

  [WINDOW_STATES.MISSION_START]:              { hex: '4E5583', pos: { x: 470, y: 685 } },
  [WINDOW_STATES.MISSION_START_MP]:           { hex: '768AA3', pos: { x: 330, y: 405 } },
  [WINDOW_STATES.MISSION_START_MP_MATCH]:     { hex: 'F3F5F7', pos: { x: 370, y: 690 } },
  [WINDOW_STATES.MISSION_START_QUEUE]:        { hex: 'DADFE6', pos: { x: 320, y: 395 } },
  [WINDOW_STATES.MISSION_START_QUEUE_RETRY]:  { hex: '39567B', pos: { x: 220, y: 535 } },
  [WINDOW_STATES.MISSION_START_DISBAND]:      { hex: '1E3F69', pos: { x: 245, y: 445 } },
  [WINDOW_STATES.MISSION_START_CHAR_DETAILS]: { hex: '97AEC3', pos: { x: 80, y: 540 } },  
  [WINDOW_STATES.MISSION_START_DISCONNECT]:   { hex: '0F315D', pos: { x: 445, y: 445 } },
  [WINDOW_STATES.MISSION_START_PARTY_LEAVE]:  { hex: '0F2E53', pos: { x: 310, y: 450 } },
  [WINDOW_STATES.MISSION_START_PARTY_LEFT]:   { hex: '6A809C', pos: { x: 330, y: 445 } },
  [WINDOW_STATES.MISSION_START_UNKNOWN_ERR]:  { hex: '0F2235', pos: { x: 380, y: 440 } }, // v
  [WINDOW_STATES.MISSION_START_UNSTABLE_ERR]: { hex: '4F698A', pos: { x: 265, y: 440 } }, // v
  [WINDOW_STATES.MISSION_HOST_SINGLE]:        { hex: '95A6B7', pos: { x: 425, y: 130 } }, 
  [WINDOW_STATES.MISSION_HOST]:               { hex: '2068B1', pos: { x: 135, y: 685 } },
  [WINDOW_STATES.MISSION_HOST_RECRUIT]:       { hex: '00DFDF', pos: { x: 330, y: 720 } },
  [WINDOW_STATES.MISSION_HOST_RECRUIT_MODAL]: { hex: 'D2D8E1', pos: { x: 340, y: 450 } },
  [WINDOW_STATES.MISSION_HOST_MODAL_REQ2]:    { hex: '3A577C', pos: { x: 410, y: 420 } },
  [WINDOW_STATES.MISSION_HOST_MODAL_REQ0]:    { hex: 'A7B1BD', pos: { x: 345, y: 455 } }, // todo
  // [WINDOW_STATES.MISSION_HOST_MODAL_REQ0_ALT]:{ hex: '', pos: { x: 345, y: 455 } },
  [WINDOW_STATES.MISSION_START_STAMPS]:       { hex: '29A1AF', pos: { x: 45, y: 735 } },
  [WINDOW_STATES.MISSION_HOST_START_YES]:     { hex: '287AC4', pos: { x: 255, y: 740 } },
  [WINDOW_STATES.MISSION_HOST_START_NO]:      { hex: '0F325F', pos: { x: 45, y: 50 } },
  [WINDOW_STATES.MISSION_HOST_DISBAND]:       { hex: '3C587D', pos: { x: 355, y: 440 } },
  
  [WINDOW_STATES.MISSION_START_PARTY_M3]:     { hex: 'B3124D', pos: { x: 445, y: 170 } }, // v
  [WINDOW_STATES.MISSION_START_PARTY]:        { hex: '066CB0', pos: { x: 25, y: 595 } },
  [WINDOW_STATES.MISSION_SINGLE_CHARCHOICE]:  { hex: '8095A9', pos: { x: 290, y: 120 } }, 
  [WINDOW_STATES.MISSION_SINGLE_READYMODAL]:  { hex: '0F325E', pos: { x: 350, y: 450 } },

  [WINDOW_STATES.COMBAT_START_RUSH_1]:        { hex: '31C9AE', pos: { x: 190, y: 685 }, ignoreKillswitch: true },
  [WINDOW_STATES.COMBAT_START_RUSH_2]:        { hex: '2E76C8', pos: { x: 215, y: 770 }, ignoreKillswitch: true },
  [WINDOW_STATES.COMBAT_START_RUSH_3]:        { hex: '3AACE2', pos: { x: 215, y: 850 }, ignoreKillswitch: true },
  [WINDOW_STATES.COMBAT_START_RUSH_4]:        { hex: '4FEEF9', pos: { x: 215, y: 930 }, ignoreKillswitch: true },
  [WINDOW_STATES.COMBAT_DISCONNECT]:          { hex: '0F325F', pos: { x: 310, y: 445 }, ignoreKillswitch: true },
  [WINDOW_STATES.COMBAT_DISCONNECT_2]:        { hex: '637997', pos: { x: 310, y: 545 }, ignoreKillswitch: true },
  [WINDOW_STATES.COMBAT]:                     { hex: 'FEFEFF', pos: { x: 180, y: 45 }, ignoreKillswitch: true },
  [WINDOW_STATES.COMBAT_MANUAL]:              { hex: '467BAF', pos: { x: 180, y: 45 }, ignoreKillswitch: true },

  [WINDOW_STATES.REWARD1]:                    { hex: '1C5989', pos: { x: 405, y: 450 }, ignoreKillswitch: true },
  [WINDOW_STATES.REWARD2]:                    { hex: '214366', pos: { x: 60, y: 535 }, ignoreKillswitch: true },
  [WINDOW_STATES.REWARD3]:                    { hex: '3268AB', pos: { x: 155, y: 265 }, ignoreKillswitch: true },
  [WINDOW_STATES.REWARD_RANKUP]:              { hex: '8394AB', pos: { x: 160, y: 505 }, ignoreKillswitch: true }, // v
  [WINDOW_STATES.REWARD_FOLLOW]:              { hex: '5A7291', pos: { x: 315, y: 445 }, ignoreKillswitch: true },

  [WINDOW_STATES.STORY_SCREEN]:               { hex: 'E7E7E7', pos: { x: 475, y: 365 } },
  [WINDOW_STATES.RECOVER_STAMINA]:            { hex: '123158', pos: { x: 235, y: 455 } }, // v
  [WINDOW_STATES.RECOVER_STAMINA_ITEM]:       { hex: '153C86', pos: { x: 50, y: 445 } },  // v
  [WINDOW_STATES.RECOVER_STAMINA_CONFIRM]:    { hex: '466184', pos: { x: 110, y: 480 } }, // v
  [WINDOW_STATES.RECOVER_STAMINA_DONE]:       { hex: '112F57', pos: { x: 445, y: 410 } }, // v

  [WINDOW_STATES.MOT_SCREEN]:                 { hex: 'B0D8D7', pos: { x: 340, y: 165 } },

  [WINDOW_STATES.ITEM_SCREEN]:                { hex: '647B98', pos: { x: 45, y: 125 } }
};

module.exports = {
  WINDOW_INFORMATION
};