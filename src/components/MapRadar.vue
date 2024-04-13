<template>
	<div class="minimap" v-if="showRadar">
		<div class="zoomable">
			<div class="map" :style="{ backgroundImage: 'url(' + getMapBackground + ')' }"></div>
			<RadarPlayer
				:map-settings="mapSettings"
				v-for="player in players"
				:key="player.observer_slot"
				:data="player"
				:watching="player?.observer_slot == watchingPlayer?.observer_slot"></RadarPlayer>
			<RadarGrenade :map-settings="mapSettings" v-for="grenade in grenades" :key="grenade.id" :data="grenade.data"></RadarGrenade>
			<BombIcon :map-settings="mapSettings" :data="matchStore.getPhase()?.bombData"></BombIcon>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import RadarPlayer from './Radar/RadarPlayer.vue';
import RadarGrenade from './Radar/RadarGrenade.vue';
import BombIcon from './Radar/BombIcon.vue';
import { usePlayersStore } from '@/stores/players.js';
import { useMatchStore } from '@/stores/match';

const playersStore = usePlayersStore();
const matchStore = useMatchStore();

const players = computed(() => {
	return playersStore.getRadarPlayers();
});

const watchingPlayer = computed(() => {
	return playersStore.getWatchingPlayerData();
});

const grenades = computed(() => {
	return matchStore.getGrenades();
});

const showRadar = computed(() => {
	return matchStore.getData();
});

const getMapBackground = computed(() => {
	const map = matchStore.getData();
	return require(`@/assets/maps/${map}/radar.png`);
});

const mapSettings = computed(() => {
	const map = matchStore.getData();
	return require(`@/assets/maps/${map}/meta.json`);
});
</script>

<style scoped>
.minimap {
	position: absolute;
	top: 10px;
	left: 10px;
	background: var(--color-background-dark-transparent);
	border: 1px solid rgba(255, 255, 255, 0.2);
	width: 350px;
	height: 350px;
	border-radius: 5px;
	overflow: hidden;
}
.zoomable {
	height: 100%;
	width: 100%;
}
.map {
	height: 100%;
	width: 100%;
	left: 0;
	top: 0;
	background-size: contain;
}
</style>
