<template>
	<div class="chartBox" v-if="chartVisible" :class="{ visible: chartVisibleClass }">
		<div class="title">statistics</div>
		<StatisticLabels :data="labels"></StatisticLabels>
		<PlayerLine v-for="player in players" :key="player.id" :data="player" :maxLeft="maxLeft" :maxRight="maxRight" :type="statisticsType"></PlayerLine>
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
// import { useGuiStore } from '@/stores/gui';
import { useMatchStore } from '@/stores/match';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js';
import { usePlayersStore } from '@/stores/players';
import PlayerLine from './Statistics/PlayerLine.vue';
import StatisticLabels from './Statistics/StatisticLabels.vue';

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement, Filler);

// const guiStore = useGuiStore();
const players = computed(() => {
	return usePlayersStore()
		.getPlayers()
		.sort((b, a) => {
			return a.match_stats?.kills - b.match_stats?.kills;
		});
});
const maxLeft = computed(() => {
	return Math.max(...players.value.map((obj) => obj.match_stats?.deaths), 10);
});
const maxRight = computed(() => {
	return Math.max(...players.value.map((obj) => obj.match_stats?.kills), 10);
});

const statisticsType = computed(() => {
	return usePlayersStore()?.extendedStatistics() ? 'extended' : 'default';
});

const labels = computed(() => {
	switch (statisticsType.value) {
		case 'default':
			return ['Player', 'Deaths', 'KD', 'Kills'];
		case 'extended':
			return ['Player', 'Deaths', 'ADR', 'Kills'];
		default:
			return [];
	}
});

const chartVisible = ref(true);
const chartVisibleClass = ref(true);
const chartOpacity = computed(() => {
	const phase = useMatchStore()?.getPhase()?.timeout;
	const showChart = ['CT', 'T'].includes(phase);
	const round = parseInt(useMatchStore()?.getScore()?.round);
	return true; // eslint-disable-next-line
	return showChart && round > 5;
});

const chartTeam = ref();

watch(chartOpacity, (value) => {
	if (value) {
		setTimeout(() => {
			chartVisible.value = true;
			chartTeam.value = useMatchStore()?.getPhase()?.timeout.toLowerCase();
			setTimeout(() => {
				chartVisibleClass.value = true;
			}, 2000);
		}, 1000);
	} else {
		chartVisibleClass.value = false;
		setTimeout(() => {
			chartVisible.value = false;
		}, 1000);
	}
});
</script>

<style scoped>
.chartBox {
	width: 900px;
	max-height: 470px;
	margin: auto auto;
	background: rgb(0 0 0 / 90%);
	padding: 30px;
	margin-top: 150px;
	opacity: 0;
	transition-duration: 0.5s;
	border-radius: 5px;
	position: absolute;
	left: calc(50% - 480px);
}

.chartBox.visible {
	opacity: 1;
}
.title {
	width: 100%;
	color: white;
	text-transform: uppercase;
	font-size: 25px;
}
</style>
