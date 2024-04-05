<template>
	<div class="chartBox" v-if="chartVisible" :class="{ visible: chartVisibleClass }">
		<Line id="my-chart-id" :options="chartOptions" :data="chartData" />
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useGuiStore } from '@/stores/gui';
import { Line } from 'vue-chartjs';
import { useMatchStore } from '@/stores/match';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js';
import { usePlayersStore } from '@/stores/players';

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement, Filler);

const guiStore = useGuiStore();

const chartVisible = ref(false);
const chartVisibleClass = ref(false);
const chartOpacity = computed(() => {
	const phase = useMatchStore()?.getPhase()?.timeout;
	const showChart = ['CT', 'T'].includes(phase);
	const round = parseInt(useMatchStore()?.getScore()?.round);
	return showChart && round > 5 && usePlayersStore()?.extendedStatistics();
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

const players = computed(() => {
	return usePlayersStore().getPlayers(chartTeam.value);
});

const datasets = computed(() => {
	const borderColors = {
		t: ['#E02D04', '#E05304', '#E07B04', '#E09804', '#E0B204'],
		ct: ['#0004E0', '#004BE0', '#0192E1', '#00D9E0', '#00E09C'],
	};
	const datasets = players.value.map((obj, index) => {
		const data = guiStore
			.getOrderedStatistics()
			?.filter((statistics) => statistics.player == obj.id)
			.map((statistics, statisticIndex) => {
				return guiStore.getPlayerDamage(obj.id, statisticIndex);
			});
		return {
			label: obj.name,
			borderColor: borderColors[chartTeam.value || 't'][index],
			data: data.filter((obj, index) => index < data.length - 1),
			fill: false,
			tenstion: 0.1,
			labels: guiStore
				.getOrderedStatistics()
				?.filter((statistics) => statistics.player == obj.id)
				.map((statistics) => parseInt(statistics.round) + 1)
				.filter((obj, index) => index < data.length - 1),
		};
	});
	return datasets;
});

const chartData = computed(() => {
	return {
		labels: datasets.value[0]?.labels,
		datasets: datasets.value,
	};
});
const chartOptions = ref({
	responsive: true,
	plugins: {
		title: {
			display: true,
			text: 'Players total damage history',
			padding: {
				top: 10,
				bottom: 30,
			},
			font: {
				size: '20px',
			},
			color: 'white',
		},
		legend: {
			labels: {
				color: '#ffffff',
			},
		},
	},
	scales: {
		x: {
			display: true,
			ticks: {
				color: '#ffffff',
			},
			title: {
				display: true,
				text: 'Round',
				color: '#ffffff ',
				font: {
					variant: 'all-small-caps',
					family: 'Calibri',
					size: '18px',
					lineHeight: 1.2,
					weight: 'bold',
				},
			},
		},
		y: {
			display: true,
			ticks: {
				color: '#ffffff',
			},
			title: {
				display: true,
				text: 'Damage',
				color: '#ffffff ',
				font: {
					variant: 'all-small-caps',
					family: 'Calibri',
					size: '18px',
					lineHeight: 1.2,
					weight: 'bold',
				},
			},
		},
	},
});
</script>

<style scoped>
.chartBox {
	max-width: 950px;
	max-height: 450px;
	display: flex;
	margin: auto auto;
	background: rgb(0 0 0 / 90%);
	padding: 30px;
	margin-top: 150px;
	opacity: 0;
	transition-duration: 0.5s;
	border-radius: 5px;
}

.chartBox.visible {
	opacity: 1;
}
</style>
