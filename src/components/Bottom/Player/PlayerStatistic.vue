<script setup>
import { useGuiStore } from "@/stores/gui";
import { useMatchStore } from "@/stores/match";
import { usePlayersStore } from "@/stores/players";
import { computed, defineProps } from "vue";

const playersStore = usePlayersStore();
const matchStore = useMatchStore();
const guiStore = useGuiStore();

const props = defineProps(["playerId"]);

const playerData = computed(() => {
	return playersStore.getPlayerDataById(props.playerId);
});

const matchLive = computed(() => {
	return (
		matchStore.getData().phase == "live" &&
		matchStore.getData().roundInfo.data.phase != "freezetime"
	);
});

const statisticToShow = computed(() => {
	return guiStore.getData().playersStatistics.type;
});

const statisticValue = computed(() => {
	return playerData.value.statistics[statisticToShow.value];
});

const statisticHeight = computed(() => {
	let test = 0;

	if (!matchLive.value && guiStore.getData().playersStatistics.show) {
		test = parseInt(statisticValue.value) * getMultiplier() + 50;
	}

	function getMultiplier() {
		switch (statisticToShow.value) {
			case "kd":
				return 30;
			case "equipment":
				return 0.01;
			default:
				return 1;
		}
	}
	return test;
});
</script>

<template>
	<!-- Access the state directly from the store -->
	<!-- {{ playerData.statistics }} -->
	<div class="darkBackground" :class="[playerData.team]" :style="{
		height: statisticHeight + 'px',
	}">
		<div class="title">{{ statisticToShow }}</div>
		<div class="value">
			{{ statisticValue }}
		</div>
	</div>
</template>

<style scoped>
.title {
	font-size: 10px;
	color: var(--color-text-gray);
	margin-bottom: 2px;
	padding: 5px 0;
	text-transform: uppercase;
}

.darkBackground {
	transition-duration: 0.5s;
	height: 0px;
	overflow: hidden;
	opacity: 0.8;
}

.darkBackground.CT {
	background: var(--gradient-health-ct-vertical);
}

.darkBackground.T {
	background: var(--gradient-health-t-vertical);
}
</style>

