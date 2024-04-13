<template>
	<div class="minimap" v-if="showRadar">
		<div
			class="zoomable"
			:style="[
				mapCenter,
				{
					transform: `scale(${scale})`,
				},
			]">
			<div class="map" :style="{ backgroundImage: 'url(' + getMapBackground + ')' }"></div>
			<RadarPlayer
				:map-settings="mapSettings"
				v-for="player in players"
				:key="player.observer_slot"
				:data="player"
				:watching="player?.observer_slot == watchingPlayer?.observer_slot"></RadarPlayer>
			<RadarGrenade :map-settings="mapSettings" v-for="grenade in grenades" :key="grenade.id" :data="grenade.data"></RadarGrenade>
			<BombIcon :map-settings="mapSettings" :data="matchStore.getPhase()?.bombData"></BombIcon>
			<!-- {{ playersEdgePositions }} -->
			{{ scale }}
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

const playersEdgePositions = computed(() => {
	const positions = players.value?.filter((obj) => obj?.health)?.map((obj) => obj.lastPosition?.position);
	return {
		x: {
			min: Math.min(
				...positions?.map((obj) => {
					return convertToPercent(obj, 'x');
				})
			),
			max: Math.max(
				...positions?.map((obj) => {
					return convertToPercent(obj, 'x');
				})
			),
		},
		y: {
			min: Math.min(
				...positions?.map((obj) => {
					return convertToPercent(obj, 'y');
				})
			),
			max: Math.max(
				...positions?.map((obj) => {
					return convertToPercent(obj, 'y');
				})
			),
		},
	};

	function convertToPercent(positions, type) {
		const typesOrder = ['x', 'y', 'z'];
		if (!positions) {
			return undefined;
		}
		const position = parseFloat(positions?.split(',')[typesOrder.findIndex((obj) => obj == type)]);
		let percent = ((position + mapSettings.value?.offset[type]) / mapSettings.value?.resolution / 1024) * 100;
		const percentCorrection = getPercentCorrection(positions?.split(',')[2]);
		if (percentCorrection !== undefined) {
			percent += percentCorrection[type];
		}
		return percent;
	}

	function getPercentCorrection(positionZ) {
		let z = parseFloat(positionZ);
		if (mapSettings.value?.splits?.length > 0 && typeof z == 'number') {
			for (let i in mapSettings.value?.splits) {
				const split = mapSettings.value?.splits[i];
				if (z > split.bounds.bottom && z < split.bounds.top) {
					return {
						x: mapSettings.value?.splits[i]?.offset?.x,
						y: mapSettings.value?.splits[i]?.offset?.y,
					};
				}
			}
		}
		return undefined;
	}
});

const scale = computed(() => {
	let xDiff = playersEdgePositions.value?.x?.max - playersEdgePositions.value?.x?.min;
	let yDiff = playersEdgePositions.value?.y?.max - playersEdgePositions.value?.y?.min;
	let xPercentage = xDiff / 100 + 0.4;
	let yPercentage = yDiff / 100 + 0.4;
	const scale = Math.max(2 - Math.max(xPercentage, yPercentage, 0).toFixed(1), 1);
	return scale > 1.2 ? scale : 1;
});

const mapCenter = computed(() => {
	let xAvg = (50 - (playersEdgePositions.value?.x?.max + playersEdgePositions.value?.x?.min) / 2) * (scale.value - 1);
	let yAvg = -50 + ((playersEdgePositions.value?.y?.max + playersEdgePositions.value?.y?.min) / 2) * scale.value;
	return `margin-left:calc(${xAvg}%);margin-top:calc(${scale.value > 1.2 ? yAvg : 0}%)`;
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
	transition-duration: 3s;
}
.map {
	height: 100%;
	width: 100%;
	left: 0;
	top: 0;
	background-size: contain;
}
</style>
