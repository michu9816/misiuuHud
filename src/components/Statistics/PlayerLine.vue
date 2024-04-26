<template>
	<div class="player" :class="[data.team]">
		<div class="nick">{{ data.name }}</div>
		<div class="statistics">
			<div class="statistic left">
				<div class="background" :style="{ width: `${statisticsWidth[0]}%` }"></div>
				<div class="value">{{ statistics[0] }}</div>
			</div>
			<div class="statistic middle" v-if="true && statistics[1]">{{ statistics[1] }}</div>
			<div class="statistic right">
				<div class="background" :style="{ width: `${statisticsWidth[1]}%` }"></div>
				<div class="value">{{ statistics[2] }}</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { usePlayersStore } from '@/stores/players';
import { defineProps, computed } from 'vue';
const props = defineProps(['data', 'maxLeft', 'maxRight', 'type']);

const extendedStatistics = computed(() => {
	return usePlayersStore().getPlayerDataById(props.data.id)?.statistics;
});

const statistics = computed(() => {
	console.log(extendedStatistics.value);
	switch (props.type) {
		case 'default':
			return [
				props.data?.match_stats?.deaths,
				(props.data?.match_stats?.kills / (props.data?.match_stats?.deaths || 0)).toFixed(1),
				props.data?.match_stats?.kills,
			];
		case 'extended':
			return [props.data?.match_stats?.deaths, extendedStatistics.value?.adr, props.data?.match_stats?.kills];
		default:
			return undefined;
	}
});

const statisticsWidth = computed(() => {
	return [Math.round((statistics.value[0] / props.maxLeft) * 100), Math.round((statistics.value[2] / props.maxRight) * 100)];
});
</script>
<style scoped>
.player {
	display: grid;
	grid-template-columns: 215px 500px 215px;
	color: white;
	margin-top: 5px;
	text-shadow: 0 0 5px #000;
	background: -webkit-linear-gradient(left, #ff000000, rgb(255 255 255 / 10%), #ffffff00);
}
.player .nick {
	font-size: 18px;
	text-align: left;
	padding-left: 10px;
	display: flex;
	align-items: center;
}
.statistic {
	position: relative;
}
.statistic .value {
	padding: 3px 15px;
	z-index: 2;
	position: relative;
}
.statistic:not(.middle) {
	font-size: 24px;
	font-weight: bold;
}
.statistic.middle {
	display: flex;
	justify-content: center;
	align-items: center;
	background: #696969;
}
.statistic.left .value {
	text-align: right;
}
.statistic.right .value {
	text-align: left;
}
.player .statistics {
	display: grid;
	grid-template-columns: 200px 70px 200px;
}
.background {
	width: 0%;
	transition-duration: 1s;
}
.statistic.left .background {
	right: 0;
}
.T .background {
	background: var(--color-background-t);
	height: 100%;
	position: absolute;
}
.T .statistic.right .background {
	background: var(--color-text-t);
}
.statistic.left .background {
	border-radius: 5px 0 0 5px;
}
.statistic.right .background {
	border-radius: 0 5px 5px 0;
}
.CT .background {
	background: var(--color-background-ct);
	height: 100%;
	position: absolute;
}
.CT .statistic.right .background {
	background: var(--color-text-ct);
}
</style>
