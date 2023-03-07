<script setup>
import { defineProps, computed } from "vue";
import { usePlayersStore } from "@/stores/players";

const playersStore = usePlayersStore();

const props = defineProps(["playerId"]);

const playerData = computed(() => {
	return playersStore.getPlayerDataById(props.playerId);
});

const getMainWeapon = computed(() => {
	let betterWeapons = playerData.value?.availableWeapons.filter(
		(obj) => !["Knife", "Grenade", "Pistol"].includes(obj.type)
	);
	console.log(betterWeapons.value);
	if (betterWeapons.length) {
		return betterWeapons[0];
	} else {
		return playerData.value?.availableWeapons.filter((obj) =>
			["Pistol"].includes(obj.type)
		)[0];
	}
});

const getWeponIcon = function (value) {
	const weaponName = value.name.split("weapon_")[1];
	return require(`@/assets/img/weapons/${weaponName}.png`);
};
</script>

<template>
	<!-- Access the state directly from the store -->
	<div class="weapons">
		<div class="left">
			<img
				:class="{
					inactive: getMainWeapon.state != 'active',
				}"
				:src="getWeponIcon(getMainWeapon)"
			/>
		</div>
		<div class="right">
			<img
				v-for="weapon of playerData?.availableWeapons.filter((obj) =>
					['Grenade'].includes(obj.type)
				)"
				:key="weapon.name"
				:class="{
					inactive: weapon.state != 'active',
				}"
				:src="getWeponIcon(weapon)"
			/>
		</div>
		<!-- {{ playerData?.availableWeapons }} -->
	</div>
</template>

<style scoped>
img {
	filter: invert(1);
	height: 12px;
}
.weapons {
	padding: 5px 5px;
	display: flex;
}
.weapons .right {
	right: 5px;
	position: absolute;
}
.weapons img.inactive {
	opacity: 0.6;
}
</style>

