<template>
	<div class="player" :class="[data.team, { dead: !data.health }]" :style="[position]" v-if="showPlayer">
		<img class="bomb" src="@/assets/img/elements/icon_bomb_default.png" v-if="data.bomb" />
		<div class="icon" :class="{ watching }" :style="[rotation]"></div>
		<div class="number">{{ observerSlot }}</div>
	</div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
const props = defineProps(['data', 'watching', 'mapSettings']);

const position = computed(() => {
	const positions = props.data.lastPostion?.position?.split(',');
	if (!positions?.length) {
		return undefined;
	}
	let leftInPercent = ((parseInt(positions[0]) + props.mapSettings?.offset.x) / props.mapSettings?.resolution / 1024) * 100;
	let topInPercent = ((parseInt(positions[1]) + props.mapSettings?.offset.y) / props.mapSettings?.resolution / 1024) * 100;
	const percentCorrection = getPercentCorrection(positions);
	if (percentCorrection !== undefined) {
		leftInPercent += percentCorrection?.x;
		topInPercent += percentCorrection?.y;
	}
	return `left:calc(${leftInPercent}% - 10px);bottom:calc(${topInPercent}% - 10px)`;
});

const getPercentCorrection = function (positions) {
	let z = parseFloat(positions[2]);
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

const rotation = computed(() => {
	let rotation;
	const rotations = props.data?.lastPostion?.forward?.split(',');
	if (!rotations?.length) {
		return undefined;
	}
	if (rotations[0] > 0) {
		rotation = 90 + parseFloat(rotations[1]) * -1 * 90;
	} else {
		rotation = 270 + parseFloat(rotations[1]) * 90;
	}

	return `transform:rotate(${rotation + 45}deg)`;
});

const showPlayer = computed(() => {
	return position.value || rotation.value;
});

const observerSlot = computed(() => {
	let slot = props.data?.observer_slot + 1;
	return slot == 10 ? 0 : slot;
});
</script>

<style>
.player {
	width: 20px;
	height: 20px;
	z-index: 2;
	position: absolute;
	transition-duration: 0.1s;
}
.icon {
	width: 18px;
	height: 18px;
	border-radius: 0 50% 50%;
	z-index: 2;
	position: absolute;
	transition-duration: 0.1s;
	border: 1px solid rgba(255, 255, 255, 0.5);
}
.icon.watching {
	border-color: rgba(255, 255, 255, 1);
	filter: drop-shadow(#ffffff 0px 0px 3px);
}
.dead {
	opacity: 0.5;
	filter: grayscale(1);
	z-index: 1;
}
.dead .icon {
	border-radius: 50%;
}
.number {
	position: absolute;
	width: 20px;
	height: 20px;
	font-size: 12px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	z-index: 2;
	transition-duration: 0.1s;
}
.T .icon {
	background: var(--color-background-t-bright);
}
.CT .icon {
	background: var(--color-background-ct-bright);
}
img.bomb {
	height: 15px;
	margin-top: 15px;
	z-index: 10;
	position: absolute;
}
</style>