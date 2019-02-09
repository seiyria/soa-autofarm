const { OPTIONS } = require('../helpers/env');
const Logger = require('../helpers/logger');

const { WINDOW_STATES } = require('./window.states');

const { tryTransitionState, clickScreen, killApp, isAtLeastPercentStaminaFull } = require('../helpers/window');

// variables used by the screen transitions

// used to check if we've been in the same party room for a period of time - we can quit/disband after a period of time
// shouldStillLeave = false;

// used to check if we've been retrying too many times - we should probably go back to the event screen if so
// let failedRetryAttempts = 0;

const WINDOW_TRANSITIONS = {

  [WINDOW_STATES.UNKNOWN]: { },

  // priority states
  [WINDOW_STATES.HAS_GIFT]: {
    canEnter: () => !OPTIONS.SKIP_GIFTS,
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.BRIDGE, WINDOW_STATES.GIFT_BOX);
    }
  },

  [WINDOW_STATES.HAS_ACHIEVEMENT_BRIDGE]: {
    canEnter: () => !OPTIONS.SKIP_ACHIEVEMENTS,
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.HAS_ACHIEVEMENT_BRIDGE, WINDOW_STATES.ACHIEVEMENTS);
    }
  },

  [WINDOW_STATES.HAS_ACHIEVEMENT_LIST]: {
    canEnter: () => !OPTIONS.SKIP_ACHIEVEMENTS,
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.HAS_ACHIEVEMENT_LIST, WINDOW_STATES.ACHIEVEMENTS);
    }
  },

  [WINDOW_STATES.HAS_ACHIEVEMENT_MAP]: {
    canEnter: () => !OPTIONS.SKIP_ACHIEVEMENTS,
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

  // suspended data
  [WINDOW_STATES.SUSPENDED_DATA]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.SUSPENDED_DATA, WINDOW_STATES.COMBAT);
    }
  },

  // other states
  [WINDOW_STATES.BRIDGE]: {
    onEnter: (noxVmInfo) => {
      noxVmInfo.shouldHost = false;
      noxVmInfo.shouldStillLeave = false;
      noxVmInfo.failedRetryAttempts = 0;
    },
    onRepeat: (noxVmInfo) => {
      if(OPTIONS.FARM_MISSIONS) {
        tryTransitionState(noxVmInfo, WINDOW_STATES.BRIDGE, WINDOW_STATES.STORY_SCREEN);
      } else {
        tryTransitionState(noxVmInfo, WINDOW_STATES.BRIDGE, WINDOW_STATES.EVENT_SCREEN);
      }
    }
  },

  [WINDOW_STATES.SESSION_EXPIRED]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.SESSION_EXPIRED, WINDOW_STATES.BRIDGE);
    }
  },

  [WINDOW_STATES.BRIDGE_UPDATE_NEWS]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.BRIDGE_UPDATE_NEWS, WINDOW_STATES.BRIDGE);
    }
  },

  [WINDOW_STATES.BRIDGE_DAILY_BOX]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.BRIDGE_DAILY_BOX, WINDOW_STATES.BRIDGE);
    }
  },

  [WINDOW_STATES.BRIDGE_SUPPORT_MEDALS]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.BRIDGE_SUPPORT_MEDALS, WINDOW_STATES.BRIDGE);
    }
  },

  [WINDOW_STATES.TITLE_SCREEN]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.TITLE_SCREEN, WINDOW_STATES.BRIDGE);
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

  [WINDOW_STATES.GIFT_BOX_MODAL_LB]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.GIFT_BOX_MODAL_LB, WINDOW_STATES.GIFT_BOX);
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
      tryTransitionState(noxVmInfo, WINDOW_STATES.ACHIEVEMENTS_AVAIL, WINDOW_STATES.ACHIEVEMENTS_MODAL);
    }
  },

  [WINDOW_STATES.ACHIEVEMENTS_MODAL]: {
    onRepeat: (noxVmInfo) => {
      // click the close button on the "earned achievement" modal
      tryTransitionState(noxVmInfo, WINDOW_STATES.ACHIEVEMENTS_MODAL, WINDOW_STATES.ACHIEVEMENTS);
    }
  },

  [WINDOW_STATES.ACHIEVEMENTS]: {
    onRepeat: (noxVmInfo) => {
      // click the close button
      tryTransitionState(noxVmInfo, WINDOW_STATES.ACHIEVEMENTS, WINDOW_STATES.BRIDGE);
    }
  },

  [WINDOW_STATES.ACHIEVEMENTS_CAT_CLEAR]: {
    onRepeat: (noxVmInfo) => {
      // click the close button
      tryTransitionState(noxVmInfo, WINDOW_STATES.ACHIEVEMENTS_CAT_CLEAR, WINDOW_STATES.BRIDGE);
    }
  },

  // EVENT LIST
  [WINDOW_STATES.EVENT_SCREEN]: {
    onEnter: (noxVmInfo) => {
      noxVmInfo.shouldHost = false;
    },
    onRepeat: (noxVmInfo) => {
      if(OPTIONS.FARM_MISSIONS) {
        tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN, WINDOW_STATES.BRIDGE);

      } else {

        noxVmInfo.shouldHost = isAtLeastPercentStaminaFull(noxVmInfo);

        if(noxVmInfo.shouldHost && !OPTIONS.HOST_EVENT) {
          Logger.log(`[Nox ${noxVmInfo.index}]`, 'Determined that I should host, but no --host-event to do. Joining instead.');
        }

        // click the specific event in the menu list
        // or, if we're hosting, click into that particular event
        if(OPTIONS.SPECIFIC_EVENT || (noxVmInfo.shouldHost && OPTIONS.HOST_EVENT)) {
          const event = OPTIONS.SPECIFIC_EVENT || OPTIONS.HOST_EVENT;
          clickScreen(noxVmInfo, 285, 375 + (105 * (event - 1)));

        // or, if none specified, click the join all button
        } else {
          tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN, WINDOW_STATES.EVENT_JOIN_ALL);
        }
      }
    }
  },
  
  [WINDOW_STATES.EVENT_SCREEN_MAP]: {
    onRepeat: (noxVmInfo) => {
      const shouldHostCheckAgain = isAtLeastPercentStaminaFull(noxVmInfo);

      if(!shouldHostCheckAgain) {
        noxVmInfo.shouldHost = false;
      }

      if(noxVmInfo.shouldHost && !OPTIONS.HOST_MISSION) {
        Logger.log(`[Nox ${noxVmInfo.index}]`, 'Determined that I should host, but no --host-mission set. It does need to be set, but can be set to anything.');
      }

      // click the center mission on the map
      // we host if:
      // - we are in this screen and do not have a specific event to host, ie, we're farming this event
      // - we were told to host by the event list
      // - we only host if a HOST_MISSION is available
      if((noxVmInfo.shouldHost || (shouldHostCheckAgain && !OPTIONS.HOST_EVENT)) && OPTIONS.HOST_MISSION) {

        // we set this again, in case you're not in FARM_EVERYTHING mode
        noxVmInfo.shouldHost = true;
        clickScreen(noxVmInfo, 275, 510);

      // or, click join all if we're not doing farm everything
      } else {
        if(OPTIONS.FARM_EVERYTHING) {

          // swallow every other click to not double click on accident
          if((noxVmInfo.stateRepeats % 2) === 0) return;

          tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN_MAP, WINDOW_STATES.BRIDGE);
          return;
        }
        
        tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN_MAP, WINDOW_STATES.EVENT_JOIN_ALL);
      }
    }
  },

  [WINDOW_STATES.EVENT_SCREEN_MISSION]: {
    onRepeat: (noxVmInfo) => {

      // we check again, in case you're not in FARM_EVERYTHING mode
      const shouldHostCheckAgain = isAtLeastPercentStaminaFull(noxVmInfo);

      if(!shouldHostCheckAgain) {
        noxVmInfo.shouldHost = false;
      }

      if(noxVmInfo.shouldHost && !OPTIONS.HOST_MISSION) {
        Logger.log(`[Nox ${noxVmInfo.index}]`, 'Determined that I should host, but no --host-mission to do. Backing out. Will probably not be doing anything any time soon.');
      }
      
      // click a specific mission in the menu list
      // we host if:
      // - we are in this screen and do not have a specific event to host, ie, we're farming this event
      // - we were told to host by the event list
      // - we only host if a HOST_MISSION is available
      const shouldHostSpecificMission = !!((noxVmInfo.shouldHost || (shouldHostCheckAgain && !OPTIONS.HOST_EVENT)) && OPTIONS.HOST_MISSION);
      if(OPTIONS.SPECIFIC_MISSION || shouldHostSpecificMission) {

        const mission = OPTIONS.SPECIFIC_MISSION || OPTIONS.HOST_MISSION;
        clickScreen(noxVmInfo, 285, 300 + (80 * (mission - 1)));

      // or, click join all if we're not doing farm everything
      } else {
        if(OPTIONS.FARM_EVERYTHING) {

          // swallow every other click to not double click on accident
          if((noxVmInfo.stateRepeats % 2) === 0) return;
          
          tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN_MISSION, WINDOW_STATES.EVENT_SCREEN);
          return;
        }
        
        tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN_MISSION, WINDOW_STATES.EVENT_JOIN_ALL);
      }
    }
  },

  [WINDOW_STATES.EVENT_JOIN_ALL]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_JOIN_ALL, WINDOW_STATES.MISSION_START_MP_MATCH);
    }
  },

  [WINDOW_STATES.EVENT_SCREEN_STORY]: {
    onRepeat: (noxVmInfo) => {

      // swallow every other click to not get stuck here forever accidentally
      if((noxVmInfo.stateRepeats % 2) === 0) return;
      tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN_STORY, WINDOW_STATES.EVENT_SCREEN_MAP);
    }
  },

  // MISSION
  [WINDOW_STATES.MISSION_START]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START, WINDOW_STATES.MISSION_START_MP);
    }
  },

  [WINDOW_STATES.MISSION_START_MP]: {
    onRepeat: (noxVmInfo) => {
      if(noxVmInfo.shouldHost) {
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_MP, WINDOW_STATES.MISSION_START_MP_HOST);
        return;
      }

      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_MP, WINDOW_STATES.MISSION_START_MP_MATCH);
    }
  },

  [WINDOW_STATES.MISSION_START_MP_MATCH]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_MP_MATCH, WINDOW_STATES.MISSION_START_QUEUE);
    }
  },

  [WINDOW_STATES.MISSION_START_DISBAND]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_DISBAND, WINDOW_STATES.MISSION_START_MP);
    }
  },

  [WINDOW_STATES.MISSION_START_QUEUE_RETRY]: {
    onEnter: (noxVmInfo) => {
      noxVmInfo.failedRetryAttempts = noxVmInfo.failedRetryAttempts || 0;
      noxVmInfo.failedRetryAttempts++;

      if(noxVmInfo.failedRetryAttempts >= OPTIONS.RETRY_FAIL_ATT) {
        killApp(noxVmInfo, 'Killing app due to exceeding --retry-fail-attempts threshold.');
      }
    },
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_QUEUE_RETRY, WINDOW_STATES.MISSION_START_QUEUE);
    }
  },

  [WINDOW_STATES.MISSION_START_STAMPS]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_STAMPS, WINDOW_STATES.MISSION_START_PARTY);
    }
  },

  [WINDOW_STATES.MISSION_START_PARTY]: {
    onEnter: (noxVmInfo) => {
      noxVmInfo.shouldStillLeave = true;

      // back out if they try to sit in the same lobby for 3 hours
      setTimeout(() => {
        if(noxVmInfo.state !== WINDOW_STATES.MISSION_START_PARTY || !noxVmInfo.shouldStillLeave) return;
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_PARTY, WINDOW_STATES.MISSION_START_PARTY_LEAVE);
      }, OPTIONS.PARTY_QUIT_DELAY);
    },

    onLeave: (noxVmInfo) => {
      noxVmInfo.shouldStillLeave = false;
    }
  },

  [WINDOW_STATES.MISSION_START_PARTY_LEAVE]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_PARTY_LEAVE, WINDOW_STATES.MISSION_START_PARTY_LEFT);
    }
  },

  [WINDOW_STATES.MISSION_START_PARTY_LEFT]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_PARTY_LEFT, WINDOW_STATES.MISSION_START_MP);
    }
  },

  [WINDOW_STATES.MISSION_START_CHAR_DETAILS]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_CHAR_DETAILS, WINDOW_STATES.MISSION_START_MP);
    }
  },

  [WINDOW_STATES.MISSION_START_DISCONNECT]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_DISCONNECT, WINDOW_STATES.MISSION_START_MP);
    }
  },

  [WINDOW_STATES.MISSION_START_UNKNOWN_ERR]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_UNKNOWN_ERR, WINDOW_STATES.MISSION_START_MP);
    }
  },

  [WINDOW_STATES.MISSION_START_UNSTABLE_ERR]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_UNSTABLE_ERR, WINDOW_STATES.MISSION_START_MP);
    }
  },

  [WINDOW_STATES.MISSION_HOST]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_HOST, WINDOW_STATES.MISSION_HOST_RECRUIT);
    }
  },

  [WINDOW_STATES.MISSION_HOST_RECRUIT]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_HOST_RECRUIT, WINDOW_STATES.MISSION_HOST_RECRUIT_MODAL);
    }
  },

  [WINDOW_STATES.MISSION_HOST_START_NO]: {
    onEnter: (noxVmInfo) => {
      noxVmInfo.shouldStillLeave = true;

      // back out if no one joins
      setTimeout(() => {
        if(noxVmInfo.state !== WINDOW_STATES.MISSION_HOST_START_NO || !noxVmInfo.shouldStillLeave) return;
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_HOST_START_NO, WINDOW_STATES.MISSION_HOST_DISBAND);
      }, OPTIONS.HOST_QUIT_DELAY);
    },

    onLeave: (noxVmInfo) => {
      noxVmInfo.shouldStillLeave = false;
    }
  },

  [WINDOW_STATES.MISSION_HOST_RECRUIT_MODAL]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_HOST_RECRUIT_MODAL, WINDOW_STATES.MISSION_HOST_START_NO);
    }
  },

  [WINDOW_STATES.MISSION_HOST_START_YES]: {
    onRepeat: (noxVmInfo) => {
      setTimeout(() => {
        if(noxVmInfo.state !== WINDOW_STATES.MISSION_HOST_START_YES) return;
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_HOST_START_YES, WINDOW_STATES.MISSION_HOST_MODAL_REQ0);
      }, OPTIONS.HOST_START_DELAY);
    }
  },

  [WINDOW_STATES.MISSION_HOST_MODAL_REQ2]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_HOST_MODAL_REQ2, WINDOW_STATES.COMBAT);
    }
  },

  [WINDOW_STATES.MISSION_HOST_MODAL_REQ0]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_HOST_MODAL_REQ0, WINDOW_STATES.COMBAT);
    }
  },

  [WINDOW_STATES.MISSION_HOST_DISBAND]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_HOST_DISBAND, WINDOW_STATES.MISSION_START_DISBAND);
    }
  },

  // COMBAT
  [WINDOW_STATES.COMBAT]: {
    onEnter: (noxVmInfo) => {
      noxVmInfo.failedRetryAttempts = 0;
      noxVmInfo.shouldHost = false;
    },
    onRepeat: (noxVmInfo) => {
      if(OPTIONS.AUTO_TAP_ATTACK) clickScreen(noxVmInfo, 275, 475);
    }
  },

  [WINDOW_STATES.COMBAT_DISCONNECT]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.COMBAT_DISCONNECT, WINDOW_STATES.MISSION_START_MP);
    }
  },

  [WINDOW_STATES.COMBAT_DISCONNECT_2]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.COMBAT_DISCONNECT_2, WINDOW_STATES.MISSION_START_MP);
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
  // these are clickScreen because they require multiple clicks to get through
  // the mutex doesn't like that
  [WINDOW_STATES.REWARD1]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.REWARD1, WINDOW_STATES.REWARD2);
    }
  },

  [WINDOW_STATES.REWARD2]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.REWARD2, WINDOW_STATES.REWARD3);
    }
  },

  [WINDOW_STATES.REWARD3]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.REWARD3, WINDOW_STATES.EVENT_SCREEN);
    }
  },

  [WINDOW_STATES.REWARD_RANKUP]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.REWARD_RANKUP, WINDOW_STATES.REWARD1);
    }
  },

  // STORY MISSIONS
  [WINDOW_STATES.STORY_SCREEN]: {
    onRepeat: (noxVmInfo) => {
      if(OPTIONS.FARM_MISSIONS) {
        const shouldHost = isAtLeastPercentStaminaFull(noxVmInfo);

        // if we can host, we click the button
        if(shouldHost && OPTIONS.HOST_STORY) {
          clickScreen(noxVmInfo, 275, 510);

        // otherwise, we just join all
        } else {
          tryTransitionState(noxVmInfo, WINDOW_STATES.STORY_SCREEN, WINDOW_STATES.EVENT_JOIN_ALL);
        }

      } else {
        tryTransitionState(noxVmInfo, WINDOW_STATES.STORY_SCREEN, WINDOW_STATES.BRIDGE);
      }
    }
  },

  // UPDATES
  [WINDOW_STATES.UPDATED_DATA_AVAILABLE]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.UPDATED_DATA_AVAILABLE, WINDOW_STATES.UPDATE_SCREEN);
    }
  },

  [WINDOW_STATES.UPDATE_SCREEN]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.UPDATE_SCREEN, WINDOW_STATES.BRIDGE);
    }
  },
};

module.exports = { WINDOW_TRANSITIONS };