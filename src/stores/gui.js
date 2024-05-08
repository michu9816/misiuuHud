import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGuiStore = defineStore('gui', () => {
	const data = ref({
		playersStatistics: {
			data: [],
			show: false,
			type: 'adr',
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
			let playersList = Object.keys(players);
			playersList = playersList.map((obj) => players[obj]);
			for (let player of playersList) {
				let playerData = player;
				let observerSlot = playerData.observer_slot;
				if (observerSlot == 0) {
					observerSlot = 10;
				}
				const playersAlive = playersList.filter((obj) => obj.state?.health);

				const duelKills = playersAlive.length == 9 ? playerData.state.round_kills || 0 : undefined;
				const duelDeaths = playersAlive.length == 9 ? (playerData.state.health == 0 ? 1 : 0) : undefined;

				let dmgData = {
					player: player.id,
					dmg: playerData.state.round_totaldmg,
					hs: playerData.state.round_killhs,
					duelDeaths,
					duelKills,
					round,
				};

				const playerStatisticInThisRound = data.value.playersStatistics.data.find((obj) => obj.player == player.id && obj.round == round);

				if (playerStatisticInThisRound) {
					if (
						playerStatisticInThisRound.dmg != playerData.state.round_totaldmg ||
						playerStatisticInThisRound.hs != playerData.state.round_killhs ||
						playerStatisticInThisRound.duelKills != duelKills ||
						playerStatisticInThisRound.duelDeaths != duelDeaths
					) {
						playerStatisticInThisRound.dmg = playerData.state.round_totaldmg;
						playerStatisticInThisRound.hs = playerData.state.round_killhs;
						if (playerStatisticInThisRound.duelKills == undefined) {
							playerStatisticInThisRound.duelKills = duelKills;
						}
						if (playerStatisticInThisRound.duelDeaths == undefined) {
							playerStatisticInThisRound.duelDeaths = duelDeaths;
						}
					}
				} else {
					data.value.playersStatistics.data.push(dmgData);
				}
			}
		} catch (e) {
			restartStatistics();
		}
	}

	function getPlayerDamage(id, round) {
		let damageList = data.value.playersStatistics.data
			.filter((obj) => obj.player == id && (round !== undefined ? obj.round <= round : true))
			?.map((obj) => {
				return obj.dmg;
			});
		let damageSum = damageList.reduce((a, b) => a + b, 0);
		return damageSum;
	}

	function getPlayerHS(id) {
		let hsSum = data.value.playersStatistics.data
			.filter((obj) => obj.player == id)
			?.map((obj) => obj.hs)
			.reduce(function (a, b) {
				return a + b;
			}, 0);
		return hsSum;
	}

	function getDuels(id) {
		let duelsWon = data.value.playersStatistics.data
			.filter((obj) => obj.player == id && obj.duelKills !== undefined)
			?.map((obj) => obj.duelKills)
			.reduce(function (a, b) {
				return a + b;
			}, 0);
		let duelsLost = data.value.playersStatistics.data
			.filter((obj) => obj.player == id && obj.duelDeaths !== undefined)
			?.map((obj) => obj.duelDeaths)
			.reduce(function (a, b) {
				return a + b;
			}, 0);
		return {
			won: duelsWon || 0,
			lost: duelsLost || 0,
		};
	}

	function restartStatistics() {
		data.value.playersStatistics = {
			data: [],
			show: false,
			type: 'adr',
		};
	}

	function getOrderedStatistics() {
		return data.value.playersStatistics.data.sort((a, b) => a.round - b.round);
	}
	return {
		getData,
		getDuels,
		setPlayersDamage,
		getPlayerDamage,
		getPlayerHS,
		setPlayerStatisticType,
		setPlayerStatisticVisibility,
		restartStatistics,
		getOrderedStatistics,
	};
});
