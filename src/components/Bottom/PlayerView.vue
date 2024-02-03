<script setup>
import { defineProps, computed } from "vue";
import { usePlayersStore } from "@/stores/players";

import PlayerNickname from "@/components/Bottom/Player/PlayerNickname.vue";
import PlayerHealth from "@/components/Bottom/Player/PlayerHealth.vue";
import PlayerKDMoney from "@/components/Bottom/Player/PlayerKDMoney.vue";
import PlayerStatistic from "@/components/Bottom/Player/PlayerStatistic.vue";
import PlayerWeapons from "@/components/Bottom/Player/PlayerWeapons.vue";

const playersStore = usePlayersStore();

const props = defineProps(["playerId"]);

const playerData = computed(() => {
	return playersStore.getPlayerDataById(props.playerId);
});

const isThisPlayerWatching = computed(() => {
	return playerData.value.id == playersStore.getWatchingPlayerData()?.steamid;
});
</script>

<template>
	<!-- Access the state directly from the store -->
	<div>
		<div class="playerInformations" :class="[{
			dead: !playerData.state.health,
			watching: isThisPlayerWatching,
		}, playerData.team]">
			<PlayerNickname :playerId="props.playerId" />
			<PlayerWeapons :playerId="props.playerId"></PlayerWeapons>
			<PlayerHealth :playerId="props.playerId" />
			<PlayerKDMoney :playerId="props.playerId" />
		</div>
		<PlayerStatistic :playerId="props.playerId" />
	</div>
</template>

<style scoped>
.playerInformations {
	position: relative;
	transition-duration: 0.5s;
	margin-bottom: 10px;
	border-radius: 5px;
	overflow: hidden;
}

.playerInformations.T {
	border: 2px solid var(--color-background-t);
}

.playerInformations.CT {
	border: 2px solid var(--color-background-ct);
}

.playerInformations.dead {
	opacity: 0.8;
	filter: grayscale(1);
}

.playerInformations.watching {
	border-color: white;
}

.team.T .watching {
	background: var(--color-text-t);
}

.team.CT .watching {
	background: var(--color-text-ct);
}
</style>

