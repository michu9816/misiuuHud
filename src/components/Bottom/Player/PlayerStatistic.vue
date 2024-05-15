<script setup>
import { useGuiStore } from '@/stores/gui';
import { usePlayersStore } from '@/stores/players';
import { computed, defineProps } from 'vue';

const playersStore = usePlayersStore();
const guiStore = useGuiStore();

const props = defineProps(['playerId', 'show']);

const playerData = computed(() => {
	return playersStore.getPlayerDataById(props.playerId);
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
	if (props.show) {
		height = parseInt(statisticValue.value) * getMultiplier() + 50;
	}

	function getMultiplier() {
		switch (statisticToShow.value) {
			case 'kd':
				return 30;
			case 'kills':
				return 2;
			case 'assists':
				return 8;
			case 'equipment':
				return 0.01;
			case 'adr':
				return 0.45;
			case 'hs':
				return 0.7;
			default:
				return 1;
		}
	}
	return height;
});
</script>

<template>
	<div class="statisticsBackground" :class="{ hide: !statisticHeight }">
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
	background: var(--color-background-dark-transparent);
	border-radius: 5px 5px 0 0;
	overflow: hidden;
	display: flex;
	align-items: flex-end;
	transition-duration: 0.5s;
	animation: growUp 0.5s;
	height: 120px;
}

.statisticsBackground.hide {
	height: 0px;
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
@keyframes growUp {
	0% {
		height: 0px;
	}
	100% {
		height: 120px;
	}
}
</style>
