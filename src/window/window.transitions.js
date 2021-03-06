const { OPTIONS } = require('../helpers/env');
const Logger = require('../helpers/logger');

const { WINDOW_STATES } = require('./window.states');

const { tryTransitionState, clickScreen, isAtLeastPercentStaminaFull, getPixelColor } = require('../helpers/window');

const WINDOW_TRANSITIONS = {

  [WINDOW_STATES.UNKNOWN]: { 
    onRepeat: (noxVmInfo) => {
      if(!OPTIONS.UNKNOWN_CLICK) return;

      // click location attempts, in order
      const allClicks = Array(20).fill(null).map((x, i) => ({ x: 380, y: 400 + (i * 50) }));

      // wait 15 polls before attempting to do anything
      const baseSpacer = 15;
      if(noxVmInfo.absoluteStateRepeats < baseSpacer) return;

      // space it out to every 5 polls after the first 15 delay
      const clickSpacer = 5;

      // the current click index in allClicks. we only care if it is evenly divisible.
      const curClick = ((noxVmInfo.absoluteStateRepeats % (allClicks.length * clickSpacer)) / clickSpacer) - 1;

      // check if we have a click object at this point
      const clickRef = allClicks[curClick];
      if(clickRef) {
        clickScreen(noxVmInfo, clickRef.x, clickRef.y);
      }
    }
  },

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

  [WINDOW_STATES.ANDROID_APP_NOT_RESPOND]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.ANDROID_APP_NOT_RESPOND, WINDOW_STATES.ANDROID_HOMESCREEN);
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
      noxVmInfo.hasStamped = false;
      noxVmInfo.shouldHost = false;
      noxVmInfo.shouldStillLeave = false;
      noxVmInfo.backingOff = false;
      noxVmInfo.failedRetryAttempts = 0;
    },
    onRepeat: (noxVmInfo) => {
      // swallow every other click to not double click on accident
      if((noxVmInfo.absoluteStateRepeats % 2) === 0) return;

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
      // swallow every other click to not double click on accident
      if((noxVmInfo.stateRepeats % 2) === 0) return;

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
      noxVmInfo.backingOff = false;
    },
    onRepeat: (noxVmInfo) => {
      // swallow every other click to not double click on accident
      if((noxVmInfo.absoluteStateRepeats % 4) === 0) return;

      if(OPTIONS.FARM_SINGLE) {
        const event = OPTIONS.SINGLE_EVENT;
        clickScreen(noxVmInfo, 285, 375 + (100 * (event - 1)));

      } else if(OPTIONS.FARM_MISSIONS) {
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
          clickScreen(noxVmInfo, 285, 375 + (100 * (event - 1)));

        // or, if none specified, click the join all button
        } else {
          tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN, WINDOW_STATES.EVENT_JOIN_ALL);
        }
      }
    }
  },
  
  [WINDOW_STATES.EVENT_SCREEN_MAP]: {
    onEnter: (noxVmInfo) => {
      noxVmInfo.backingOff = false;
    },
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
      // - we start single player mode
      if((noxVmInfo.shouldHost || OPTIONS.FARM_SINGLE || (shouldHostCheckAgain && !OPTIONS.HOST_EVENT)) && OPTIONS.HOST_MISSION) {

        // we set this again, in case you're not in FARM_EVERYTHING mode
        noxVmInfo.shouldHost = true;
        clickScreen(noxVmInfo, 275, 510);

      // or, click join all if we're not doing farm everything
      } else {
        if(OPTIONS.FARM_EVERYTHING) {

          // swallow every other click to not double click on accident
          if((noxVmInfo.absoluteStateRepeats % 2) === 0) return;

          tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN_MAP, WINDOW_STATES.BRIDGE);
          return;
        }

        // click the center of the screen if we're farming this specific event
        if(OPTIONS.SPECIFIC_EVENT && OPTIONS.SPECIFIC_MISSION) {
          clickScreen(noxVmInfo, 275, 510);
          return;
        }
        
        tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN_MAP, WINDOW_STATES.EVENT_JOIN_ALL);
      }
    }
  },

  [WINDOW_STATES.EVENT_SCREEN_MAP_ENDING]: {
    onRepeat: (noxVmInfo) => {
      WINDOW_TRANSITIONS[WINDOW_STATES.EVENT_SCREEN_MAP].onRepeat(noxVmInfo);
    }
  },

  [WINDOW_STATES.EVENT_SCREEN_MISSION]: {
    onEnter: (noxVmInfo) => {
      noxVmInfo.backingOff = false;
    },
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
      // - we are in single player mode
      const shouldHostSpecificMission = !!((noxVmInfo.shouldHost || (shouldHostCheckAgain && !OPTIONS.HOST_EVENT)) && OPTIONS.HOST_MISSION);
      if(shouldHostSpecificMission) {
        noxVmInfo.shouldHost = true;
      }

      if(OPTIONS.SINGLE_MISSION || OPTIONS.SPECIFIC_MISSION || shouldHostSpecificMission) {

        const mission = OPTIONS.SINGLE_MISSION || OPTIONS.SPECIFIC_MISSION || OPTIONS.HOST_MISSION;
        clickScreen(noxVmInfo, 285, 300 + (80 * (mission - 1)));

      // or, click join all if we're not doing farm everything
      } else {
        if(OPTIONS.FARM_EVERYTHING) {

          // swallow every other click to not double click on accident
          if((noxVmInfo.absoluteStateRepeats % 2) === 0) return;
          
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
      if((noxVmInfo.absoluteStateRepeats % 2) === 0) return;
      tryTransitionState(noxVmInfo, WINDOW_STATES.EVENT_SCREEN_STORY, WINDOW_STATES.EVENT_SCREEN_MAP);
    }
  },

  // MISSION
  [WINDOW_STATES.MISSION_START]: {
    onRepeat: (noxVmInfo) => {

      // swallow every other click to not double click on accident
      if((noxVmInfo.stateRepeats % 2) === 0) return;

      // if we're not hosting and don't have a specific mission, back off.
      if(!noxVmInfo.shouldHost && (OPTIONS.SPECIFIC_EVENT && !OPTIONS.SPECIFIC_MISSION)) {
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START, WINDOW_STATES.EVENT_SCREEN_MISSION);
        return;
      }

      // back off if we're backing off
      if(noxVmInfo.backingOff) {
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START, WINDOW_STATES.EVENT_SCREEN_MISSION);
        return;
      }

      // farm single player missions instead of multi
      if(OPTIONS.FARM_SINGLE) {
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START, WINDOW_STATES.MISSION_SINGLE_CHARCHOICE);

      // or, just do multi
      } else {
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START, WINDOW_STATES.MISSION_START_MP);
      }
    },

    onLeave: (noxVmInfo) => {
      noxVmInfo.backingOff = false;
    }
  },

  [WINDOW_STATES.MISSION_START_MP]: {
    onRepeat: (noxVmInfo) => {
      // swallow every other click to not double click on accident
      if((noxVmInfo.stateRepeats % 2) === 0) return;

      if(noxVmInfo.backingOff) {
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_MP, WINDOW_STATES.MISSION_START);
        return;
      }

      if(noxVmInfo.shouldHost) {
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_MP, WINDOW_STATES.MISSION_START_MP_HOST);
        return;
      }

      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_MP, WINDOW_STATES.MISSION_START_MP_MATCH);
    }
  },

  [WINDOW_STATES.MISSION_START_MP_MATCH]: {
    onRepeat: (noxVmInfo) => {      
      // swallow every other click to not double click on accident
      if((noxVmInfo.absoluteStateRepeats % 2) === 0) return;

      if(noxVmInfo.backingOff) {
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_MP_MATCH, WINDOW_STATES.MISSION_START_MP);
        return;
      }

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
    },
    onRepeat: (noxVmInfo) => {
      if(noxVmInfo.failedRetryAttempts >= OPTIONS.RETRY_FAIL_ATT) {
        noxVmInfo.backingOff = true;
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_QUEUE_RETRY, WINDOW_STATES.MISSION_START_MP_MATCH);
        // killApp(noxVmInfo, 'Killing app due to exceeding --retry-fail-attempts threshold.');
      } else {
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_QUEUE_RETRY, WINDOW_STATES.MISSION_START_QUEUE);
      }
    },
    onLeave: (noxVmInfo) => {
      if(noxVmInfo.failedRetryAttempts >= OPTIONS.RETRY_FAIL_ATT) {
        noxVmInfo.failedRetryAttempts = 0;
      }
    }
  },

  [WINDOW_STATES.MISSION_START_STAMPS]: {
    onEnter: (noxVmInfo) => {
      noxVmInfo.hasStamped = false;
    },

    onRepeat: (noxVmInfo) => {
      if(OPTIONS.STAMP_JOIN) {
        clickScreen(noxVmInfo, 110 * OPTIONS.STAMP_JOIN, 720);

        setTimeout(() => {
          tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_STAMPS, WINDOW_STATES.MISSION_START_PARTY);
        }, OPTIONS.POLL_RATE);
      }

      if(!OPTIONS.STAMP_JOIN || (OPTIONS.STAMP_JOIN && noxVmInfo.absoluteStateRepeats > 3)) {
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_STAMPS, WINDOW_STATES.MISSION_START_PARTY);
      }
    },

    onLeave: (noxVmInfo) => {
      noxVmInfo.hasStamped = true;
    }
  },

  [WINDOW_STATES.MISSION_START_PARTY_M3]: {
    onEnter: (noxVmInfo) => {
      noxVmInfo.shouldStillLeave = true;

      // back out if they try to sit in the same lobby for 3 hours
      noxVmInfo.leaveTimeout = setTimeout(() => {
        if(noxVmInfo.state !== WINDOW_STATES.MISSION_START_PARTY || !noxVmInfo.shouldStillLeave) return;
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_PARTY, WINDOW_STATES.MISSION_START_PARTY_LEAVE);
      }, OPTIONS.PARTY_QUIT_DELAY);
    },

    onRepeat: (noxVmInfo) => {
      if(!OPTIONS.ALLOW_M3) {
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_PARTY_M3, WINDOW_STATES.MISSION_START_PARTY_LEAVE);
        return;
      }

      if(OPTIONS.STAMP_JOIN && !noxVmInfo.hasStamped) {
        if((noxVmInfo.stateRepeats % 2) === 0) return;
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_PARTY_M3, WINDOW_STATES.MISSION_START_STAMPS);
      }
    },

    onLeave: (noxVmInfo) => {
      noxVmInfo.shouldStillLeave = false;
      clearTimeout(noxVmInfo.leaveTimeout);
    }
  },

  [WINDOW_STATES.MISSION_START_PARTY]: {
    onEnter: (noxVmInfo) => {
      noxVmInfo.shouldStillLeave = true;

      // back out if they try to sit in the same lobby for 3 hours
      noxVmInfo.leaveTimeout = setTimeout(() => {
        if(noxVmInfo.state !== WINDOW_STATES.MISSION_START_PARTY || !noxVmInfo.shouldStillLeave) return;
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_PARTY, WINDOW_STATES.MISSION_START_PARTY_LEAVE);
      }, OPTIONS.PARTY_QUIT_DELAY);
    },

    onRepeat: (noxVmInfo) => {
      if(OPTIONS.STAMP_JOIN && !noxVmInfo.hasStamped) {
        if((noxVmInfo.absoluteStateRepeats % 2) === 0) return;
        tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_START_PARTY_M3, WINDOW_STATES.MISSION_START_STAMPS);
      }
    },

    onLeave: (noxVmInfo) => {
      noxVmInfo.shouldStillLeave = false;
      clearTimeout(noxVmInfo.leaveTimeout);
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

  [WINDOW_STATES.MISSION_HOST_MODAL_REQ0_ALT]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_HOST_MODAL_REQ0, WINDOW_STATES.COMBAT);
    }
  },

  [WINDOW_STATES.MISSION_HOST_DISBAND]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_HOST_DISBAND, WINDOW_STATES.MISSION_START_DISBAND);
    }
  },

  [WINDOW_STATES.MISSION_HOST_SINGLE]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_HOST_SINGLE, WINDOW_STATES.MISSION_SINGLE_READYMODAL);
    }
  },

  [WINDOW_STATES.MISSION_SINGLE_CHARCHOICE]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_SINGLE_CHARCHOICE, WINDOW_STATES.MISSION_HOST_SINGLE);
    }
  },

  [WINDOW_STATES.MISSION_SINGLE_READYMODAL]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MISSION_SINGLE_READYMODAL, WINDOW_STATES.COMBAT);
    }
  },

  // COMBAT
  [WINDOW_STATES.COMBAT_MANUAL]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.COMBAT_MANUAL, WINDOW_STATES.COMBAT);
    }
  },

  [WINDOW_STATES.COMBAT]: {
    onEnter: (noxVmInfo) => {
      noxVmInfo.failedRetryAttempts = 0;
      noxVmInfo.shouldHost = false;
      noxVmInfo.hasStamped = false;
      noxVmInfo.backingOff = false;
      noxVmInfo.isCombatAutoRushing = false;
    },
    onRepeat: (noxVmInfo) => {
      if(OPTIONS.AUTO_TAP_ATTACK) clickScreen(noxVmInfo, 275, 475);

      console.log('-------------', noxVmInfo.index)
      if(OPTIONS.RUSH_WHEN_POSSIBLE && !noxVmInfo.isCombatAutoRushing) {

        const hpChecks = [
          [125, 706],
          [125, 787],
          [125, 868],
          [125, 949]
        ];
        
        const rushChecks = [
          [124, 677],
          [124, 758],
          [124, 839],
          [124, 920]
        ];

        const hpColors = {
          alive: 'FE8700',
          dead: '082A45'
        };

        const rushColors = {
          yes: '88F4FD',
          no: '447B7F'
        }

        let shouldRush = true;

        for(let i = 0; i < 4; i++) {
          const hpCheck = hpChecks[i];
          const rushCheck = rushChecks[i];

          const hpColor = getPixelColor(noxVmInfo, hpCheck[0], hpCheck[1]);
          const rushColor = getPixelColor(noxVmInfo, rushCheck[0], rushCheck[1]);

          // false if rush = no and color != dead
          if(rushColor === rushColors.no && hpColor !== hpColors.dead) {
            shouldRush = false;
            break;
          }
        }

        if(shouldRush) {
          noxVmInfo.isCombatAutoRushing = true;
          const clicks = [
            [130, 680],
            [130, 760],
            [130, 840],
            [130, 920]
          ];

          clicks.forEach((check, i) => {
            const checkTime = OPTIONS.RUSH_DELAY + (OPTIONS.POLL_RATE * i);
            setTimeout(() => {
              clickScreen(noxVmInfo, check[0], check[1]);

              // reset the flag
              if(i === 3) {
                noxVmInfo.isCombatAutoRushing = false;
              }
            }, checkTime);
          });
        }
      }
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
        const BONUS_DELAY = Math.floor(i / 3) * OPTIONS.RUSH_RETRY_DELAY;
        const checkTime = BONUS_DELAY + OPTIONS.RUSH_DELAY + (OPTIONS.POLL_RATE * i);
        setTimeout(() => {
          if(noxVmInfo.state !== WINDOW_STATES.COMBAT_START_RUSH_1) return;
          clickScreen(noxVmInfo, check[0], check[1]);
        }, checkTime);
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
        const BONUS_DELAY = Math.floor(i / 3) * OPTIONS.RUSH_RETRY_DELAY;
        const checkTime = BONUS_DELAY + OPTIONS.RUSH_DELAY + (OPTIONS.POLL_RATE * i);
        setTimeout(() => {
          if(noxVmInfo.state !== WINDOW_STATES.COMBAT_START_RUSH_2) return;
          clickScreen(noxVmInfo, check[0], check[1]);
        }, checkTime);
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
        const BONUS_DELAY = Math.floor(i / 3) * OPTIONS.RUSH_RETRY_DELAY;
        const checkTime = BONUS_DELAY + OPTIONS.RUSH_DELAY + (OPTIONS.POLL_RATE * i);
        setTimeout(() => {
          if(noxVmInfo.state !== WINDOW_STATES.COMBAT_START_RUSH_3) return;
          clickScreen(noxVmInfo, check[0], check[1]);
        }, checkTime);
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
        const BONUS_DELAY = Math.floor(i / 3) * OPTIONS.RUSH_RETRY_DELAY;
        const checkTime = BONUS_DELAY + OPTIONS.RUSH_DELAY + (OPTIONS.POLL_RATE * i);
        setTimeout(() => {
          if(noxVmInfo.state !== WINDOW_STATES.COMBAT_START_RUSH_4) return;
          clickScreen(noxVmInfo, check[0], check[1]);
        }, checkTime);
      });
    }
  },

  // POST-COMBAT
  [WINDOW_STATES.REWARD1]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.REWARD1, WINDOW_STATES.REWARD2);
    }
  },

  [WINDOW_STATES.REWARD2]: {
    onRepeat: (noxVmInfo) => {
      // swallow every other click to not double click on accident
      if((noxVmInfo.absoluteStateRepeats % 2) === 0) return;

      tryTransitionState(noxVmInfo, WINDOW_STATES.REWARD2, WINDOW_STATES.REWARD3);
    }
  },

  [WINDOW_STATES.REWARD3]: {
    onRepeat: (noxVmInfo) => {
      if(noxVmInfo.absoluteStateRepeats < OPTIONS.POST_COMBAT_WAIT) return;
      
      // swallow every other click to not double click on accident
      if((noxVmInfo.absoluteStateRepeats % 2) === 0) return;

      tryTransitionState(noxVmInfo, WINDOW_STATES.REWARD3, WINDOW_STATES.EVENT_SCREEN);
    }
  },

  [WINDOW_STATES.REWARD_RANKUP]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.REWARD_RANKUP, WINDOW_STATES.REWARD1);
    }
  },

  [WINDOW_STATES.REWARD_FOLLOW]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.REWARD_FOLLOW, WINDOW_STATES.REWARD1);
    }
  },

  // STORY MISSIONS
  [WINDOW_STATES.STORY_SCREEN]: {
    onRepeat: (noxVmInfo) => {
      if(OPTIONS.FARM_MISSIONS) {
        const shouldHost = isAtLeastPercentStaminaFull(noxVmInfo);

        // if we can host, we click the button
        if(shouldHost && OPTIONS.HOST_STORY) {
          noxVmInfo.shouldHost = true;
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

  // RECOVER_STAMINA
  [WINDOW_STATES.RECOVER_STAMINA]: {
    onRepeat: (noxVmInfo) => {
      if(OPTIONS.AUTO_REFRESH_STAM) {
        Logger.log(`[Nox ${noxVmInfo.index}]`, 'Auto-recovering stamina...');
        tryTransitionState(noxVmInfo, WINDOW_STATES.RECOVER_STAMINA, WINDOW_STATES.RECOVER_STAMINA_ITEM);
      } else {
        Logger.log(`[Nox ${noxVmInfo.index}]`, 'Not auto-recovering stamina. Please change the farm settings to go back to normal function.');
        tryTransitionState(noxVmInfo, WINDOW_STATES.RECOVER_STAMINA, WINDOW_STATES.MISSION_START);
      }
    }
  },
  [WINDOW_STATES.RECOVER_STAMINA_ITEM]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.RECOVER_STAMINA_ITEM, WINDOW_STATES.RECOVER_STAMINA_CONFIRM);
    }
  },
  [WINDOW_STATES.RECOVER_STAMINA_CONFIRM]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.RECOVER_STAMINA_CONFIRM, WINDOW_STATES.RECOVER_STAMINA_DONE);
    }
  },
  [WINDOW_STATES.RECOVER_STAMINA_DONE]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.RECOVER_STAMINA_DONE, WINDOW_STATES.MISSION_START);
    }
  },

  [WINDOW_STATES.MOT_SCREEN]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.MOT_SCREEN, WINDOW_STATES.BRIDGE);
    }
  },

  [WINDOW_STATES.ITEM_SCREEN]: {
    onRepeat: (noxVmInfo) => {
      tryTransitionState(noxVmInfo, WINDOW_STATES.ITEM_SCREEN, WINDOW_STATES.BRIDGE);
    }
  },
};

module.exports = { WINDOW_TRANSITIONS };