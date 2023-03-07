<script setup>
import { defineProps, computed } from "vue";
import { useMatchStore } from "@/stores/match";

const matchStore = useMatchStore();

const props = defineProps(["team"]);

const name = computed(() => {
	let matchData = matchStore.getData();
	return matchData ? matchData[`team_${props.team}`].name : "-";
});
</script>
<template>
	<div class="name">{{ name }}</div>
</template>

<style scoped>
.name {
	display: flex;
	align-self: center;
	justify-content: center;
}
</style>

