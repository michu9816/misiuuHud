<script setup>
import { defineProps, computed } from 'vue';
import { useMatchStore } from '@/stores/match';

const matchStore = useMatchStore();

const props = defineProps(['team']);

const name = computed(() => {
	const team = matchStore.getScore()?.teams[props.team];
	const defaultTeamName = props.team == 't' ? 'TT' : 'CT';
	return team || defaultTeamName;
});

const scoreChanged = computed(() => {
	return matchStore.getPhase()?.winner == props.team.toUpperCase();
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
