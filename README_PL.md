# MisiuU HUD

![Alt text](/src/assets/git/screen1.png?raw=true 'Podgląd')

## Uruchomienie HUD

- Dodaj do folderu "cfg" gry CS2 (.../csgo/cfg) plik "gamestate_integration_misiuuHud.cfg" z zawartością

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

- Uruchom program misiuuHud.exe (najnowszy plik instalacyjny można pobrać z sekcji Release https://github.com/michu9816/misiuuHud/releases)
- Włącz grę i przejdź do dema / odtwarzania meczu LIVE
- Wpisz komendy, które spowodują wyłączenie domyślnego HUD

```
cl_draw_only_deathnotices true;cl_drawhud_force_teamid_overhead 1
```

Komendy zostają skopiowane automatycznie od razu po uruchomieniu "MisiuuHUD"

Aby wyłączyć HUD należy kliknąć na niego, aby był aktywny (lub dać ALT + TAB) i kliknąć ALT + F4.

**Ważne! Przeczytaj kolejny punkt, aby wyświetlać HUD nad grą**

## Wyświetlanie nad grą i integracja w OBS

Aby aplikacja wyświetliła się nad grą wymagane jest włączenie CS w trybie „Pełny ekran w oknie”.
Nakładka pojawia się nad grą co pozwala komentować z widocznym HUD’em.

_Nakładka nie będzie wyświetlała się nad grą, gdy w komendach startowych znajduje się parametr "vulcan"_

Jeżeli w OBS przechwytywany jest obraz gry, ekranu HUD nie będzie widoczny. Wymagane będzie
dodane kolejnego źródła obrazu – programu „HUD” który będzie wyświetlany nad grą.

## Działanie aplikacji

Aplikacja napisana w electron stawia serwer na porcie 8080.
Za pomocą biblioteki „express” na porcie „3000” dostępny jest serwer http, który służy do odbierania
danych z gry. Dane dostarczane są za pomocą GSI ( Game State Integration ) w CS:GO dzięki
odpowiedniemu pliku .cfg umieszczonemu w plikach gry.
O GSI można poczytać na stronie https://developer.valvesoftware.com/wiki/CounterStrike:_Global_Offensive_Game_State_Integration

## Ustawienia meczu

W zasobniku windows dostępne są ustawienia meczu:

### Series settings

- N/D - Pobieranie wyniku spotkania z API (matches_won_this_series)
- BO1 - Wyświetlanie pod wynikiem napisu "BO1" w trakcie freezetime
- BO3 - Wyświetlanie listy map pod wynikiem w trakcie freezetime

### Score completing

- Auto - Gdy nakładka jest włączona a mapa z serii BO3 zakończy się, wynik zostanie automatycznie zapisany // OBECNIE FUNKCJA NIE JEST URUCHOMIONA
- Manual - Ręczne zapisywanie wyników map dla serii BO3

### Show radar

Właczanie i wyłączanie radaru w grze

### Veto

Możliwość przeprowadzenia VETO dla drużyn. Wymagany wybór serii "BO3". Po najechaniu na mapę można kliknąć "Pick" dla odpowiedniej drużyny, co zostanie wyświetlone na HUDzie.

## Statystyki wyświetlanie w trakcie gry

Po każdej rundzie (zaczynając od 3) zostają wyświetlane statystyki w formacie wykresu słupkowego.
Statystyki zmieniają się w zależność od przebiegu rundy. W trakcie pokazywania statystyk zostają
ukryte informacje o HP graczy.

- Jeżeli jeden z graczy zdobędzie pow. 2 HS – pokazywany zostanie HS% (1)
- Jeżeli jeden z graczy zdobędzie pow. 2 K – pokazywany zostanie K/D
- Jeżeli jeden z graczy zdobędzie pow. 300 obr. – pokazywana zostanie liczba asyst
- Jeżeli jedna z drużyn będzie miała ekwipunek o wartości < 3000$ - pokazana wartość ekwipunków
- Pozostałe przypadki – pokazywany ADR (1)

(1) Statystyki rozszerzone. Będą dostępne tylko, jeżeli interfejs graficzny był właczony od pierwszej
rundy. GSI nie dostarcza informacji na temat liczby zabójstw przez HS w trakcie meczu, ani o
zadanych obrażeniach. Te statystyki są zbierane co rundę do tablicy i wykorzystywane przez aplikację

## Ręczne włączenie i przebudowanie projektu

### Uruchomienie projektu

```
npm install
npm run electron:serve
```

### Budowanie pliku .exe

```
npm install
npm run electron:build
```

## Radar

https://readtldr.gg/simpleradar
https://github.com/boltgolt/boltobserv
