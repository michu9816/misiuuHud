<script setup>
import { defineProps, computed } from "vue";
import { useMatchStore } from "@/stores/match";

const matchStore = useMatchStore();

const props = defineProps(["team"]);

const score = computed(() => {
	let matchData = matchStore.getData();
	return matchData ? matchData[`team_${props.team}`].score : "-";
});

</script>

<template>
	<div class="score" :class="[team]">
		<div class="text">{{ score }}</div>
	</div>
</template>

<style scoped>
.score {
	padding: 5px;
	font-size: 32px;
	font-weight: bold;
	transition-duration: 0.5s;
	background: black;
}

.score.ct {
	color: white;
	border-bottom: 5px solid var(--color-text-ct);
	border-left: 5px solid var(--color-text-ct);
	border-right: 5px solid transparent;
	transform: skewX(10deg);
	margin-right: 5px;
}

.score.ct .text {
	transform: skewX(-10deg);
}

.score.t {
	color: white;
	border-bottom: 5px solid var(--color-text-t);
	border-right: 5px solid var(--color-text-t);
	border-left: 5px solid transparent;
	transform: skewX(-10deg);
	margin-left: 5px;
}

.score.t .text {
	transform: skewX(10deg);
}
</style>

