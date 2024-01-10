<script setup>
import { usePlayersStore } from "@/stores/players";
import { computed } from "vue";

const playersStore = usePlayersStore();

const playerData = computed(() => {
	return playersStore.getPlayerDataById(
		playersStore.getWatchingPlayerData()?.steamid
	);
});

const health = computed(() => {
	return playerData.value?.state.health;
});

const armor = computed(() => {
	return playerData.value?.state.armor;
});

const ammo = computed(() => {
	const clipAmmo = playerData.value?.activeWeapon?.ammo_clip;
	const reserveAmmo = playerData.value?.activeWeapon?.ammo_reserve;
	if (clipAmmo != undefined) {
		return `${clipAmmo}/${reserveAmmo}`;
	} else {
		return undefined;
	}
});

const kevlarImage = computed(() => {
	if (playerData.value?.state.helmet) {
		return require("@/assets/img/elements/icon_armor_helmet_default.png");
	} else {
		return require("@/assets/img/elements/icon_armor_none_default.png");
	}
});

const getWeponIcon = function (value) {
	const weaponName = value.name.split("weapon_")[1];
	return require(`@/assets/img/weapons/${weaponName}.png`);
};
</script>

<template>
	<div class="data">
		<div class="state">
			<img src="@/assets/img/elements/icon_health_full_default.png" class="ico_health" />
			{{ health }}
			<img :src="kevlarImage" class="ico_health" />
			{{ armor }}
			<img src="@/assets/img/elements/icon_bullets_default.png" class="ico_ammo" v-if="ammo" />
			{{ ammo }}
		</div>
		<div class="weapons">
			<img v-for="weapon of playerData?.availableWeapons.filter(
				(obj) => obj.type != 'Knife'
			)" :key="weapon.name" :class="{
	inactive: weapon.state != 'active',
}" :src="getWeponIcon(weapon)" />
		</div>
	</div>
	<div class="seperator" :class="[playerData?.team]"></div>
</template>

<style scoped>
.data {
	text-align: left;
	padding: 10px;
	background: rgba(0, 0, 0, 0.8);
	color: white;
	border-radius: 0 5px 0 0;
	font-weight: bold;
	font-size: 18px;
	display: grid;
	grid-template-columns: auto auto;
}

.data img {
	height: 15px;
}

.data .weapons {
	text-align: right;
}

.data .weapons img {
	filter: invert(1);
}

.data .weapons img.inactive {
	opacity: 0.6;
}

.seperator {
	height: 5px;
}

.seperator.T {
	background: var(--gradient-health-t);
}

.seperator.CT {
	background: var(--gradient-health-ct);
}

.weapons img {
	margin-left: 5px;
}
</style>
