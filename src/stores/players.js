import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useGuiStore } from './gui';
import { useMatchStore } from './match';

export const usePlayersStore = defineStore('players', () => {
	const guiStore = useGuiStore();
	const matchStore = useMatchStore();

	const players = ref([]);
	const player = ref();

	const watchingPlayer = ref();
	const playersBottomInformations = ref([]);
	const playersRadarInformations = ref([]);

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
					if (playerData.weapons[weapon].state == 'active') {
						playerData.activeWeapon = playerData.weapons[weapon];
					}
				}
				playerData.availableWeapons = availableWeapons;

				players.value.push(playerData);

				let playerBottomInformations = playersBottomInformations.value.find((obj) => obj.id == key);
				if (!playerBottomInformations) {
					playersBottomInformations.value.push({
						id: key,
						name: undefined,
						health: undefined,
						helmet: undefined,
						armor: undefined,
						team: undefined,
						defusekit: undefined,
						bomb: false,
						weapons: [],
						weapon: {
							ammoClip: undefined,
							ammoReserve: undefined,
						},
						statistics: {
							kills: undefined,
							roundKills: undefined,
							deaths: undefined,
							assists: undefined,
							money: undefined,
							equip_value: undefined,
						},
					});
				}

				playerBottomInformations = playersBottomInformations.value.find((obj) => obj.id == key);

				playerBottomInformations.health = playerData?.state?.health;
				playerBottomInformations.helmet = playerData?.state?.helmet;
				playerBottomInformations.armor = playerData?.state?.armor;
				playerBottomInformations.flashed = playerData?.state?.flashed;
				playerBottomInformations.observer_slot = playerData?.observer_slot;
				playerBottomInformations.team = playerData?.team;
				playerBottomInformations.name = playerData?.name;
				playerBottomInformations.defusekit = playerData?.state?.defusekit;
				playerBottomInformations.bomb = playerData?.availableWeapons?.findIndex((obj) => obj.name == 'weapon_c4') != -1;
				playerBottomInformations.weapons = playerData?.availableWeapons?.map((obj) => {
					return { type: obj.type, name: obj.name, state: obj.state };
				});
				playerBottomInformations.weapon.ammoClip = playerData?.activeWeapon?.ammo_clip;
				playerBottomInformations.weapon.ammoReserve = playerData?.activeWeapon?.ammo_reserve;
				playerBottomInformations.statistics.kills = playerData?.match_stats?.kills;
				playerBottomInformations.statistics.roundKills = playerData?.state?.round_kills;
				playerBottomInformations.statistics.deaths = playerData?.match_stats?.deaths;
				playerBottomInformations.statistics.assists = playerData?.match_stats?.assists;
				playerBottomInformations.statistics.money = playerData?.state?.money;
				playerBottomInformations.statistics.equip_value = playerData?.state?.equip_value;

				let playerRadarInformations = playersRadarInformations.value.find((obj) => obj.id == key);
				if (!playerRadarInformations) {
					playersRadarInformations.value.push({
						id: key,
						health: undefined,
						team: undefined,
						defusekit: undefined,
						bomb: false,
						weapon: {
							ammoClip: undefined,
							ammoReserve: undefined,
						},
					});
				}

				playerRadarInformations = playersRadarInformations.value.find((obj) => obj.id == key);

				if (playerRadarInformations?.health > 0) {
					playerRadarInformations.lastPostion = {
						position: playerData.position,
						forward: playerData.forward,
					};
				}

				playerRadarInformations.health = playerData?.state?.health;
				playerRadarInformations.flashed = playerData?.state?.flashed;
				playerRadarInformations.observer_slot = playerData?.observer_slot;
				playerRadarInformations.team = playerData?.team;
				playerRadarInformations.defusekit = playerData?.state?.defusekit;
				playerRadarInformations.bomb = playerData?.availableWeapons?.findIndex((obj) => obj.name == 'weapon_c4') != -1;
				playerRadarInformations.weapon.ammoClip = playerData?.activeWeapon?.ammo_clip;
				playerRadarInformations.weapon.ammoReserve = playerData?.activeWeapon?.ammo_reserve;
			}

			player.value = playerData;
			watchingPlayer.value = playerData?.steamid;
		} else {
			playersRadarInformations.value = [];
		}
	}

	function extendedStatistics() {
		const playerStatistics = guiStore.getData()?.playersStatistics.data;
		const fisrtPlayerStatistics = playerStatistics.filter((obj) => obj.player == playerStatistics[0].player);
		return (
			fisrtPlayerStatistics.map((obj) => obj.round).length >= matchStore.getScore()?.round + (matchStore.getPhase()?.round == 'over' ? 0 : 1) &&
			fisrtPlayerStatistics.map((obj) => obj.round).filter((obj) => obj == 0)?.length >= 0
		);
	}

	function getPlayers(team) {
		team = team?.toUpperCase();
		return players.value.filter((obj) => (team ? obj.team == team : obj) && !obj.isCoach);
	}

	function getRadarPlayers(team) {
		team = team?.toUpperCase();
		return playersRadarInformations.value.filter((obj) => (team ? obj.team == team : obj) && !obj.isCoach);
	}

	function getPlayerDataById(id) {
		let playerData = playersBottomInformations.value.find((obj) => obj.id == id);
		if (!playerData || !id) {
			return;
		}

		playerData.statistics.dmg = guiStore.getPlayerDamage(id);
		playerData.statistics.adr = extendedStatistics() ? (guiStore.getPlayerDamage(id) / (matchStore.getScore().round || 1)).toFixed(2) : undefined;
		playerData.statistics.hs = extendedStatistics()
			? parseInt((playerData.statistics.kills ? guiStore.getPlayerHS(id) /* eslint-disable */ / playerData.statistics.kills : 0) * 100)
			: undefined;
		playerData.statistics.kd = parseFloat(parseInt(playerData.statistics.kills) / (parseInt(playerData.statistics.deaths) || 1)).toFixed(1);
		playerData.statistics.kills = playerData.statistics.kills;
		playerData.statistics.rounds = matchStore.getScore()?.round;
		playerData.statistics.equipment = playerData.statistics.equip_value;
		playerData.statistics.assists = playerData.statistics.assists;

		return playerData;
	}

	function getPlayerBottomDataById(id) {
		let playerData = playersBottomInformations.value.find((obj) => obj.id == id);
		return playerData;
	}

	function getWatchingPlayerData() {
		return player.value;
	}

	function getWatchingPlayerBasicData() {
		return playersBottomInformations.value.find((obj) => obj.id == watchingPlayer.value);
	}

	function anyTeamIsPoor() {
		let ctMoney = 0;
		for (let player of getPlayers('CT')) {
			ctMoney += player.state.money;
			ctMoney += player.state.equip_value;
		}
		let tMoney = 0;
		for (let player of getPlayers('T')) {
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
		getRadarPlayers,
		getPlayerDataById,
		getWatchingPlayerData,
		anyTeamIsPoor,
		someoneKilled3,
		someoneHeadshoted3,
		someoneHighDMG,
		extendedStatistics,
		getPlayerBottomDataById,
		getWatchingPlayerBasicData,
	};
});
