import { defineStore } from "pinia";
import { ref } from "vue";

export const useMatchStore = defineStore("match", () => {
	const match = ref();
	function loadMatchData(matchData) {
		match.value = matchData;
	}

	function loadMatchRoundData(roundData) {
		match.value.round = roundData;
	}

	function getData() {
		return match.value;
	}
	return { loadMatchData, loadMatchRoundData, getData };
});
