<script setup>
import { usePlayersStore } from '@/stores/players';
import { computed } from 'vue';

const playersStore = usePlayersStore();

const playerData = computed(() => {
	return playersStore.getPlayerDataById(playersStore.getWatchingPlayerBasicData()?.id);
});

const kills = computed(() => {
	return playerData.value?.statistics.kills;
});

const deaths = computed(() => {
	return playerData.value?.statistics.deaths;
});

const assists = computed(() => {
	return playerData.value?.statistics.assists;
});

const adr = computed(() => {
	return playerData.value?.statistics.adr;
});

const hsp = computed(() => {
	return playerData.value?.statistics.hs;
});
</script>

<template>
	<div class="data">
		<div class="statistic"><a class="name">K</a>{{ kills }}</div>
		<div class="statistic"><a class="name">D</a>{{ deaths }}</div>
		<div class="statistic"><a class="name">A</a>{{ assists }}</div>
		<div class="statistic"><a class="name">K/D</a>{{ playerData?.statistics.kd }}</div>
		<div class="statistic" v-if="hsp"><a class="name">HS%</a>{{ hsp }}</div>
		<div class="statistic" v-if="adr"><a class="name">ADR</a>{{ adr }}</div>
		<div class="roundKills">
			{{ playerData?.statistics.roundKills > 1 ? playerData?.statistics.roundKills + 'x' : '' }}
			<img src="@/assets/img/elements/icon_skull_default.png" v-if="playerData?.statistics.roundKills > 0" />
		</div>
	</div>
</template>

<style scoped>
.data {
	text-align: left;
	padding: 0 10px 10px 10px;
	background: var(--color-background-dark-transparent);
	color: white;
	border-radius: 0 0 5px 5px;
	font-weight: bold;
	display: flex;
	font-size: 12px;
}

.statistic {
	margin-right: 10px;
}

.statistic .name {
	font-size: 8px;
	margin-right: 2px;
	color: #cecece;
}

.roundKills {
	position: absolute;
	right: 10px;
}

.roundKills img {
	height: 12px;
}
</style>
