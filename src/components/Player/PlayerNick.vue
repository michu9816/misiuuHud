<script setup>
import { usePlayersStore } from "@/stores/players";

const playersStore = usePlayersStore();
</script>

<template>
	<div class="nick" :class="[playersStore.getWatchingPlayerData()?.team]">{{ playersStore.getWatchingPlayerData()?.name }}
	</div>
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

.nick.T {
	background: var(--gradient-health-t);
}

.nick.CT {
	background: var(--gradient-health-ct);
}
</style>
