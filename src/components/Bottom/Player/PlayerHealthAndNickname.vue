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
	return playersStore.getPlayerBottomDataById(props.playerId);
});

const decreaseOldHealth = ref();

const currentHealth = computed(() => {
	return playerData.value?.health;
});
const oldHealth = ref(parseInt(playerData.value.health));

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
		(matchStore.getPhase()?.match == "live" &&
			matchStore.getPhase()?.round != "freezetime") ||
		!guiStore.getData().playersStatistics.show
	);
});

const kevlarImage = computed(() => {
	if (playerData.value.helmet) {
		return require("@/assets/img/elements/icon_armor_helmet_default.png");
	} else if (playerData.value.armor) {
		return require("@/assets/img/elements/icon_armor_none_default.png");
	}
	return null;
});

const flashedPercent = computed(() => {
	return (playerData?.value.flashed || 0) / 255;
})
//const observerSlot = computed(() => {
// let slot = playerData.value?.observer_slot + 1;
// return slot == 10 ? 0 : slot;
// })

const getWeaponIcon = function (type) {
	if (type == "c4") {
		return require(`@/assets/img/weapons/c4.png`)
	} else {
		return require(`@/assets/img/elements/icon_defuse_default.png`);
	}
};
</script>

<template>
	<!-- Access the state directly from the store -->
	<div class="status">
		<div class="flashBackground" :style="{ opacity: flashedPercent }"></div>
		<div class="healthBackground bar" :class="[{ low: currentHealth < 30 }, playerData.team]" :style="{
			height: `${currentHealth}%`,
		}"></div>
		<div class="oldHealthBackground bar" :style="{
			height: `${oldHealth}%`,
		}"></div>
		<div class="nickname" :class="playerData.team">
			<div class="text">{{ playerData?.name }}</div>
		</div>
		<div class="health" :class="{
			hide: currentHealth == 0 || !matchLive,
		}">
			<div style="width: 20px;">
				<img :src="kevlarImage" v-if="kevlarImage" class="ico_kevlar" />
			</div>
			{{ currentHealth }}
			<div style="width: 20px;">
				<img class="bomb" v-if="playerData?.bomb" :src="getWeaponIcon('c4')" />
				<img class="def" v-if="playerData?.defusekit" :src="getWeaponIcon('defuse')" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.nickname {
	font-size: 18px;
	color: white;
	z-index: 3;
	position: relative;
}

.bar {
	width: 100%;
	position: absolute;
	margin-top: -5px;
	bottom: 0;
}

.health {
	color: var(--color-text-white);
	z-index: 3;
	padding: 0 10px;
	font-weight: bold;
	font-size: 20px;
	width: calc(100% - 20px);
	transition-duration: 0.5s;
	height: 30px;
	position: relative;
	overflow: hidden;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
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

.hide {
	height: 0;
}

img {
	height: 18px;
	opacity: 0.8;
	float: right;
	filter: drop-shadow(0 0 5px black)
}

img.bomb {
	filter: invert(1)
}

.status {
	background: var(--color-background-gray);
	padding: 5px 0;
	position: relative;
	text-shadow: 0 0 5px black;
	border-radius: 5px;
	overflow: hidden;
}

.flashBackground {
	background: -webkit-radial-gradient(rgb(255 255 255 / 80%), rgb(255 255 255 / 50%));
	height: 100%;
	width: 100%;
	z-index: 3;
	position: absolute;
	margin-top: -5px;
	transition-duration: 0.5s;
}
</style>

