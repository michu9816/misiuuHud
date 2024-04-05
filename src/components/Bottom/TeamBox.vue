<script setup>
import PlayerView from '@/components/Bottom/PlayerView.vue';
import { defineProps } from 'vue';
import { usePlayersStore } from '@/stores/players';
import { computed } from 'vue';

const playersStore = usePlayersStore();

const props = defineProps(['team']);

const players = computed(() => {
	return playersStore.getPlayers(props.team);
});
</script>

<template>
	<div class="team" :class="props.team">
		<PlayerView v-for="player of players" :key="player.id" :playerId="player.id" />
	</div>
</template>

<style scoped>
.team {
	position: absolute;
	bottom: 0;
	display: grid;
	grid-gap: 10px;
	grid-template-columns: repeat(5, 140px);
	align-items: end;
}

.team.CT {
	left: 10px;
}

.team.T {
	right: 10px;
}
</style>
