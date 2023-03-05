import { defineStore } from "pinia";
import { ref } from "vue";

export const useMatchStore = defineStore("match", () => {
	const match = ref();
	function loadMatchData(matchData, roundData, timeData) {
		match.value = matchData;
		match.value.roundInfo = {
			data: roundData,
			timer: timeData,
		};
	}

	function getData() {
		return match.value;
	}
	return { loadMatchData, getData };
});
