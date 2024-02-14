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
			case "kills":
				return 2;
			case "assists":
				return 8;
			case "equipment":
				return 0.01;
			case "adr":
				return 0.45;
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
	<div class="statisticsBackground" :class="{ visible: statisticHeight > 0 }">
		<div class="darkBackground" :class="[playerData.team]" :style="{
			height: statisticHeight + 'px',
		}">
			<div class="title">{{ statisticToShow }}</div>
			<div class="value">
				{{ statisticValue }}
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

