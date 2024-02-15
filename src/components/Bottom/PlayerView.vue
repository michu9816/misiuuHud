<script setup>
import { defineProps, computed } from "vue";
import { usePlayersStore } from "@/stores/players";

import PlayerHealthAndNickname from "@/components/Bottom/Player/PlayerHealthAndNickname.vue";
import PlayerKDMoney from "@/components/Bottom/Player/PlayerKDMoney.vue";
import PlayerStatistic from "@/components/Bottom/Player/PlayerStatistic.vue";
import PlayerWeapons from "@/components/Bottom/Player/PlayerWeapons.vue";

const playersStore = usePlayersStore();

const props = defineProps(["playerId"]);

const playerData = computed(() => {
	return playersStore.getPlayerBottomDataById(props.playerId);
});

const isThisPlayerWatching = computed(() => {
	return playerData.value.id == playersStore.getWatchingPlayerBasicData()?.id;
});
</script>

<template>
	<!-- Access the state directly from the store -->
	<div>
		<div class="playerInformations darkBackground" :class="[{
			dead: !playerData.health,
			watching: isThisPlayerWatching,
		}, playerData.team]">
			<PlayerWeapons :playerId="props.playerId"></PlayerWeapons>
			<PlayerHealthAndNickname :playerId="props.playerId" />
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

.playerInformations {
	border: 2px solid transparent;
}

.playerInformations.dead {
	opacity: 0.8;
	filter: grayscale(1);
}

.playerInformations.watching {
	border-color: white;
}

.team.T .watching {
	background: var(--color-background-t-dark);
}

.team.CT .watching {
	background: var(--color-background-ct-dark);
}
</style>

