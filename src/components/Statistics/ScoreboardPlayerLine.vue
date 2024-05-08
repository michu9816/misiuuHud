<template>
	<div class="player" :class="[data.team, { visible }]">
		<div class="nick">{{ data.name }}</div>
		<div class="statistics">
			<div class="statistic" v-for="i in 4" :key="i" :class="{ highlight: i == 1 && highlight }">
				<div class="value">{{ statistics[i - 1] }}</div>
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
		case 'scoreboard':
			return [
				props.data?.match_stats?.kills,
				props.data?.match_stats?.deaths,
				props.data?.match_stats?.assists,
				(props.data?.match_stats?.kills / (props.data?.match_stats?.deaths || 0)).toFixed(1),
			];
		case 'extended':
			return [props.data?.match_stats?.deaths, extendedStatistics.value?.adr, props.data?.match_stats?.kills];
		default:
			return undefined;
	}
});

const visible = ref(false);
const highlight = ref(false);

onMounted(() => {
	setTimeout(() => {
		visible.value = true;
	}, props.index * 200 + 1000);
	setTimeout(() => {
		highlight.value = true;
	}, props.index * 100 + 5000);
});
</script>
<style scoped>
.player {
	display: grid;
	grid-template-columns: 150px auto;
	color: white;
	margin-top: 10px;
	text-shadow: 0 0 5px #000;
	padding: 10px;
	border-radius: 5px;
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
.player.T {
	background: var(--gradient-health-t);
}
.player.CT {
	background: var(--gradient-health-ct);
}
.statistics {
	display: flex;
	gap: 10px;
	font-size: 24px;
	justify-content: flex-end;
}
.statistic .value {
	width: 45px;
	text-align: center;
}
.statistic {
	background: transparent;
	transition-duration: 0.5s;
}
.statistic.highlight {
	border-radius: 5px;
}
.T .statistic.highlight {
	background: var(--color-background-t);
}
.CT .statistic.highlight {
	background: var(--color-background-ct);
}
</style>
