
const { WINDOW_STATES } = require('./window.states');

// the Y coord is -30 to account for the header
// never look for FFFFFF or 000000 - you will find them in too many places
const WINDOW_INFORMATION = {

  // these 4 states have the highest priority, so they get checked first
  [WINDOW_STATES.HAS_ACHIEVEMENT_MAP]:        { hex: '710000', pos: { x: 460, y: 270 } },
  [WINDOW_STATES.HAS_ACHIEVEMENT_LIST]:       { hex: '7A0000', pos: { x: 455, y: 180 } },
  [WINDOW_STATES.HAS_ACHIEVEMENT_BRIDGE]:     { hex: 'E50909', pos: { x: 475, y: 320 } },
  [WINDOW_STATES.HAS_GIFT]:                   { hex: 'FD6666', pos: { x: 470, y: 215 } },

  // rest of the states
  [WINDOW_STATES.UNKNOWN]:                    { hex: '000000', pos: { x: 100, y: 130 } },

  [WINDOW_STATES.ANDROID_HOMESCREEN]:         { hex: '020506', pos: { x: 450, y: 20 } },

  [WINDOW_STATES.TITLE_SCREEN]:               { hex: 'DBBA68', pos: { x: 280, y: 570 } },
  [WINDOW_STATES.UPDATED_DATA_AVAILABLE]:     { hex: '9AA8BA', pos: { x: 465, y: 425 } },
  [WINDOW_STATES.UPDATE_SCREEN]:              { hex: 'B8DAFC', pos: { x: 400, y: 120 } },
  [WINDOW_STATES.SESSION_EXPIRED]:            { hex: 'E8EBEF', pos: { x: 480, y: 455 } },

  [WINDOW_STATES.BRIDGE]:                     { hex: '159DF1', pos: { x: 210, y: 825 } },
  [WINDOW_STATES.BRIDGE_UPDATE_NEWS]:         { hex: '125B72', pos: { x: 470, y: 915 } },
  [WINDOW_STATES.BRIDGE_DAILY_BOX]:           { hex: 'FFF9C3', pos: { x: 460, y: 150 } },
  [WINDOW_STATES.BRIDGE_SUPPORT_MEDALS]:      { hex: '10364A', pos: { x: 375, y: 350 } },

  [WINDOW_STATES.ACHIEVEMENTS_AVAIL]:         { hex: 'FBF8C1', pos: { x: 230, y: 290 } },
  [WINDOW_STATES.ACHIEVEMENTS]:               { hex: '889AB0', pos: { x: 300, y: 165 } },
  [WINDOW_STATES.ACHIEVEMENTS_MODAL]:         { hex: '172434', pos: { x: 500, y: 420 } },
  [WINDOW_STATES.ACHIEVEMENTS_CAT_CLEAR]:     { hex: '1F406A', pos: { x: 240, y: 430 } },

  [WINDOW_STATES.GIFT_BOX]:                   { hex: '0C4277', pos: { x: 410, y: 870 } },
  [WINDOW_STATES.GIFT_BOX_MODAL]:             { hex: 'A7B4C4', pos: { x: 255, y: 340 } },
  [WINDOW_STATES.GIFT_BOX_MODAL_LB]:          { hex: '193452', pos: { x: 335, y: 390 } },
  [WINDOW_STATES.GIFT_BOX_EMPTY]:             { hex: '060D10', pos: { x: 410, y: 870 } },
  
  [WINDOW_STATES.EVENT_SCREEN]:               { hex: 'B3B4B4', pos: { x: 45, y: 205 } },
  [WINDOW_STATES.EVENT_SCREEN_MAP]:           { hex: '00427B', pos: { x: 150, y: 225 } },
  [WINDOW_STATES.EVENT_SCREEN_MISSION]:       { hex: '1B6AB7', pos: { x: 340, y: 300 } },
  [WINDOW_STATES.EVENT_JOIN_ALL]:             { hex: 'EBEEF2', pos: { x: 315, y: 455 } },
  [WINDOW_STATES.EVENT_SCREEN_STORY]:         { hex: '053B81', pos: { x: 500, y: 450 } },

  [WINDOW_STATES.MISSION_START]:              { hex: '6E3097', pos: { x: 475, y: 695 } },
  [WINDOW_STATES.MISSION_START_MP]:           { hex: '081E4D', pos: { x: 375, y: 585 } },
  [WINDOW_STATES.MISSION_START_MP_MATCH]:     { hex: '662E87', pos: { x: 135, y: 685 } },
  [WINDOW_STATES.MISSION_START_QUEUE]:        { hex: '6F849F', pos: { x: 195, y: 475 } },
  [WINDOW_STATES.MISSION_START_QUEUE_RETRY]:  { hex: '6C3094', pos: { x: 155, y: 535 } },
  [WINDOW_STATES.MISSION_START_PARTY]:        { hex: '066CB0', pos: { x: 25, y: 595 } },
  [WINDOW_STATES.MISSION_START_DISBAND]:      { hex: '7287A1', pos: { x: 325, y: 455 } },
  [WINDOW_STATES.MISSION_START_CHAR_DETAILS]: { hex: 'D9DEE6', pos: { x: 90, y: 390 } },  
  [WINDOW_STATES.MISSION_START_DISCONNECT]:   { hex: '0F315D', pos: { x: 445, y: 445 } },
  [WINDOW_STATES.MISSION_START_PARTY_LEAVE]:  { hex: '798DA5', pos: { x: 355, y: 440 } },
  [WINDOW_STATES.MISSION_START_PARTY_LEFT]:   { hex: '0F325F', pos: { x: 385, y: 445 } },
  [WINDOW_STATES.MISSION_START_UNKNOWN_ERR]:  { hex: '0F2235', pos: { x: 380, y: 440 } },
  [WINDOW_STATES.MISSION_START_UNSTABLE_ERR]: { hex: '4F698A', pos: { x: 265, y: 440 } },

  [WINDOW_STATES.COMBAT_START_RUSH_1]:        { hex: '31C9AE', pos: { x: 190, y: 685 } },
  [WINDOW_STATES.COMBAT_START_RUSH_2]:        { hex: '2E76C8', pos: { x: 215, y: 770 } },
  [WINDOW_STATES.COMBAT_START_RUSH_3]:        { hex: '3AACE2', pos: { x: 215, y: 850 } },
  [WINDOW_STATES.COMBAT_START_RUSH_4]:        { hex: '4FEEF9', pos: { x: 215, y: 930 } },
  [WINDOW_STATES.COMBAT_DISCONNECT]:          { hex: '0F325F', pos: { x: 310, y: 445 } },
  [WINDOW_STATES.COMBAT_DISCONNECT_2]:        { hex: '637997', pos: { x: 310, y: 545 } },
  [WINDOW_STATES.COMBAT]:                     { hex: '61D5FF', pos: { x: 500, y: 515 } },

  [WINDOW_STATES.REWARD1]:                    { hex: '1C598A', pos: { x: 405, y: 450 } },
  [WINDOW_STATES.REWARD2]:                    { hex: '204668', pos: { x: 60, y: 535 } },
  [WINDOW_STATES.REWARD3]:                    { hex: '1C5CA7', pos: { x: 265, y: 265 } },

  [WINDOW_STATES.STORY_SCREEN]:               { hex: '006AA6', pos: { x: 265, y: 785 } }
};

module.exports = {
  WINDOW_INFORMATION
};