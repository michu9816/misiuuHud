<script setup>
import { ref, watch } from "vue";
import { usePlayersStore } from "@/stores/players";
import { computed, defineProps } from "vue";
import { useMatchStore } from "@/stores/match";

const playersStore = usePlayersStore();
const matchStore = useMatchStore();

const props = defineProps(["playerId"]);

const playerData = computed(() => {
	return playersStore.getPlayerDataById(props.playerId);
});

const decreaseOldHealth = ref();

const currentHealth = computed(() => {
	return playerData.value.state.health;
});
const oldHealth = ref(100);

watch(currentHealth, (val) => {
	clearTimeout(decreaseOldHealth.value);

	if (val < 0) {
		currentHealth.value = 0;
	}
	decreaseOldHealth.value = setTimeout(() => {
		oldHealth.value = currentHealth.value;
	}, 750);
});

const matchLive = computed(() => {
	return (
		matchStore.getData().phase == "live" &&
		matchStore.getData().round.phase != "freezetime"
	);
});
</script>

<template>
	<!-- Access the state directly from the store -->
	<div
		class="bars"
		:class="{
			hide: currentHealth == 0 || !matchLive,
		}"
	>
		<div class="health bar">+ {{ currentHealth }}</div>
		<div
			class="healthBackground bar"
			:class="[playerData.team]"
			:style="{
				width: `${currentHealth}%`,
			}"
		></div>
		<div
			class="oldHealthBackground bar"
			:style="{
				width: `${oldHealth}%`,
			}"
		></div>
		<div class="darkBackground bar"></div>
	</div>
</template>

<style scoped>
.bar {
	height: 100%;
	text-align: left;
	align-items: center;
	display: flex;
	position: absolute;
	width: 100%;
	overflow: hidden;
}
.darkBackground {
	background: var(--vt-c-dark-transparent-9);
}
.health {
	color: var(--color-text-white);
	z-index: 3;
	padding: 0 10px;
	font-weight: bold;
	font-size: 20px;
	width: calc(100% - 20px);
}
.healthBackground.CT {
	background: var(--gradient-health-ct);
	z-index: 2;
}
.healthBackground.T {
	background: var(--gradient-health-t);
	z-index: 2;
}
.oldHealthBackground {
	background: var(--color-background-dark-red);
	z-index: 1;
	transition-duration: 0.5s;
}
.bars {
	position: relative;
	transition-duration: 0.5s;
	height: 30px;
}
.hide {
	height: 0;
}
</style>

