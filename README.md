# soanamnesis-autoplay

A tool that autoplays SOA to farm events.

## Please Read

Please, do not farm content you would not normally auto with this tool. You'll be making Eve cry if you do. This means that latest event M2/M3 is off-limits (in general). Most legacy content is easy enough if you are autoing as a defender or healer, but keep in mind you will never rush first - this tool only attempts to rush when someone else rushes first.

Specifically regarding the characters that work best with this: defenders and attackers. Healers aren't the best because you will not currently rush first, ever. Invokers are ok, but you would want a higher rush delay to attempt to go last better. Sharpshooters are ok as long as you have someone in front of you rushing (again, you will not rush first).

## Current Args / Usage

Right now, there is no executable. So, you would run:

```sh
node index.js --farm-everything=0 --auto-tap-attack=1
```

Or you pass in whatever you want. The arguments are listed below.

### Useful Args

* `--app-kill-threshold` - the number of repeats of the unknown state will kill the app. Default: `600`.
* `--auto-tap-attack` - whether or not to auto tap attack to force melee attacks. Default: `false`.
* `--auto-refresh-stam` - whether or not to automatically refresh stamina from tickets (will not use gems). Default: `false`.
* `--farm-everything` - farm every MP event (using the Join All feature) or just the specific one you enter into. Default: `true`.
* `--farm-single` - farm in single-player. Needs `--farm-event` and possibly `--farm-mission` to work. Default: `false`.
* `--farm-story` - whether or not to farm story missions instead of events. Default: `false`.
* `--is-jp` - whether or not you're playing JP. Default: `false`.
* `--host-event` - the particular event to host for in the list. For more information on hosting, see the section below. Default: `0`.
* `--host-mission` - the particular mission to host for in the event list. For more information on hosting, see the section below. Default: `0`.
* `--host-quit-delay` - the delay between opening a lobby and quitting to create a new one. Default: `30000`ms.
* `--host-stam-percent` - the percentage of stamina required to host a mission. Calculating this is somewhat imprecise, so the math might not be _perfect_, but it should be close. For more information on hosting, see the section below. Default: `0`.
* `--host-start-delay` - the delay between your first party member joining, and you starting the mission. Default: `5000`ms.
* `--host-story` - whether or not to host story missions instead of events. For more information on hosting, see the section below. Default: `false`.
* `--mouse-hover-block` - if `true`, you can hover over the Nox window and pause execution of clicks. Default: `false`.
* `--nox-allow-move` - whether or not the app should observe all Nox locations (ie, if you move them). Default: `false`.
* `--party-quit-delay` - quit each party after a given time if they do not start (to prevent AFK trap rooms). Default: `30000`ms.
* `--poll-rate` - the speed at which the screen should be checked / updated. Default: `750`ms.
* `--restart-delay` - the delay to restart the app (should be done periodically). This clears up most of the lag you get while in game, but it's not perfect. It will not restart while in combat. Default: `10800000`ms (3 hours).
* `--retry-fail-attempts` - how many attempts to "retry" finding a mission. If this gets stuck, you could be trying to farm a dead mission, and get stuck for a long time. Default: `10`.
* `--rush-delay` - the delay before you attempt to rush. Recommended due to lag on the first rush. Default: `1000`ms.
* `--rush-tries` - the number of tries for auto-rush. Default: `1`.
* `--safety-radius` - how many extra pixels to check (radially) besides the one specified. Higher numbers will significantly slow down processing, so it is not recommended to go higher than 2 or 3. This can also lead to some minor mis-detections of different states, especially at higher numbers. Default: `0`.
* `--safety-threshold` - the tolerance for the found color and the desired color on screen. Higher numbers are more likely to match, but also to cause false positives. Default: `0`% (exact match).
* `--skip-achievements` - skip opening achievements as they're gotten. Default: `false`.
* `--skip-gifts` - skip opening the gift box. Default: `false`.
* `--specific-event` - farm a specific event by its position in the list (1, 2, 3, 4 - scrolling down not yet possible). Default: `none`.
* `--specific-mission` - farm a specific event mission by its position in the list (1, 2, 3, 4, 5, 6 - scrolling down not yet possible). Default: `none`.
* `--stats` - track stats for how many times each state was visited while this runs. Default: `true`.
* `--swipe-duration` - the speed of the default click downpress. Default: `100`ms.

### Debug Args

* `--app-homescreen-x` - the x-position of the app on the homescreen. Default: `495`.
* `--app-homescreen-y` - the y-position of the app on the homescreen. Default: `160`.
* `--debug` - print all the debug messages. Warning, there are a lot of these. Default: `false`.
* `--debug-pointer` - move the mouse to where a particular state will be checking a pixel (`--debug-pointer=COMBAT_START_RUSH_1`). Can debug multiple (`--debug-pointer=COMBAT_START_RUSH_1,COMBAT_START_RUSH_2`). Default: `''`.
* `--ignore-click` - do not click the screen, but do normal state observation. Default: `false`.
* `--nox-adb-path` - the path to `nox_adb.exe`. Default: `'D:\\Program Files\\Nox\\bin\\nox_adb.exe'`
* `--nox-calibrate` - calibrate Nox when the program starts, so the app knows which window belongs to which adb device. Only useful if you have more than one Nox running. Default: `true`.
* `--nox-header-height` - the height of the Nox header bar. Default: `30`px.
* `--nox-res-width` - the resolution width of the Nox VM. Default: `720`.
* `--nox-res-height` - the resolution height of the Nox VM. Default: `1280`.
* `--nox-sidebar-width` - the width of the Nox sidebar. Default: `40`px.
* `--nox-window-name` - the name of the Nox window. Default: `'NoxPlayer'`.
* `--verbose` - if used with `--debug`, print even more messages. This is definitely for debugging only. Default: `false`.
* `--repl` - allow for certain keys to be pressed while the application is running. See the REPL section for more details. Default: `true`.

