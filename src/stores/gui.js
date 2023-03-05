import { defineStore } from "pinia";
import { ref } from "vue";

export const useGuiStore = defineStore("gui", () => {
	const data = ref({
		playersStatistics: {
			damage: [[], [], [], [], [], [], [], [], [], []],
			show: true,
			type: "adr",
		},
	});

	function getData() {
		return data.value;
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
		}
		console.log(round);
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
	return { getData, setPlayersDamage, getPlayerDamage };
});
