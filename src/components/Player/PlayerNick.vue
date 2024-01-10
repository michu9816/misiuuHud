<script setup>
import { usePlayersStore } from "@/stores/players";

const playersStore = usePlayersStore();
</script>

<template>
	<div class="nick">{{ playersStore.getWatchingPlayerData()?.name }}</div>
</template>

<style scoped>
.nick {
	text-align: left;
	padding: 5px 25px;
	background: var(--gradient-health-ct);
	color: white;
	border-radius: 5px 5px 0 0;
	width: fit-content;
	font-weight: bold;
	font-size: 25px;
}
</style>
