<script setup>
import Nickname from "@/components/Player/PlayerNick.vue";
import PlayerEquipment from "@/components/Player/PlayerEquipment.vue";
import PlayerStatistic from "@/components/Player/PlayerStatistics.vue";
import { useMatchStore } from "@/stores/match";
import { usePlayersStore } from "@/stores/players";

import { computed } from "vue";

const matchStore = useMatchStore();
const playersStore = usePlayersStore();

const boxVisible = computed(() => {
	return (
		matchStore.getData()?.phase == "live" &&
		matchStore.getData()?.roundInfo?.data?.phase != "freezetime" &&
		playersStore.getWatchingPlayerData()?.name
	);
});
</script>

<template>
	<div class="playerBox" :class="{
		hidden: !boxVisible,
	}">
		<Nickname></Nickname>
		<PlayerEquipment></PlayerEquipment>
		<PlayerStatistic></PlayerStatistic>
	</div>
</template>

<style scoped>
.playerBox {
	width: 300px;
	position: absolute;
	left: calc(50% - 150px);
	bottom: 70px;
	/* bottom: 200px; */
	transition-duration: 0.5s;
}

.playerBox.hidden {
	opacity: 0;
}
</style>

