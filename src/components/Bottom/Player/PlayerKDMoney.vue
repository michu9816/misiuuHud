<script setup>
import { usePlayersStore } from "@/stores/players";
import { computed, defineProps } from "vue";

const playersStore = usePlayersStore();

const props = defineProps(["playerId"]);

const playerData = computed(() => {
	return playersStore.getPlayerDataById(props.playerId);
});

const kills = computed(() => {
	return playerData.value?.match_stats.kills;
});
const roundKills = computed(() => {
	return playerData.value?.state.round_kills;
});
const deaths = computed(() => {
	return playerData.value?.match_stats.deaths;
});
const money = computed(() => {
	return playerData.value?.state.money;
});
</script>

<template>
	<!-- Access the state directly from the store -->
	<div class="darkBackground statistics">
		<div class="statistic">
			<div class="title">K</div>
			<div>
				{{ kills
				}}<span class="roundKills" v-if="roundKills">{{
					roundKills
				}}</span>
			</div>
		</div>
		<div class="statistic">
			<div class="title">D</div>
			<div>{{ deaths }}</div>
		</div>
		<div class="statistic">
			<div class="title">Money</div>
			<div>${{ money }}</div>
		</div>
	</div>
</template>

<style scoped>
.statistics {
	display: grid;
	grid-template-columns: 32% 26% 42%;
	padding: 5px 0;
}
.title {
	font-size: 10px;
	color: var(--color-text-gray);
	margin-bottom: 2px;
}
.roundKills {
	background: var(--gradient-health-ct-vertical);
	padding: 2px 5px;
	border-radius: 5px;
	margin-left: 3px;
}
</style>

