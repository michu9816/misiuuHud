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
			kd: parseFloat(
				parseInt(playerData.match_stats.kills) /
					parseInt(playerData.match_stats.deaths)
			).toFixed(1),
			rounds: matchStore.getData().round,
		};
		return playerData;
	}

	return { loadPlayers, getPlayers, getPlayerDataById };
});
