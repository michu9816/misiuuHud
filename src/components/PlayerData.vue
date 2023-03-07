<script setup>
import Nickname from "@/components/Player/PlayerNick.vue";
import PlayerState from "@/components/Player/PlayerState.vue";
import PlayerStatistic from "@/components/Player/PlayerStatistics.vue";
import { useMatchStore } from "@/stores/match";
import { computed } from "vue";

const matchStore = useMatchStore();

const boxVisible = computed(() => {
	return (
		matchStore.getData()?.phase == "live" &&
		matchStore.getData()?.roundInfo?.data?.phase != "freezetime"
	);
});
</script>

<template>
	<div
		class="playerBox"
		:class="{
			hidden: !boxVisible,
		}"
	>
		<Nickname></Nickname>
		<PlayerState></PlayerState>
		<PlayerStatistic></PlayerStatistic>
	</div>
</template>

<style scoped>
.playerBox {
	width: 500px;
	position: absolute;
	left: calc(50% - 250px);
	bottom: 150px;
	transition-duration: 0.5s;
}
.playerBox.hidden {
	opacity: 0;
}
</style>

