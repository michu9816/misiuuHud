<script setup>
import { defineProps, computed } from "vue";
import { useMatchStore } from "@/stores/match";

const matchStore = useMatchStore();

const props = defineProps(["team"]);

const score = computed(() => {
	let matchData = matchStore.getData();
	return matchData ? matchData[`team_${props.team}`].score : "-";
});

const scoreChanged = computed(() => {
	return (
		matchStore.getData()?.roundInfo.data.win_team ==
		props.team.toUpperCase()
	);
});
</script>

<template>
	<div class="score" :class="[{ highlight: scoreChanged }, team]">
		{{ score }}
	</div>
</template>

<style scoped>
.score {
	padding: 5px;
	font-size: 32px;
	font-weight: bold;
	transition-duration: 0.5s;
}
.score.highlight {
	color: white;
}
.score.highlight.ct {
	background: var(--color-text-ct);
}
.score.highlight.t {
	background: var(--color-text-t);
}
.score.ct:not(.highlight) {
	color: var(--color-text-ct);
}
.score.t:not(.highlight) {
	color: var(--color-text-t);
}
</style>

