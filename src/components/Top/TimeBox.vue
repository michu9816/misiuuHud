<script setup>
import { useMatchStore } from "@/stores/match";
import { computed } from "vue";

const matchStore = useMatchStore();
const timeLeft = computed(() => {
	return convertTime(matchStore.getData()?.roundInfo.timer.phase_ends_in);
});

function convertTime(time) {
	let minutes = Math.floor(time / 60);
	let seconds = parseInt(time % 60);
	seconds = seconds.toLocaleString("pl-PL", { minimumIntegerDigits: 2 });

	return `${minutes}:${seconds}`;
}
</script>

<template>
	<div class="time">{{ timeLeft }}</div>
</template>

<style scoped>
.time {
	padding: 10px 0;
}
</style>

