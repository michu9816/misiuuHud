<script setup>
import { usePlayersStore } from '@/stores/players';
import { computed } from 'vue';

const playersStore = usePlayersStore();

const playerData = computed(() => {
	return playersStore.getWatchingPlayerBasicData();
});

const ammo = computed(() => {
	const clipAmmo = playerData.value?.weapon?.ammoClip;
	const reserveAmmo = playerData.value?.weapon?.ammoReserve;
	if (clipAmmo != undefined) {
		return `${clipAmmo}/${reserveAmmo}`;
	} else {
		return undefined;
	}
});

const getMainWeapon = computed(() => {
	let betterWeapons = playerData.value?.weapons.filter((obj) => !['Knife', 'Grenade', 'Pistol', 'C4'].includes(obj.type));
	if (betterWeapons?.length) {
		return betterWeapons[0];
	} else {
		return playerData.value?.weapons.filter((obj) => ['Pistol'].includes(obj.type))[0];
	}
});

const getWeaponIcon = function (value) {
	const weaponName = value?.name.split('weapon_')[1];
	return require(`@/assets/img/weapons/${weaponName}.png`);
};

const getEquipmentIcon = function (type) {
	if (type == 'c4') {
		return require(`@/assets/img/weapons/c4.png`);
	} else {
		return require(`@/assets/img/elements/icon_defuse_default.png`);
	}
};
</script>

<template>
	<div class="data">
		<div class="weapons">
			<img
				:class="{
					inactive: getMainWeapon?.state != 'active',
				}"
				v-if="getMainWeapon"
				:src="getWeaponIcon(getMainWeapon)" />

			<img
				v-for="weapon of playerData?.weapons.filter((obj) => ['Grenade'].includes(obj.type))"
				:key="weapon.name"
				:class="{
					inactive: weapon.state != 'active',
				}"
				:src="getWeaponIcon(weapon)" />
		</div>
		<div class="state">
			<img v-if="playerData?.bomb" :src="getEquipmentIcon('c4')" class="bomb" />
			<img class="def" v-if="playerData?.defusekit" :src="getEquipmentIcon('defuse')" />
			<img src="@/assets/img/elements/icon_bullets_default.png" class="ico_ammo" style="margin-left: 10px" v-if="ammo" />
			{{ ammo }}
		</div>
	</div>
</template>

<style scoped>
.data {
	text-align: right;
	padding: 10px;
	background: var(--color-background-dark-transparent);
	color: white;
	font-weight: bold;
	font-size: 20px;
	display: grid;
	grid-template-columns: auto auto;
}

.state {
	font-weight: normal;
}

.data img {
	height: 15px;
	opacity: 1;
}

.data .weapons {
	text-align: left;
}

.data .weapons img {
	filter: invert(1);
}

.data .weapons img:not(.inactive) {
	filter: invert(1) drop-shadow(0px 0px 5px rgba(255, 255, 255, 0.2));
}

img.bomb {
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
