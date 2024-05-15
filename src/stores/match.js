import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useGuiStore } from './gui';
import { usePlayersStore } from './players';

export const useMatchStore = defineStore('match', () => {
	const lossBonus = ref({
		t: undefined,
		ct: undefined,
	});

	const roundPhase = ref({
		round: undefined,
		match: undefined,
		winner: undefined,
		bomb: undefined,
		timeout: undefined,
		timer: undefined,
		player: undefined,
		roundTimer: undefined,
	});

	const matchScore = ref({
		total: {
			t: undefined,
			ct: undefined,
		},
		map: {
			t: undefined,
			ct: undefined,
		},
		teams: {
			t: undefined,
			ct: undefined,
		},
		timeouts: {
			t: undefined,
			ct: undefined,
		},
		round: undefined,
	});

	const grenades = ref([]);

	const match = ref();

	function loadMatchData(matchData, roundData, timeData, bombData, grenadesList) {
		const guiStore = useGuiStore();

		roundPhase.value.round = roundData?.phase;
		roundPhase.value.match = matchData?.phase;
		roundPhase.value.timeout =
			timeData?.phase == 'timeout_ct' ? 'CT' : timeData?.phase == 'timeout_t' ? 'T' : timeData?.phase == 'paused' ? 'technical' : undefined;
		roundPhase.value.winner = roundData?.win_team;
		if (['planted'].includes(roundData?.bomb)) {
			if (!roundHistory.value?.find((obj) => obj.action == roundData?.bomb)) {
				addRoundHistoryElement('default', roundData?.bomb);
			}
		}
		if (matchData?.round_wins && matchData?.round_wins[matchData?.round] && timeData?.phase == 'over') {
			const action = matchData.round_wins[matchData?.round]?.split('_');
			if (!action[2] != 'elimination') {
				if (roundHistory.value?.findIndex((obj) => obj.action == action[2]) == -1) {
					addRoundHistoryElement(action[0], action[2]);
				}
			}
		}
		roundPhase.value.bomb = bombData?.state;
		roundPhase.value.bombData = bombData;
		roundPhase.value.timer = bombData?.countdown;
		roundPhase.value.player = bombData?.player;
		roundPhase.value.roundTimer = timeData?.phase_ends_in;

		matchScore.value.total.t = matchData?.team_t?.matches_won_this_series;
		matchScore.value.total.ct = matchData?.team_ct?.matches_won_this_series;
		matchScore.value.map.t = matchData?.team_t?.score;
		matchScore.value.map.ct = matchData?.team_ct?.score;
		matchScore.value.teams.t = matchData?.team_t?.name || 'Terrorists';
		matchScore.value.teams.ct = matchData?.team_ct?.name || 'Counter-Terrorists';
		matchScore.value.timeouts.t = matchData?.team_t?.timeouts_remaining;
		matchScore.value.timeouts.ct = matchData?.team_ct?.timeouts_remaining;
		matchScore.value.round = matchData?.round;
		lossBonus.value.t = Math.min(4, matchData?.team_t?.consecutive_round_losses);
		lossBonus.value.ct = Math.min(4, matchData?.team_ct?.consecutive_round_losses);

		if (matchData?.round == 0 && timeData?.phase == 'freezetime') {
			console.log('Restarting statistics on first round');
			guiStore.restartStatistics();
		}

		if (timeData?.phase == 'over') {
			const playersStore = usePlayersStore();

			let statistic = 'adr';
			const roundSideNr = matchData.round % 12;
			const extendedStatistics = guiStore.getData().playersStatistics.data?.filter((obj) => obj.round == 0).length > 0;

			const someoneKilled3 = playersStore.someoneKilled3();
			const someoneHighDMG = playersStore.someoneHighDMG();
			const anyTeamIsPoor = playersStore.anyTeamIsPoor();
			const someoneHeadshoted3 = playersStore.someoneHeadshoted3();
			guiStore.setPlayerStatisticVisibility(roundSideNr % 3 == 0);
			if (roundSideNr < 3 && roundSideNr > 1) {
				statistic = 'equipment';
			} else if (roundSideNr >= 3) {
				if (someoneHeadshoted3 && extendedStatistics) {
					guiStore.setPlayerStatisticVisibility(true);
					statistic = 'hs';
				} else if (someoneKilled3) {
					statistic = 'kd';
				} else if (someoneHighDMG) {
					statistic = 'assists';
				} else if (anyTeamIsPoor && roundSideNr >= 6) {
					guiStore.setPlayerStatisticVisibility(true);
					statistic = 'equipment';
				} else {
					if (extendedStatistics) {
						statistic = 'adr';
					} else {
						statistic = 'kills';
					}
				}
			} else {
				guiStore.setPlayerStatisticVisibility(false);
			}
			guiStore.setPlayerStatisticType(statistic);
		} else if (roundPhase.value.timeout) {
			guiStore.setPlayerStatisticVisibility(false);
		}

		if (grenadesList) {
			grenades.value = Object.entries(grenadesList).map((obj) => {
				return { id: obj[0], data: obj[1] };
			});
		}

		match.value = matchData?.name;
	}

	const roundHistory = ref([]);

	const addRoundHistoryElement = function (team, element) {
		roundHistory.value.push({ team, action: element });
	};
	const resetRoundHistoryElement = function () {
		roundHistory.value = [];
	};

	function getRoundHistory() {
		return roundHistory.value;
	}
	function getData() {
		return match.value;
	}

	function getPhase() {
		return roundPhase.value;
	}

	function getScore() {
		return matchScore.value;
	}

	function getLossBonus(team) {
		return lossBonus.value[team];
	}

	function getGrenades() {
		return grenades.value;
	}
	return { getLossBonus, getGrenades, loadMatchData, getData, getPhase, getScore, addRoundHistoryElement, resetRoundHistoryElement, getRoundHistory };
});
