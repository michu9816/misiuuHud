<script setup>
import { usePlayersStore } from "@/stores/players";
import { computed } from "vue";

const playersStore = usePlayersStore();

const playerData = computed(() => {
	return playersStore.getPlayerDataById(
		playersStore.getWatchingPlayerData()?.steamid
	);
});

const kills = computed(() => {
	return playerData.value?.match_stats.kills;
});

const deaths = computed(() => {
	return playerData.value?.match_stats.deaths;
});

const assists = computed(() => {
	return playerData.value?.match_stats.assists;
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
		<div class="statistic">
			<a class="name">K/D</a>{{ playerData?.statistics.kd }}
		</div>
		<div class="statistic" v-if="hsp"><a class="name">HS%</a>{{ hsp }}</div>
		<div class="statistic" v-if="adr"><a class="name">ADR</a>{{ adr }}</div>
		<div class="roundKills">
			<img src="@/assets/img/elements/icon_skull_default.png" v-for="kill of playerData?.state.round_kills"
				:key="kill" />
		</div>
	</div>
</template>

<style scoped>
.data {
	text-align: left;
	padding: 10px;
	background: rgba(0, 0, 0, 0.8);
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
	margin-left: 5px;
}
</style>
