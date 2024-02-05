<script setup>
import { usePlayersStore } from "@/stores/players";
import { computed, defineProps } from "vue";

const playersStore = usePlayersStore();

const props = defineProps(["playerId"]);

const playerData = computed(() => {
	return playersStore.getPlayerDataById(props.playerId);
});

const observerSlot = computed(() => {
	let slot = playerData.value?.observer_slot + 1;
	return slot == 10 ? 0 : slot;
})

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
	<div class="darkBackground nickname" :class="playerData.team">
		<div class="text">{{ observerSlot }} {{ playerData?.name }}</div>
		<img v-if="playerData?.availableWeapons?.find(obj => obj.name == 'weapon_c4')" :src="getWeaponIcon('c4')" />
		<img class="def" v-if="playerData?.state?.defusekit" :src="getWeaponIcon('defuse')" />

	</div>
</template>

<style scoped>
.text {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.nickname {
	padding: 8px 5px;
	text-align: left;
	display: flex;
	justify-content: space-between;
}

.nickname.T {
	background: var(--color-background-t);
}

.nickname.CT {
	background: var(--color-background-ct);
}

img {
	height: 18px;
	opacity: 0.8;
	float: right;
}

img:not(.def) {
	filter: invert(1);
}
</style>

