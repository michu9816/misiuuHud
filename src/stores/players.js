import { defineStore } from "pinia";
import { ref } from "vue";
import { useGuiStore } from "./gui";
import { useMatchStore } from "./match";

export const usePlayersStore = defineStore("players", () => {
	const guiStore = useGuiStore();
	const matchStore = useMatchStore();

	const players = ref([]);
	const player = ref();

	function loadPlayers(playersData, playerData) {
		players.value = [];
		if (playersData) {
			for (let key of Object.keys(playersData)) {
				let playerData = playersData[key];
				if (playerData?.state?.health == 0 && playerData?.match_stats?.deaths == 0) {
					playerData.isCoach = true;
				}
				playerData.id = key;

				let availableWeapons = [];
				for (let weapon of Object.keys(playerData.weapons)) {
					availableWeapons.push(playerData.weapons[weapon]);
					if (playerData.weapons[weapon].state == "active") {
						playerData.activeWeapon = playerData.weapons[weapon];
					}
				}
				playerData.availableWeapons = availableWeapons;

				players.value.push(playerData);
			}

			player.value = playerData;
		}
	}

	function extendedStatistics() {
		const playerStatistics = guiStore.getData()?.playersStatistics.data
		const fisrtPlayerStatistics = playerStatistics.filter(obj => obj.player == playerStatistics[0].player);
		return (fisrtPlayerStatistics.map(obj => obj.round).length >= matchStore.getData()?.round + (matchStore.getData()?.roundInfo?.data?.phase == "over" ? 0 : 1)) && fisrtPlayerStatistics.map(obj => obj.round).filter(obj => obj == 0)?.length >= 0;
	}

	function getPlayers(team) {
		team = team?.toUpperCase();
		return players.value.filter((obj) => (team ? obj.team == team : obj) && !obj.isCoach);
	}

	function getPlayerDataById(id) {
		let playerData = players.value.find((obj) => obj.id == id);
		if (!playerData || !id) {
			return;
		}

		playerData.statistics = {
			dmg: guiStore.getPlayerDamage(id),
			adr: extendedStatistics() ? (
				guiStore.getPlayerDamage(id) /
				(matchStore.getData().round || 1)
			).toFixed(2) : undefined,
			hs: extendedStatistics() ? (parseInt(
				(playerData.match_stats.kills
					? guiStore.getPlayerHS(id) /* eslint-disable */ /
					playerData.match_stats.kills
					: 0) * 100)
			) : undefined,
			kd: parseFloat(
				parseInt(playerData.match_stats.kills) /
				(parseInt(playerData.match_stats.deaths) || 1)
			).toFixed(1),
			kills: playerData.match_stats.kills,
			rounds: matchStore.getData().round,
			equipment: playerData.state.equip_value,
			assists: playerData.match_stats.assists,
		};
		return playerData;
	}

	function getWatchingPlayerData() {
		return player.value;
	}

	function anyTeamIsPoor() {
		let ctMoney = 0;
		for (let player of getPlayers("CT")) {
			ctMoney += player.state.money;
			ctMoney += player.state.equip_value;
		}
		let tMoney = 0;
		for (let player of getPlayers("T")) {
			tMoney += player.state.money;
			tMoney += player.state.equip_value;
		}
		return ctMoney < 15000 || tMoney < 15000;
	}

	function someoneKilled3() {
		const kills = getPlayers().map((obj) => obj.state.round_kills);
		return kills.some((obj) => obj > 2);
	}

	function someoneHeadshoted3() {
		const kills = getPlayers().map((obj) => obj.state.round_killhs);
		return kills.some((obj) => obj > 2);
	}
	function someoneHighDMG() {
		const dmg = getPlayers().map((obj) => obj.state.round_totaldmg);
		return dmg.some((obj) => obj > 250);
	}

	return {
		loadPlayers,
		getPlayers,
		getPlayerDataById,
		getWatchingPlayerData,
		anyTeamIsPoor,
		someoneKilled3,
		someoneHeadshoted3,
		someoneHighDMG,
		extendedStatistics
	};
});
