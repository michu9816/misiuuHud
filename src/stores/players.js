import { defineStore } from "pinia";
import { ref } from "vue";
import { useGuiStore } from "./gui";
import { useMatchStore } from "./match";

export const usePlayersStore = defineStore("players", () => {
	const guiStore = useGuiStore();
	const matchStore = useMatchStore();

	const players = ref([]);
	function loadPlayers(playersData) {
		players.value = [];
		for (let key of Object.keys(playersData)) {
			let playerData = playersData[key];
			playerData.id = key;
			players.value.push(playerData);
		}
	}

	function getPlayers(team) {
		return players.value.filter((obj) => (team ? obj.team == team : obj));
	}

	function getPlayerDataById(id) {
		let playerData = players.value.find((obj) => obj.id == id);
		const playerSlot =
			playerData.observer_slot == 0 ? 10 : playerData.observer_slot;
		playerData.statistics = {
			adr: (
				guiStore.getPlayerDamage(playerSlot) /
				(matchStore.getData().round - 1)
			).toFixed(2),
			hs:
				(guiStore.getPlayerHS(playerSlot) /
					playerData.match_stats.kills) *
				100,
			kd: parseFloat(
				parseInt(playerData.match_stats.kills) /
					parseInt(playerData.match_stats.deaths)
			).toFixed(1),
			rounds: matchStore.getData().round,
			equipment: playerData.state.equip_value,
			assists: playerData.match_stats.assists,
		};
		return playerData;
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
		anyTeamIsPoor,
		someoneKilled3,
		someoneHeadshoted3,
		someoneHighDMG,
	};
});
