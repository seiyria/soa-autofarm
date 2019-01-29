# soanamnesis-autoplay

A tool that autoplays SOA to farm events.

## Please Read

Please, do not farm content you would not normally auto with this tool. You'll be making Eve cry if you do. This means that latest event M2/M3 is off-limits (in general). Most legacy content is easy enough if you are autoing as a defender or healer, but keep in mind you will never rush first - this tool only attempts to rush when someone else rushes first.

## Current Args / Usage

Right now, there is no executable. So, you would run:

```sh
node index.js --farm-everything 0 --auto-tap-attack 1
```

Or you pass in whatever you want. The arguments are listed below.

### Useful Args

* `--auto-tap-attack` - whether or not to auto tap attack to force melee attacks. Default: `false`.
* `--farm-everything` - farm every MP event (using the Join All feature) or just the specific one you enter into. Default: `true`.
* `--poll-rate` - the speed at which the screen should be checked / updated. Default: `500`ms.
* `--rush-retries` - the number of tries for auto-rush. Default: `3`.
* `--swipe-duration` - the speed of the default click downpress. Default: `100`ms.

### Debug Args

* `--debug` - print all the debug messages. Warning, there are a lot of these. Default: `false`.
* `--verbose` - if used with `--debug`, print even more messages. This is definitely for debugging only. Default: `false`.
* `--debug-pointer` - move the mouse to where a particular state will be checking a pixel (`--debug-pointer=COMBAT_START_RUSH_1`). Can debug multiple (`--debug-pointer=COMBAT_START_RUSH_1,COMBAT_START_RUSH_2`). Default: `''`.
* `--nox-header-height` - the height of the Nox header bar. Default: `30`px.
* `--nox-sidebar-width` - the width of the Nox sidebar. Default: `40`px.
* `--nox-window-name` - the name of the Nox window. Default: `'NoxPlayer'`.
* `--nox-res-width` - the resolution width of the Nox VM. Default: `720`.
* `--nox-res-height` - the resolution height of the Nox VM. Default: `1280`.
* `--app-homescreen-x` - the x-position of the app on the homescreen. Default: `525`.
* `--app-homescreen-y` - the y-position of the app on the homescreen. Default: `330`.

## Gotchas

* You must use Nox v6.2.6.2. It probably works on other Nox versions, but this is the version it was developed against.
* You cannot move Nox while this is running.
* You cannot block the Nox window while this is running.
* Your SOA settings must be maxed out for everything (Quality, Resolution)

## About Source Code

* `window.clicks.js` has information on where you click in one particular state to get to another state.
* `window.information.js` has state metadata on the particular pixel being checked as well as the hex color it should be to consider being in that state.
* `window.states.js` has a list of all possible states.
* `window.transitions.js` contains the code for what happens when you enter, repeat, or leave a particular state. Usually this involves transitioning to a different state, or clicking a particular modal away.

# TODO (Now)

* Farm specific event by position in the list (0, 1, 2, 3, etc)
* Farm specific mission by position in the list (0, 1, 2, 3, etc)
* Farm map mission (7-30)
* Add test to validate that each WINDOW_STATE has a WINDOW_CLICKS, WINDOW_INFORMATION, and WINDOW_TRANSITION entry.

# TODO (Future)

* Support MoT
* Support selling if inventory is full (auto-sell 1/2/3*)
* Support Story (auto-farm current story mission on join)
* Support Reroll
* Support multiple Nox instances
* Support moving Nox at runtime (via 1 arg)
* Support a distributed network of players to create/join lobbies effectively
* Track statistics like number of particular events emitted, such as MISSION_START_PARTY and emit them when program halts (to show session statistics). Possibly track these variables over time and store current session, lifetime, etc.