<script setup>
import { useGuiStore } from '@/stores/gui';
import { useMatchStore } from '@/stores/match';
import { usePlayersStore } from '@/stores/players';
import { computed, defineProps } from 'vue';

const playersStore = usePlayersStore();
const matchStore = useMatchStore();
const guiStore = useGuiStore();

const props = defineProps(['playerId']);

const playerData = computed(() => {
	return playersStore.getPlayerDataById(props.playerId);
});

const matchLive = computed(() => {
	return matchStore.getPhase()?.match == 'live' && matchStore.getPhase()?.round != 'freezetime';
});

const statisticToShow = computed(() => {
	return guiStore.getData().playersStatistics.type;
});

const statisticValue = computed(() => {
	return playerData.value.statistics[statisticToShow.value];
});

const statisticValueWithPrefix = computed(() => {
	switch (statisticToShow.value) {
		case 'equipment':
			return `$${statisticValue.value}`;
		case 'hs':
			return `${statisticValue.value}%`;
		default:
			return `${statisticValue.value}`;
	}
});

const statisticHeight = computed(() => {
	let height = 0;

	if (!matchLive.value && guiStore.getData().playersStatistics.show) {
		height = getHeightInPercent() * 0.7 + 50;
	}

	function getHeightInPercent() {
		const getHighestPlayerStatistic = Math.max.apply(
			null,
			playersStore.getPlayers()?.map((obj) => playersStore.getPlayerDataById(obj.id)?.statistics[statisticToShow.value])
		);

		switch (statisticToShow.value) {
			case 'kd':
				return getPercent(2.0);
			case 'kills':
				return getPercent(30);
			case 'assists':
				return getPercent(8);
			case 'equipment':
				return getPercent(5000);
			case 'adr':
				return getPercent(150);
			case 'hs':
				return getPercent(100);
			default:
				return getPercent(1);
		}
		function getPercent(defaultValue) {
			return (statisticValue.value / Math.max(getHighestPlayerStatistic, defaultValue)) * 100;
		}
	}

	return height;
});
</script>

<template>
	<!-- Access the state directly from the store -->
	<!-- {{ playerData.statistics }} -->
	<div class="statisticsBackground" :class="{ visible: statisticHeight > 0 }">
		<div
			class="darkBackground"
			:class="[playerData.team]"
			:style="{
				height: statisticHeight + 'px',
			}">
			<div class="title">{{ statisticToShow }}</div>
			<div class="value">
				{{ statisticValueWithPrefix }}
			</div>
		</div>
	</div>
</template>

<style scoped>
.title {
	font-size: 12px;
	color: white;
	margin-bottom: 2px;
	padding: 5px 0 2px;
	text-transform: uppercase;
	text-shadow: 0 0 5px black;
}

.statisticsBackground {
	height: 0px;
	background: var(--color-background-dark-transparent);
	border-radius: 5px 5px 0 0;
	overflow: hidden;
	display: flex;
	align-items: flex-end;
	transition-duration: 0.5s;
}

.statisticsBackground.visible {
	height: 120px;
}

.darkBackground {
	transition-duration: 0.5s;
	height: 0px;
	overflow: hidden;
	opacity: 0.8;
	width: 100%;
	max-height: 120px;
}

.darkBackground.CT {
	background: var(--gradient-health-ct-vertical);
}

.darkBackground.T {
	background: var(--gradient-health-t-vertical);
}

.value {
	font-weight: bold;
	text-shadow: 0 0 5px black;
}
</style>
