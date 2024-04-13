<template>
	<div class="grenade" :style="[position]" :class="[team, { inferno: data.type == 'inferno' }]">
		<img :src="getGrenadeIcon" v-if="showIcon" />
		<div class="smoke" v-if="data.type == 'smoke' && parseFloat(data.effecttime) > 0" :class="{ hide: parseFloat(data.effecttime) > 20 }"></div>
		<div class="flame" v-for="flame in flames" :key="flame" :style="flamePosition(flame)" :class="{ hide: data.lifetime > 6 }"></div>
	</div>
</template>

<script setup>
import { usePlayersStore } from '@/stores/players';
import { defineProps, computed } from 'vue';
const props = defineProps(['data', 'mapSettings']);

const players = usePlayersStore();

const team = computed(() => {
	return players.getPlayerDataById(props.data.owner)?.team;
});

const position = computed(() => {
	const positions = props.data.position?.split(',');
	if (!positions?.length) {
		return undefined;
	}

	let leftInPercent = ((parseInt(positions[0]) + props.mapSettings?.offset.x) / props.mapSettings?.resolution / 1024) * 100;
	let topInPercent = ((parseInt(positions[1]) + props.mapSettings?.offset.y) / props.mapSettings?.resolution / 1024) * 100;
	const percentCorrection = getPercentCorrection(positions[2]);
	if (percentCorrection !== undefined) {
		leftInPercent += percentCorrection?.x;
		topInPercent += percentCorrection?.y;
	}
	return `left:calc(${leftInPercent}% - 10px);bottom:calc(${topInPercent}% - 10px)`;
});

const flamePosition = function (flame) {
	const positions = flame?.split(',');
	if (!positions?.length) {
		return undefined;
	}

	let leftInPercent = ((parseInt(positions[0]) / 2 + props.mapSettings?.offset.x) / props.mapSettings?.resolution / 1024) * 100;
	let topInPercent = ((parseInt(positions[1]) / 2 + props.mapSettings?.offset.y) / props.mapSettings?.resolution / 1024) * 100;
	const percentCorrection = getPercentCorrection(positions[2] / 2);
	if (percentCorrection !== undefined) {
		leftInPercent += percentCorrection?.x;
		topInPercent += percentCorrection?.y;
	}
	return `left:calc(${leftInPercent}% - 10px);bottom:calc(${topInPercent}% - 10px)`;
};

const getPercentCorrection = function (positionZ) {
	let z = parseFloat(positionZ);
	if (props.mapSettings.splits?.length > 0 && typeof z == 'number') {
		for (let i in props.mapSettings.splits) {
			const split = props.mapSettings.splits[i];
			if (z > split.bounds.bottom && z < split.bounds.top) {
				return {
					x: props.mapSettings?.splits[i]?.offset?.x,
					y: props.mapSettings?.splits[i]?.offset?.y,
				};
			}
		}
	}
	return undefined;
};

const showIcon = computed(() => {
	switch (props.data.type) {
		case 'inferno':
			return false;
		case 'smoke':
			return props.data.effecttime < 15;
		case 'frag':
			return parseFloat(props.data.velocity?.split(',')[0]);
		default:
			return true;
	}
});

const flames = computed(() => {
	if (props.data.type == 'inferno') {
		return Object.values(props.data.flames);
	} else {
		return [];
	}
});

const getGrenadeIcon = computed(() => {
	let name;
	switch (props.data.type) {
		case 'smoke':
			name = 'smokegrenade';
			break;
		case 'inferno':
			name = 'incgrenade';
			break;
		case 'firebomb':
			name = 'incgrenade';
			break;
		case 'frag':
			name = 'hegrenade';
			break;
		default:
			name = 'flashbang';
			break;
	}
	return require(`@/assets/img/grenades/weapon_${name}_CT.png`);
});
</script>

<style scoped>
.grenade {
	width: 20px;
	height: 20px;
	z-index: 2;
	position: absolute;
}
.grenade.inferno {
	top: 0;
	height: 100%;
	width: 100%;
}
img {
	height: 20px;
}
.T img {
	filter: hue-rotate(135deg);
}
.smoke {
	width: 30px;
	height: 30px;
	position: absolute;
	top: 0;
	left: -5px;
	border-radius: 50%;
	opacity: 1;
	transition-duration: 4s;
	animation: growUp 1s;
}
.T .smoke {
	background: -webkit-radial-gradient(rgb(170, 147, 147) 20%, rgb(158, 137, 137) 50%, transparent 80%);
}
.CT .smoke {
	background: -webkit-radial-gradient(rgb(128, 143, 172) 20%, rgb(101, 119, 139) 50%, transparent 80%);
}
.smoke.hide {
	opacity: 0;
}
.flame {
	background: red;
	width: 5px;
	height: 5px;
	border-radius: 50%;
	position: absolute;
	transition-duration: 1s;
	opacity: 1;
}
.flame.hide {
	opacity: 0;
}
@keyframes growUp {
	0% {
		transform: scale(0);
	}
	100% {
		transform: scale(1);
	}
}
</style>
