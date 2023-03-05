<script setup>
import { defineProps, computed } from "vue";
import { usePlayersStore } from "@/stores/players";

import PlayerNickname from "@/components/Bottom/Player/PlayerNickname.vue";
import PlayerHealth from "@/components/Bottom/Player/PlayerHealth.vue";
import PlayerKDMoney from "@/components/Bottom/Player/PlayerKDMoney.vue";
import PlayerStatistic from "@/components/Bottom/Player/PlayerStatistic.vue";

const playersStore = usePlayersStore();

const props = defineProps(["playerId"]);

const playerData = computed(() => {
	return playersStore.getPlayerDataById(props.playerId);
});
</script>

<template>
	<!-- Access the state directly from the store -->
	<div
		class="playerInformations"
		:class="{
			dead: !playerData.state.health,
		}"
	>
		<PlayerNickname :playerId="props.playerId" />
		<PlayerHealth :playerId="props.playerId" />
		<PlayerKDMoney :playerId="props.playerId" />
		<PlayerStatistic :playerId="props.playerId" />
	</div>
</template>

<style scoped>
.playerInformations {
	position: relative;
	transition-duration: 0.5s;
}
.playerInformations.dead {
	opacity: 0.5;
}
</style>

