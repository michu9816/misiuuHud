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

const phase = computed(() => {
	return matchStore.getData()?.roundInfo?.data?.phase;
})

watch(phase, (value) => {
	if (value == "freezetime") {
		savedMoney.value = money.value;
	}
});

const matchLive = computed(() => {
	return (
		matchStore.getData()?.phase == "live" &&
		matchStore.getData()?.roundInfo.data.phase != "freezetime"
	);
});

const showStatisticChangeOverlay = ref(undefined);
watch(roundKills, (value, oldValue) => {
	if (value > oldValue) {
		if (!matchLive.value) {
			return;
		}
		switch (value) {
			case 3:
				showStatisticChangeOverlay.value = "3K";
				break;
			case 4:
				showStatisticChangeOverlay.value = "4K";
				break;
			case 5:
				showStatisticChangeOverlay.value = "ACE";
				break;
			default:
				showStatisticChangeOverlay.value = "Kill";
				break;

		}
		setTimeout(function () {
			showStatisticChangeOverlay.value = undefined;
		}, value == 5 ? 1450 : 450)
	}
})
</script>

<template>
	<!-- Access the state directly from the store -->
	<div class="statistics" :class="{
		buyTime: !matchLive,
	}">
		<div class="statisticChangeOverlay" v-if="showStatisticChangeOverlay" :class="[playerData.team]">
			<div class="text">
				{{ showStatisticChangeOverlay }}
			</div>
		</div>
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
.statisticChangeOverlay {
	position: absolute;
	transition-duration: 0.5s;
	background: white;
	width: 0%;
	height: 34px;
	font-weight: bold;
	font-size: 22px;
	display: flex;
	align-items: center;
	overflow: hidden;
	animation: stretchHorizontal 0.5s infinite;
}

.statisticChangeOverlay.T {
	color: var(--color-text-t);
}

.statisticChangeOverlay.CT {
	color: var(--color-text-ct);
}

.statisticChangeOverlay .text {
	width: 140px;
	position: absolute;
	display: flex;
	justify-content: center;
}

.statistics {
	display: grid;
	grid-template-columns: 32% 26% 42%;
	padding: 5px 0;
}

.title {
	font-size: 12px;
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
	background: var(--color-background-ct);
}

.roundKills.T {
	background: var(--color-background-t);
}

@keyframes stretchHorizontal {

	0%,
	99% {
		width: 0%;
	}

	30%,
	70% {
		width: 100%;
	}

	49% {
		left: 0%;
	}

	50%,
	100% {
		right: 0;
	}
}
</style>

