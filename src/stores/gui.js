import { defineStore } from "pinia";
import { ref } from "vue";

export const useGuiStore = defineStore("gui", () => {
	const data = ref({
		playersStatistics: {
			data: [],
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
		try {
			for (let player of Object.keys(players)) {
				let playerData = players[player];
				let observerSlot = playerData.observer_slot;
				if (observerSlot == 0) {
					observerSlot = 10;
				}

				let dmgData = {
					player,
					dmg: playerData.state.round_totaldmg,
					hs: playerData.state.round_killhs,
					round
				}

				const playerStatisticInThisRound = data.value.playersStatistics.data.find(obj => obj.player == player && obj.round == round);
				if (playerStatisticInThisRound) {
					if (playerStatisticInThisRound.dmg != playerData.state.round_totaldmg && playerStatisticInThisRound.hs != playerData.state.round_killhs) {
						playerStatisticInThisRound.dmg = playerData.state.round_totaldmg;
						playerStatisticInThisRound.hs = playerData.state.round_killhs;
					}
				} else {
					data.value.playersStatistics.data.push(dmgData)
				}
			}
		} catch (e) {
			restartStatistics();
		}
	}

	function getPlayerDamage(id) {
		let damageSum = data.value.playersStatistics.data.filter(obj => obj.player == id)?.map(obj => obj.dmg).reduce(
			function (a, b) {
				return a + b;
			},
			0
		);
		return damageSum;
	}

	function getPlayerHS(id) {
		let hsSum = data.value.playersStatistics.data.filter(obj => obj.player == id)?.map(obj => obj.hs).reduce(
			function (a, b) {
				return a + b;
			},
			0);
		return hsSum;
	}

	function restartStatistics() {
		data.value.playersStatistics = {
			data: [],
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
