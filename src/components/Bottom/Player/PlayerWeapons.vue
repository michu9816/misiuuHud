<script setup>
import { defineProps, computed } from "vue";
import { usePlayersStore } from "@/stores/players";

const playersStore = usePlayersStore();

const props = defineProps(["playerId"]);

const playerData = computed(() => {
	return playersStore.getPlayerBottomDataById(props.playerId);
});

const getMainWeapon = computed(() => {
	let betterWeapons = playerData.value?.weapons.filter(
		(obj) => !["Knife", "Grenade", "Pistol", "C4"].includes(obj.type)
	);
	if (betterWeapons.length) {
		return betterWeapons[0];
	} else {
		return playerData.value?.weapons.filter((obj) =>
			["Pistol"].includes(obj.type)
		)[0];
	}
});

const getWeaponIcon = function (value) {
	const weaponName = value?.name.split("weapon_")[1];
	return require(`@/assets/img/weapons/${weaponName}.png`);
};
</script>

<template>
	<!-- Access the state directly from the store -->
	<div class="weapons">
		<div class="left">
			<img :class="{
				inactive: getMainWeapon?.state != 'active',
			}" v-if="getMainWeapon" :src="getWeaponIcon(getMainWeapon)" />
		</div>
		<div class="right">
			<img v-for="weapon of playerData?.weapons.filter((obj) =>
				['Grenade'].includes(obj.type)
			)" :key="weapon.name" :class="{
	inactive: weapon.state != 'active',
}" :src="getWeaponIcon(weapon)" />
		</div>
		<!-- {{ playerData?.availableWeapons }} -->
	</div>
</template>

<style scoped>
img {
	filter: invert(1);
	max-height: 17px;
	max-width: 40px;
}

.weapons {
	padding: 10px 5px;
	display: flex;
	align-content: center;
	transition-duration: 0.5s;
	height: 17px;
	overflow: hidden;
}

.weapons .right {
	right: 5px;
	position: absolute;
}

.weapons img.inactive {
	opacity: 0.6;
}

.playerInformations.dead .weapons {
	height: 0px;
	padding: 0px 5px;
}
</style>

