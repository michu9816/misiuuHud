<template>
	<div class="player" :class="[data.team, { visible, twoColumns: statistics?.length == 2 }]">
		<div class="nick">{{ data.name }}</div>
		<div class="statistics">
			<div class="statistic left">
				<div class="background" :style="{ width: visible ? `${statisticsWidth[0]}%` : '0%' }"></div>
				<div class="value">{{ statistics[0] }}</div>
			</div>
			<div class="statistic middle" v-if="true && statistics[2]">{{ statistics[1] }}</div>
			<div class="statistic right">
				<div class="background" :style="{ width: visible ? `${statisticsWidth[1]}%` : '0%' }"></div>
				<div class="value">{{ statistics[2] || statistics[1] }}</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { usePlayersStore } from '@/stores/players';
import { defineProps, computed, onMounted, ref } from 'vue';
const props = defineProps(['data', 'maxLeft', 'maxRight', 'type', 'index']);

const extendedStatistics = computed(() => {
	return usePlayersStore().getPlayerDataById(props.data.id)?.statistics;
});

const statistics = computed(() => {
	switch (props.type) {
		case 'duels':
			return [extendedStatistics.value?.duels.lost, extendedStatistics.value?.duels.won];
		case 'default':
			return [
				props.data?.match_stats?.deaths,
				(props.data?.match_stats?.kills / (props.data?.match_stats?.deaths || 1)).toFixed(1),
				props.data?.match_stats?.kills,
			];
		case 'extended':
			return [props.data?.match_stats?.deaths, Math.round(extendedStatistics.value?.adr), props.data?.match_stats?.kills];
		default:
			return [undefined];
	}
});

const statisticsWidth = computed(() => {
	const values = [statistics.value[0], statistics.value[2] || statistics.value[1]];
	return [Math.round((values[0] / props.maxLeft) * 100), Math.round((values[1] / props.maxRight) * 100)];
});

const visible = ref(false);
onMounted(() => {
	setTimeout(() => {
		visible.value = true;
	}, props.index * 200 + 1000);
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
	opacity: 0;
	transition-duration: 0.5s;
}
.player.visible {
	opacity: 1;
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
.player.twoColumns .statistics {
	grid-template-columns: 235px 235px;
}
.background {
	width: 0%;
	transition-duration: 1s;
	transition-delay: 0.5s;
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
