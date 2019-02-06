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

* `--app-kill-threshold` - the number of repeats of the unknown state will kill the app. Default: `100`.
* `--auto-tap-attack` - whether or not to auto tap attack to force melee attacks. Default: `false`.
* `--farm-everything` - farm every MP event (using the Join All feature) or just the specific one you enter into. Default: `true`.
* `--farm-missions` - whether or not to farm missions instead of events. Default: `false`.
* `--is-jp` - whether or not you're playing JP. Default: `false`.
* `--mouse-hover-block` - if `true`, you can hover over the Nox window and pause execution of clicks. Default: `false`.
* `--nox-allow-move` - whether or not the app should observe all Nox locations (ie, if you move them). Default: `false`.
* `--party-quit-delay` - quit each party after a given time if they do not start (to prevent AFK trap rooms). Default: `30000`ms.
* `--poll-rate` - the speed at which the screen should be checked / updated. Default: `750`ms.
* `--retry-fail-attempts` - how many attempts to "retry" finding a mission. If this gets stuck, you could be trying to farm a dead mission, and get stuck for a long time. Default: `3`.
* `--rush-delay` - the delay before you attempt to rush. Recommended due to lag on the first rush. Default: `1000`ms.
* `--rush-tries` - the number of tries for auto-rush. Default: `1`.
* `--safety-radius` - how many extra pixels to check (radially) besides the one specified. Higher numbers will significantly slow down processing, so it is not recommended to go higher than 2 or 3. This can also lead to some minor mis-detections of different states, especially at higher numbers. Default: `0`.
* `--skip-achievements` - skip opening achievements as they're gotten. Default: `false`.
* `--skip-gifts` - skip opening the gift box. Default: `false`.
* `--specific-event` - farm a specific event by its position in the list (1, 2, 3, 4 - scrolling down not yet possible). Default: `none`.
* `--specific-mission` - farm a specific event mission by its position in the list (1, 2, 3, 4, 5, 6 - scrolling down not yet possible). Default: `none`.
* `--swipe-duration` - the speed of the default click downpress. Default: `100`ms.

### Debug Args

* `--app-homescreen-x` - the x-position of the app on the homescreen. Default: `495`.
* `--app-homescreen-y` - the y-position of the app on the homescreen. Default: `160`.
* `--debug` - print all the debug messages. Warning, there are a lot of these. Default: `false`.
* `--debug-pointer` - move the mouse to where a particular state will be checking a pixel (`--debug-pointer=COMBAT_START_RUSH_1`). Can debug multiple (`--debug-pointer=COMBAT_START_RUSH_1,COMBAT_START_RUSH_2`). Default: `''`.
* `--nox-adb-path` - the path to `nox_adb.exe`. Default: `'D:\\Program Files\\Nox\\bin\\nox_adb.exe'`
* `--nox-header-height` - the height of the Nox header bar. Default: `30`px.
* `--nox-res-width` - the resolution width of the Nox VM. Default: `720`.
* `--nox-res-height` - the resolution height of the Nox VM. Default: `1280`.
* `--nox-sidebar-width` - the width of the Nox sidebar. Default: `40`px.
* `--nox-window-name` - the name of the Nox window. Default: `'NoxPlayer'`.
* `--verbose` - if used with `--debug`, print even more messages. This is definitely for debugging only. Default: `false`.

### Where Should I Start The App?

Most of the params will assume you start from the Bridge. However, not all. Here is a list of tasks and where you should be:

* Farm any event (`--farm-everything=1`) - start at the Bridge
* Farm a particular event (`--farm-everything=0`) - start at the mission list for that particular event or use `--specific-event`
* Farm a particular mission (`--farm-everything=1 --specific-event=X`) - start at the mission list for that particular event list and use `--specific-mission`
* Farm missions (`--farm-missions=1`) - start at the Bridge
* Farm a particular story mission - not yet possible, but not likely to be necessary

## Gotchas

* This will only run on Windows.
* Your windows must contain the name "NoxPlayer". This is the default, so as long as you're not changing it, you're fine.
* You must use Nox v6.2.6.2. It probably works on other Nox versions, but this is the version it was developed against.
* You cannot move Nox while this is running (unless you use `--nox-allow-move`).
* You cannot block the Nox window while this is running.
* Your SOA character party should probably be max level, just in case.
* Your SOA settings must be maxed out for everything (Quality, Resolution)

### Multi-Nox Gotchas

If you're using multiple Nox windows, they must be in order, left to right, that you opened them. You probably shouldn't close them. Hopefully this limitation will be able to go away in the future.

## About Source Code

* `window.clicks.js` has information on where you click in one particular state to get to another state.
* `window.information.js` has state metadata on the particular pixel being checked as well as the hex color it should be to consider being in that state.
* `window.states.js` has a list of all possible states.
* `window.transitions.js` contains the code for what happens when you enter, repeat, or leave a particular state. Usually this involves transitioning to a different state, or clicking a particular modal away.

# TODO (Now)

* Auto-host when have stamina
* Add test to validate that each WINDOW_STATE has a WINDOW_CLICKS, WINDOW_INFORMATION, and WINDOW_TRANSITION entry.

# TODO (Future)

* "Wait for all rush" feature (either wait for 4x rush, or wait for as many as can be waited for with dead people)
* Support scrollbar use to get specific mission/event position (beyond what's supported)
* Support JP (swap transitions/clicks/information at runtime)
* Support Reroll
* Support a distributed network of players to create/join lobbies effectively
* Track statistics like number of particular events emitted, such as MISSION_START_PARTY and emit them when program halts (to show session statistics). Possibly track these variables over time and store current session, lifetime, etc.