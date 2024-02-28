<script setup>
import { computed } from "vue";
import { useMatchStore } from "@/stores/match";
import { usePlayersStore } from "@/stores/players";

// import TeamBox from "@/components/Bottom/TeamBox.vue";
const matchStore = useMatchStore();
const playersStore = usePlayersStore();

const matchLive = computed(() => {
	return (
		matchStore.getPhase()?.match == "live" &&
		matchStore.getPhase()?.round != "freezetime"
	);
});

const playersAlive = function (team) {
	return playersStore.getPlayers(team).filter((player) => player.state.health)
		.length;
};
</script>

<template>
	<div class="players" :class="{
		hidden: !matchLive,
	}">
		<a class="text ct">{{ playersAlive("ct") }}</a> v
		<a class="text t">{{ playersAlive("t") }}</a>
	</div>
</template>

<style scoped>
.players {
	position: absolute;
	top: 65px;
	width: 100px;
	padding: 5px 0;
	background: var(--color-background-dark-transparent);
	left: calc(50% - 50px);
	border-radius: 0 0 5px 5px;
	font-size: 25px;
	color: white;
	transition-duration: 0.5s;
	z-index: -1;
}

.players.hidden {
	opacity: 0;
	top: 0;
}

.text {
	font-weight: bold;
}

.text.ct {
	color: var(--color-text-ct-bright);
}

.text.t {
	color: var(--color-text-t-bright);
}
</style>

