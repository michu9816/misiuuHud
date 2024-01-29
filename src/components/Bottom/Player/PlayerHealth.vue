<script setup>
import { ref, watch } from "vue";
import { usePlayersStore } from "@/stores/players";
import { computed, defineProps } from "vue";
import { useMatchStore } from "@/stores/match";
import { useGuiStore } from "@/stores/gui";

const playersStore = usePlayersStore();
const matchStore = useMatchStore();

const props = defineProps(["playerId"]);

const playerData = computed(() => {
	return playersStore.getPlayerDataById(props.playerId);
});

const decreaseOldHealth = ref();

const currentHealth = computed(() => {
	return playerData.value?.state?.health;
});
const oldHealth = ref(parseInt(playerData.value.state.health));

watch(currentHealth, (val) => {
	clearTimeout(decreaseOldHealth.value);

	if (val < 0) {
		currentHealth.value = 0;
	}
	decreaseOldHealth.value = setTimeout(() => {
		oldHealth.value = currentHealth.value;
	}, 750);
});

const guiStore = useGuiStore();

const matchLive = computed(() => {
	return (
		(matchStore.getData().phase == "live" &&
			matchStore.getData().roundInfo.data.phase != "freezetime") ||
		!guiStore.getData().playersStatistics.show
	);
});

const kevlarImage = computed(() => {
	if (playerData.value.state.helmet) {
		return require("@/assets/img/elements/icon_armor_helmet_default.png");
	} else if (playerData.value.state.armor) {
		return require("@/assets/img/elements/icon_armor_none_default.png");
	}
	return null;
});
</script>

<template>
	<!-- Access the state directly from the store -->
	<div class="bars" :class="{
		hide: currentHealth == 0 || !matchLive,
	}">
		<div class="health bar">
			<img src="@/assets/img/elements/icon_health_full_default.png" class="ico_health" />
			{{ currentHealth }}
			<img :src="kevlarImage" v-if="kevlarImage" class="ico_kevlar" />
		</div>
		<div class="healthBackground bar" :class="[{ low: currentHealth < 30 }, playerData.team]" :style="{
			width: `${currentHealth}%`,
		}"></div>
		<div class="oldHealthBackground bar" :style="{
			width: `${oldHealth}%`,
		}"></div>
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

.ico_health {
	margin-right: 5px;
}

.ico_kevlar {
	right: 5px;
	position: absolute;
}

.health {
	color: var(--color-text-white);
	z-index: 3;
	padding: 0 10px;
	font-weight: bold;
	font-size: 20px;
	width: calc(100% - 20px);
}

.health img {
	height: 20px;
}

.healthBackground.CT {
	background: var(--gradient-health-ct);
	z-index: 2;
}

.healthBackground.T {
	background: var(--gradient-health-t);
	z-index: 2;
}

.healthBackground.T.low,
.healthBackground.CT.low {
	background: var(--gradient-health-low);
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
	background: var(--color-background-gray);
}

.hide {
	height: 0;
}
</style>

