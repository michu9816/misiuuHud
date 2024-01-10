<script setup>
import { useMatchStore } from "@/stores/match";
import { usePlayersStore } from "@/stores/players";
import { computed, defineProps, ref, watch } from "vue";

const playersStore = usePlayersStore();
const matchStore = useMatchStore();

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

const savedMoney = ref(0);

watch(money, (value) => {
	if (savedMoney.value < value || matchStore.getData().round == "1") {
		savedMoney.value = value;
	}
});

const matchLive = computed(() => {
	return (
		matchStore.getData().phase == "live" &&
		matchStore.getData().roundInfo.data.phase != "freezetime"
	);
});
</script>

<template>
	<!-- Access the state directly from the store -->
	<div class="darkBackground statistics" :class="{
		buyTime: !matchLive,
	}">
		<div class="statistic">
			<div class="title">K</div>
			<div>
				{{ kills
				}}<span class="roundKills" :class="[playerData.team]" v-if="roundKills">{{ roundKills }}</span>
			</div>
		</div>
		<div class="statistic">
			<div class="title">D</div>
			<div>{{ deaths }}</div>
		</div>
		<div class="statistic">
			<div class="title money">
				{{ matchLive ? "Money" : `-$${Math.abs(money - savedMoney)}` }}
			</div>
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
	transition-duration: 0.5s;
}

.statistics.buyTime .title {
	font-size: 14px;
}

.statistics.buyTime .title.money {
	color: red;
}

.roundKills {
	padding: 2px 5px;
	border-radius: 5px;
	margin-left: 3px;
}

.roundKills.CT {
	background: var(--gradient-health-ct-vertical);
}

.roundKills.T {
	background: var(--gradient-health-t-vertical);
}
</style>

