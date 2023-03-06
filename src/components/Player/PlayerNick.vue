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
	padding: 10px 20px;
	background: rgba(0, 0, 0, 0.8);
	color: white;
	border-radius: 5px 5px 0 0;
	width: fit-content;
}
</style>
