<template>
	<div class="bomb" :style="[position]" v-if="showIcon">
		<img :src="getBombIcon" />
	</div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
const props = defineProps(['data', 'mapSettings']);

const position = computed(() => {
	const positions = props.data?.position?.split(',');
	if (!positions?.length) {
		return undefined;
	}

	const leftInPercent = ((parseInt(positions[0]) + props.mapSettings?.offset.x) / props.mapSettings?.resolution / 1024) * 100;
	const topInPercent = ((parseInt(positions[1]) + props.mapSettings?.offset.y) / props.mapSettings?.resolution / 1024) * 100;
	return `left:calc(${leftInPercent}% - 10px);bottom:calc(${topInPercent}% - 10px)`;
});

const showIcon = computed(() => {
	return props.data?.state != 'carried' && props.data?.state;
});

const getBombIcon = computed(() => {
	let color = 'red';
	if (props.data?.state == 'dropped') {
		color = 'default';
	}
	return require(`@/assets/img/elements/icon_c4_${color}.png`);
});
</script>

<style scoped>
.bomb {
	width: 20px;
	height: 20px;
	z-index: 1;
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
</style>
