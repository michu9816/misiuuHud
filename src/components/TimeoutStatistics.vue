<template>
	<div class="chartBox" :class="{ visible: chartVisibleClass }">
		<div class="title">{{ title }}</div>
		<div v-if="chartOpacity.type == 'scoreboard' && chartOpacity.show" class="scoreboard">
			<div v-for="team in ['CT', 'T']" :key="team">
				<ScoreboardStatisticLabels :data="labels"></ScoreboardStatisticLabels>
				<ScoreboardPlayerLine
					v-for="(player, index) in players.filter((obj) => obj.team == team)"
					:key="player.id"
					:data="player"
					:maxLeft="maxLeft"
					:maxRight="maxRight"
					:type="chartOpacity.type"
					:index="index"></ScoreboardPlayerLine>
			</div>
		</div>
		<div v-else-if="chartOpacity.type && chartOpacity.show">
			<StatisticLabels :data="labels"></StatisticLabels>
			<PlayerLine
				v-for="(player, index) in players"
				:key="player.id"
				:data="player"
				:maxLeft="maxLeft"
				:maxRight="maxRight"
				:type="chartOpacity.type"
				:index="index"></PlayerLine>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
// import { useGuiStore } from '@/stores/gui';
import { useMatchStore } from '@/stores/match';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js';
import { usePlayersStore } from '@/stores/players';
import PlayerLine from './Statistics/PlayerLine.vue';
import ScoreboardPlayerLine from './Statistics/ScoreboardPlayerLine.vue';
import StatisticLabels from './Statistics/StatisticLabels.vue';
import ScoreboardStatisticLabels from './Statistics/ScoreboardStatisticLabels.vue';

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement, Filler);

// const guiStore = useGuiStore();

const playersOrderedByDuels = ref([]);
const playersOrderedByKills = ref([]);

const players = computed(() => {
	switch (chartOpacity.value?.type) {
		case 'duels':
			return playersOrderedByDuels.value;
		default:
			return playersOrderedByKills.value;
	}
});
const maxLeft = computed(() => {
	return Math.max(...players.value.map((obj) => obj.match_stats?.deaths), 10);
});
const maxRight = computed(() => {
	return Math.max(...players.value.map((obj) => obj.match_stats?.kills), 10);
});

const labels = computed(() => {
	switch (chartOpacity.value?.type) {
		case 'scoreboard':
			return ['Player', 'Kills', 'Deaths', 'Assists', 'KD'];
		case 'default':
			return ['Player', 'Deaths', 'KD', 'Kills'];
		case 'extended':
			return ['Player', 'Deaths', 'ADR', 'Kills'];
		case 'duels':
			return ['Player', 'First death', 'First kill'];
		default:
			return [];
	}
});

const title = computed(() => {
	switch (chartOpacity.value?.type) {
		case 'scoreboard':
			return 'scoreboard';
		case 'default':
		case 'extended':
			return 'players statistics';
		case 'duels':
			return 'opening duels';
		default:
			return [];
	}
});

const chartVisible = ref(false);
const chartVisibleClass = ref(false);

const roundTime = computed(() => {
	const time = useMatchStore()?.getPhase()?.roundTimer;
	return time;
});

const chartOpacity = computed(() => {
	let type;
	const phase = useMatchStore()?.getPhase()?.timeout;
	const showChart = ['CT', 'T'].includes(phase);
	const isEvenTimeout = (useMatchStore()?.getScore()?.timeouts?.t + useMatchStore()?.getScore()?.timeouts?.ct) % 2;
	const round = parseInt(useMatchStore()?.getScore()?.round);
	const time = roundTime.value;

	if (showChart && isEvenTimeout) {
		if (usePlayersStore()?.extendedStatistics()) {
			if (time > 15) {
				type = 'duels';
			} else {
				type = 'extended';
			}
		} else {
			type = 'default';
		}
	} else if (phase == 'paused' || phase == 'technical' || showChart) {
		type = 'scoreboard';
	}

	return {
		show: round > 5 && type,
		type,
	};
});

const hideScoreboardTimeout = ref();
const chartTeam = ref();

watch(roundTime, (val) => {
	if (!chartOpacity.value.show) {
		return;
	}
	if (usePlayersStore()?.extendedStatistics() && chartOpacity.value.type != 'scoreboard') {
		if (val > 15 && val < 17) {
			chartVisibleClass.value = false;
		} else if (val > 10) {
			chartVisibleClass.value = true;
		}
	}
	if (val < 2) {
		chartVisibleClass.value = false;
	}
});

onMounted(() => {
	const value = chartOpacity.value.show;

	clearTimeout(hideScoreboardTimeout.value);
	if (title.value == 'scoreboard') {
		hideScoreboardTimeout.value = setTimeout(() => {
			chartVisibleClass.value = false;
		}, 20000);
	}

	playersOrderedByDuels.value = usePlayersStore()
		.getPlayers()
		.sort((b, a) => {
			function getDuelsKills(playerId) {
				let userStats = usePlayersStore().getPlayerDataById(playerId);
				return userStats?.statistics?.duels?.won;
			}
			return getDuelsKills(a.id) - getDuelsKills(b.id);
		})
		.sort((b, a) => {
			function getDuelsDiff(playerId) {
				let userStats = usePlayersStore().getPlayerDataById(playerId);
				return userStats?.statistics?.duels?.won - userStats?.statistics?.duels?.lost;
			}
			return getDuelsDiff(a.id) - getDuelsDiff(b.id);
		});

	playersOrderedByKills.value = usePlayersStore()
		.getPlayers()
		.sort((b, a) => {
			return a.match_stats?.kills - b.match_stats?.kills;
		});

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
	opacity: 0;
	transition-duration: 0.5s;
	border-radius: 5px;
	position: absolute;
	left: calc(50% - 480px);
	top: 240px;
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
.scoreboard {
	display: grid;
	grid-template-columns: repeat(2, calc((100% - 30px) / 2));
	grid-gap: 30px;
	margin-top: 15px;
}
</style>
