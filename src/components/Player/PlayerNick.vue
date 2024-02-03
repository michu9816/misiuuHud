<script setup>
import { ref, watch, computed } from "vue";
import { usePlayersStore } from "@/stores/players";

const playersStore = usePlayersStore();

const playerData = computed(() => {
	return playersStore.getWatchingPlayerData();
});

const decreaseOldHealth = ref();

const currentPlayerId = computed(() => {
	return playerData.value?.steamid;
});

const currentHealth = computed(() => {
	return playerData.value?.state?.health;
});
const oldHealth = ref(parseInt(playerData.value?.state.health));

watch(currentHealth, (val) => {
	clearTimeout(decreaseOldHealth.value);

	if (val < 0) {
		currentHealth.value = 0;
	}
	decreaseOldHealth.value = setTimeout(() => {
		oldHealth.value = currentHealth.value;
	}, 750);
});

const requireBackgroundChange = ref(false);


watch(currentPlayerId, () => {
	clearTimeout(decreaseOldHealth.value);

	oldHealth.value = currentHealth.value;
	requireBackgroundChange.value = true;
	setTimeout(() => {
		requireBackgroundChange.value = false;
	}, 500)
});

const kevlarImage = computed(() => {
	if (playerData.value?.state.helmet) {
		return require("@/assets/img/elements/icon_armor_helmet_default.png");
	} else if (playerData.value?.state.armor) {
		return require("@/assets/img/elements/icon_armor_none_default.png");
	}
	return null;
});

</script>

<template>
	<div class="statusBar" :class="[playerData?.team]">
		<div class="health bar">
			{{ currentHealth }}
			<img :src="kevlarImage" v-if="kevlarImage" class="ico_kevlar" />
		</div>
		<div class="nickname">{{ playerData?.name }}</div>
		<div class="healthBackground bar" :class="[{ low: currentHealth < 30 }, playerData?.team]" :style="{
			width: `${currentHealth}%`,
		}"></div>
		<div class="oldHealthBackground bar" :class="{
			requireBackgroundChange: requireBackgroundChange
		}" :style="{
	width: `${oldHealth}%`,
}"></div>
	</div>
</template>

<style scoped>
.statusBar {
	text-align: left;
	color: white;
	border-radius: 5px 5px 0 0;
	font-weight: bold;
	font-size: 25px;
	background: var(--color-background-gray);
	height: 49px;
	position: relative;
	overflow: hidden;
}

.bar.health {
	color: var(--color-text-white);
	z-index: 3;
	font-weight: bold;
	font-size: 20px;
	width: calc(100% - 10px);
	justify-content: flex-end;
}

.nickname {
	padding: 10px 15px;
	position: absolute;
	z-index: 4;
}

.bar {
	height: 100%;
	text-align: left;
	align-items: center;
	display: flex;
	position: absolute;
	width: 100%;
	overflow: hidden;
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

.oldHealthBackground.requireBackgroundChange {
	transition-duration: 0s;
}

.ico_health {
	margin-right: 5px;
}

.ico_kevlar {
	margin-left: 5px;
}

.health img {
	height: 25px;
}
</style>
