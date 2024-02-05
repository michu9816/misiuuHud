<script setup>
import { defineProps, computed } from "vue";
import { useMatchStore } from "@/stores/match";

const matchStore = useMatchStore();

const props = defineProps(["team"]);

const name = computed(() => {
	let matchData = matchStore.getData();
	return matchData ? matchData[`team_${props.team}`].name : "-";
});

const scoreChanged = computed(() => {
	return (
		matchStore.getData()?.roundInfo.data?.win_team ==
		props.team.toUpperCase()
	);
});
</script>
<template>
	<div class="background" :class="[{ highlight: scoreChanged }, props.team]">
		<div class="name">{{ name }}</div>
	</div>
</template>

<style scoped>
.background {
	display: flex;
	padding: 0 20px;
	background: white;
	margin: 0 -5px;
	align-items: center;
	justify-content: center;
	color: black;
	transition-duration: 0.5s;
}

.name {
	display: flex;
	text-align: center;
	justify-content: center;
	align-items: center;
	font-weight: bold;
	transition-duration: 0.5s;
}

.highlight .name {
	color: white;
}

.background.highlight.ct {
	background: var(--color-background-ct);
}

.background.highlight.t {
	background: var(--color-background-t);
}
</style>

