import { defineStore } from "pinia";
import { ref } from "vue";

export const useGuiStore = defineStore("gui", () => {
	const data = ref({
		playersStatistics: {
			damage: [[], [], [], [], [], [], [], [], [], []],
			hs: [[], [], [], [], [], [], [], [], [], []],
			show: false,
			type: "adr",
		},
	});

	function getData() {
		return data.value;
	}

	function setPlayerStatisticType(type) {
		data.value.playersStatistics.type = type;
	}

	function setPlayerStatisticVisibility(visibility) {
		data.value.playersStatistics.show = visibility;
	}

	function setPlayersDamage(players, round) {
		for (let player of Object.keys(players)) {
			let playerData = players[player];
			let observerSlot = playerData.observer_slot;
			if (observerSlot == 0) {
				observerSlot = 10;
			}
			data.value.playersStatistics.damage[observerSlot - 1][round] =
				playerData.state.round_totaldmg;
			data.value.playersStatistics.hs[observerSlot - 1][round] =
				playerData.state.round_killhs;
		}
	}

	function getPlayerDamage(id) {
		let damageSum = data.value.playersStatistics.damage[id - 1]?.reduce(
			function (a, b) {
				return a + b;
			},
			0
		);
		return damageSum;
	}

	function getPlayerHS(id) {
		let hsSum = data.value.playersStatistics.hs[id - 1]?.reduce(function (
			a,
			b
		) {
			return a + b;
		},
			0);
		return hsSum;
	}

	function restartStatistics() {
		data.value.playersStatistics = {
			damage: [[], [], [], [], [], [], [], [], [], []],
			hs: [[], [], [], [], [], [], [], [], [], []],
			show: false,
			type: "adr",
		}
	}
	return {
		getData,
		setPlayersDamage,
		getPlayerDamage,
		getPlayerHS,
		setPlayerStatisticType,
		setPlayerStatisticVisibility,
		restartStatistics
	};
});
