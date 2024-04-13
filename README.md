# MisiuU HUD

![Alt text](/src/assets/git/screen1.png?raw=true 'Preview')

## Setup

- Add file "gamestate_integration_misiuuHud.cfg" to your CS2 "cfg" directory (.../csgo/cfg) with content:

```
"Observer All Players v.1"
{
 "uri" "http://localhost:3000/api/data"
 "timeout" "0.1"
 "buffer"  "0.0"
 "throttle" "0.0"
 "heartbeat" "2.0"
 "auth"
 {
   "token" "Q79v5tcxVQ8u"
 }
 "data"
 {
   "map_round_wins"      "1"
   "map"                 "1"
   "round"               "1"
   "player_id"           "1"
   "allplayers_id"       "1"      // Same as 'player_id' but for all players. 'allplayers' versions are only valid for HLTV and observers
   "player_state"        "1"
   "allplayers_state"    "1"
   "allplayers_match_stats"  "1"
   "allplayers_weapons"  "1"
   "bomb"                "1"
   "allplayers_position" "1"      // output the player world positions, only valid for GOTV or spectators.
   "phase_countdowns"    "1"      // countdowns of each second remaining for game phases, eg round time left, time until bomb explode, freezetime. Only valid for GOTV or spectators.
   "allgrenades"    "1"           // output information about all grenades and inferno flames in the world, only valid for GOTV or spectators.
 }
}
```

- Run misiuuHud.exe (you can download latest setup file from Release https://github.com/michu9816/misiuuHud/releases)
- Type in your console commands that will disable default HUD

```
cl_draw_only_deathnotices true;cl_drawhud_force_radar 1;cl_drawhud_force_teamid_overhead 1
```

Commands will be copied automatically on program start "MisiuuHUD"

To turn off the HUD press ALT + F4 on active window (ALT + TAB to select "MisiuuHUD").

**Warning! Read next step to show HUD above the game**

## Display HUD above CS2 and integrate with OBS

CS must be turned on in "Full screen in window" mode to display HUD properly.

_HUD will not be showing above the game when you have "vulcan" param in your launch options_

If a game image is captured in OBS, the HUD screen will not be visible. It will be necessary to add another image source - the "HUD" program, which will be displayed above the game.

## How it works?

The application written in electron puts the server on port 8080.
Using the "express" library, an http server is available on port "3000", which is used to receive data from the game. Data is provided using GSI (Game State Integration) in CS:GO thanks to the appropriate .cfg file placed in the game files.
You can read about GSI at https://developer.valvesoftware.com/wiki/CounterStrike:_Global_Offensive_Game_State_Integration

## Match settings

The match settings are available in the windows tray:

### Series settings

- N/A - Getting match result from API (matches_won_this_series)
- BO1 - Displaying the word "BO1" under the result during freezetime
- BO3 - Display a list of maps under the result during freezetime

### Score completing

- Auto - When the overlay is turned on and the BO3 series map is finished, the result will be automatically saved // CURRENTLY THE FUNCTION IS NOT WORKING
- Manual - Manually saving map results for the BO3 series

### Veto

Possibility to conduct a VETO for teams. Required selection of the "BO3" series. After hovering over the map, you can click "Pick" for the appropriate team, which will be displayed on the HUD.

## Statistics displayed during the game

After each round (starting from 3), statistics are displayed in a bar chart format.
Statistics change depending on the course of the round.

- If one of the players gets above 2 HS – HS% (1) will be shown
- If one of the players gets above 2 K – K/D will be shown
- If one of the players gets above 300 dmg – the number of assists will be shown
- If one of the teams has equipment worth <$3000 - the value of the equipment is shown
- Other cases – ADR shown (1)

(1) Extended statistics. They will only be available if the HUD was enabled from the first one rounds. GSI does not provide information on HS kills during the match or damage dealt. These statistics are collected every round into the board and used by the application.

## Manual run and build project

### Run project

```
npm install
npm run electron:serve
```

### Build .exe file

```
npm install
npm run electron:build
```

## Radar

Rada inspired by project boltgolt https://github.com/boltgolt/boltobserv. Maps graphics by https://readtldr.gg/simpleradar
