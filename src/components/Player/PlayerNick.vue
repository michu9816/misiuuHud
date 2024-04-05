<script setup>
import { ref, watch, computed } from 'vue';
import { usePlayersStore } from '@/stores/players';

const playersStore = usePlayersStore();

const playerData = computed(() => {
	return playersStore.getWatchingPlayerBasicData();
});

const decreaseOldHealth = ref();

const currentPlayerId = computed(() => {
	return playerData.value?.id;
});

const currentHealth = computed(() => {
	return playerData.value?.health;
});
const oldHealth = ref(parseInt(playerData.value?.health));

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
	}, 500);
});

const kevlarImage = computed(() => {
	if (playerData.value?.helmet) {
		return require('@/assets/img/elements/icon_armor_helmet_default.png');
	} else if (playerData.value?.armor) {
		return require('@/assets/img/elements/icon_armor_none_default.png');
	}
	return null;
});
</script>

<template>
	<div class="health bar" :class="[playerData?.team]">
		<div class="currentHealth">
			{{ currentHealth }}
		</div>
		<img :src="kevlarImage" v-if="kevlarImage" class="ico_kevlar" />
	</div>
	<div class="statusBar" :class="[playerData?.team]">
		<div class="nickname">{{ playerData?.name }}</div>
		<div
			class="healthBackground bar"
			:class="[playerData?.team]"
			:style="{
				width: `${currentHealth}%`,
			}"></div>
		<div
			class="oldHealthBackground bar"
			:class="{
				requireBackgroundChange: requireBackgroundChange,
			}"
			:style="{
				width: `${oldHealth}%`,
			}"></div>
	</div>
</template>

<style scoped>
.statusBar {
	text-align: left;
	color: white;
	font-weight: bold;
	font-size: 25px;
	background: var(--color-background-gray);
	height: 49px;
	position: relative;
	border-bottom: 5px solid white;
	width: calc(100% - 75px);
}

.bar.health {
	z-index: 3;
	font-weight: bold;
	font-size: 20px;
	width: auto;
	justify-content: space-evenly;
	right: -5px;
	padding: 0 10px;
	background: white;
	transform: skewX(-10deg);
	width: 65px;
	display: flex;
	height: 54px;
}

.bar.health.T {
	color: var(--color-background-t);
}

.bar.health.CT {
	color: var(--color-background-ct);
}

.currentHealth {
	transform: skewX(10deg);
}

.nickname {
	padding: 10px 15px;
	position: absolute;
	z-index: 4;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: calc(100% - 30px);
	text-shadow: 0 0 5px black;
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
	background: var(--color-background-ct);
	z-index: 2;
}

.healthBackground.T {
	background: var(--color-background-t);
	z-index: 2;
}

.oldHealthBackground {
	background: var(--color-background-dark-red);
	z-index: 1;
	transition-duration: 0.5s;
}

.oldHealthBackground.requireBackgroundChange {
	transition-duration: 0s;
}

.ico_kevlar {
	margin-left: 5px;
}

.health img {
	height: 25px;
	filter: invert(1);
	transform: skewX(10deg);
	opacity: 0.8;
}
</style>
