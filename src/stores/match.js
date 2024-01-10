import { defineStore } from "pinia";
import { ref } from "vue";
import { useGuiStore } from "./gui";
import { usePlayersStore } from "./players";

export const useMatchStore = defineStore("match", () => {
	const match = ref();
	function loadMatchData(matchData, roundData, timeData, bombData) {
		match.value = matchData;
		if (match.value) {
			match.value.roundInfo = {
				data: roundData,
				timer: timeData,
				bomb: bombData,
			};
		}

		if (timeData?.phase == "over") {
			const guiStore = useGuiStore();
			const playersStore = usePlayersStore();

			let statistic = "adr";
			const roundSideNr = matchData.round % 15;
			const extendedStatistics =
				guiStore.getData().playersStatistics.damage[0] != null;

			const someoneKilled3 = playersStore.someoneKilled3();
			const someoneHighDMG = playersStore.someoneHighDMG();
			const anyTeamIsPoor = playersStore.anyTeamIsPoor();
			const someoneHeadshoted3 = playersStore.someoneHeadshoted3();
			guiStore.setPlayerStatisticVisibility(true);
			if (roundSideNr < 3 && roundSideNr > 1) {
				statistic = "equipment";
			} else if (roundSideNr >= 3) {
				if (someoneHeadshoted3 && extendedStatistics) {
					statistic = "hs";
				} else if (someoneKilled3) {
					statistic = "kd";
				} else if (someoneHighDMG) {
					statistic = "assists";
				} else if (anyTeamIsPoor && roundSideNr >= 6) {
					statistic = "equipment";
				} else {
					if (extendedStatistics) {
						statistic = "adr";
					} else {
						statistic = "kills";
					}
				}
			} else {
				guiStore.setPlayerStatisticVisibility(false);
			}
			guiStore.setPlayerStatisticType(statistic);
		}
	}

	function getData() {
		return match.value;
	}
	return { loadMatchData, getData };
});
