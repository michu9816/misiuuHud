<script setup>
import { computed } from "vue";
import { useMatchStore } from "@/stores/match";
import { usePlayersStore } from "@/stores/players";

// import TeamBox from "@/components/Bottom/TeamBox.vue";
const matchStore = useMatchStore();
const playersStore = usePlayersStore();

const matchLive = computed(() => {
	return (
		matchStore.getData()?.phase == "live" &&
		matchStore.getData()?.roundInfo.data.phase != "freezetime"
	);
});

const playersAlive = function (team) {
	return playersStore.getPlayers(team).filter((player) => player.state.health)
		.length;
};
</script>

<template>
	<div
		class="players"
		:class="{
			hidden: !matchLive,
		}"
	>
		<a class="text ct">{{ playersAlive("ct") }}</a> v
		<a class="text t">{{ playersAlive("t") }}</a>
	</div>
</template>

<style scoped>
.players {
	position: absolute;
	bottom: 30px;
	width: 80px;
	padding: 10px 0;
	background: var(--color-background-dark-transparent);
	left: calc(50% - 40px);
	border-radius: 5px;
	font-size: 20px;
	color: white;
	transition-duration: 0.5s;
}
.players.hidden {
	opacity: 0;
	bottom: 0;
}
.text {
	font-weight: bold;
}
</style>