### Where Should I Start The App?

Most of the params will assume you start from the Bridge. However, not all. Here is a list of tasks and where you should be:

* Farm any event (`--farm-everything=1`) - start at the Bridge
* Farm a particular event (`--farm-everything=0`) - start at the mission list for that particular event or use `--specific-event`
* Farm a particular mission (`--farm-everything=1 --specific-event=X`) - start at the mission list for that particular event list and use `--specific-mission`
* Farm missions (`--farm-missions=1`) - start at the Bridge
* Farm a particular story mission - not yet possible, but not likely to be necessary
* Farm a particular event mission in single player (`--farm-single --single-event=X --single-mission-Y`) - start at the Bridge

### Hosting Missions

You probably will want to use your stamina to also host missions instead of just leeching off of them (for farming event hosts). These parameters will host specific missions (it is not possible to host random missions), in addition to your other parameters. So, you can `--farm-everything` and still host a specific mission. The host parameters will take over when you reach the certain stamina percentage. For example:

* Host story missions: `--host-stam-percent=40 --host-story`
* Host the top event, second mission (for missions in list format): `--host-stam-percent=40 --host-event=1 --host-mission=2`
* Host the top event, current map mission - the one in the center of the screen (for missions in map format): `--host-stam-percent=40 --host-event=1 --host-mission=1`

### Single Player Farming

In the event that you do not want to use your stamina for hosting, you can instead opt to do single player farming. The format is similar to join/host specific MP missions:

* Farm the top event, mission 3: `--single-event=1 --single-mission=3`
* Farm story mode: not currently possible (seemingly not useful at this time)

## Gotchas

* This will only run on Windows.
* You must use Nox v6.2.6.2. It probably works on other Nox versions, but this is the version it was developed against.
* Nox must be in OpenGL mode. If the screen is dark in combat, run these two commands:
  * `nox_adb shell setprop persist.nox.quality 1`
  * `nox_adb shell setprop persist.nox.gles 3`
* You cannot move Nox while this is running (unless you use `--nox-allow-move`).
* You cannot block the Nox window while this is running.
* Your SOA character party should probably be max level, just in case.
* Your SOA settings must be maxed out for everything (Quality, Resolution)

### Multi-Nox Gotchas

If you're using multiple Nox windows, they must all be visible. You probably shouldn't close any of them while the script is running. Their locations will be calibrated upon startup.

### Hosting Gotchas

If you plan to host a map mission (not a list mission), it will pick the last mission you were in. There is no current way to pan around the map to the mission you want (nor will this be supported). If you plan to do this, I would recommend doing it manually.

Additionally, unlike other automated aspects of this program, to host, you must start on a screen where stamina is visible (event screen, event mission list, event map list, story screen, or bridge). Otherwise, it will just join and do it's thing, but host when it gets out. If you're not paired with `--farm-everything`, it will host the current mission in your current event list / map screen.

## REPL

Sometimes, weird things happen and you want to inspect the state of the application without restarting it. That's where this comes in. If you pass in `--repl` it will let you press the following keys and get those results:

* `c` - toggle if the application should click, or just watch you click (pauses the automatic killswitch as well)
* `d` - toggle debug mode
* `n` - see what each of the Nox VM states are
* `o` - print the options used in the app currently
* `q` - quit running the app
* `u` - dump the current state of the app
* `v` - toggle verbose mode (and, if on, will make sure debug mode on too)

## About Source Code

* `window.clicks.js` has information on where you click in one particular state to get to another state.
* `window.information.js` has state metadata on the particular pixel being checked as well as the hex color it should be to consider being in that state.
* `window.states.js` has a list of all possible states.
* `window.transitions.js` contains the code for what happens when you enter, repeat, or leave a particular state. Usually this involves transitioning to a different state, or clicking a particular modal away.

# TODO (Now)

* Add test to validate that each WINDOW_STATE has a WINDOW_CLICKS, WINDOW_INFORMATION, and WINDOW_TRANSITION entry.

# TODO (Future)

* Add sync state feature to allow multiple Nox to not proceed clicking unless they're in the same state as each other
* "Wait for all rush" feature (either wait for 4x rush, or wait for as many as can be waited for with dead people)
* Support scrollbar use to get specific mission/event position (beyond what's supported)
* Support JP (swap transitions/clicks/information at runtime - main included file checks env variable and exports Object.assign({}, gl|jp, custom overrides [new json file]))
* Support Reroll
* Support a distributed network of players to create/join lobbies effectively

# Note To Users

I take no liability in what happens to your account in the event that:

* An item gets sold (lock your items - I will never implement a bypass for those)
* You run out of tickets
* Your gems get used
* You get banned (unlikely)

Watch the program play the game to make sure it covers your cases correctly - it is very hard to test all possible combinations / scenarios.