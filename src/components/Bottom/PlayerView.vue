<script setup>
import { useCounterStore } from "@/stores/players";
import PlayerNickname from "@/components/Bottom/Player/PlayerNickname.vue";
import PlayerHealth from "@/components/Bottom/Player/PlayerHealth.vue";
import PlayerKDMoney from "@/components/Bottom/Player/PlayerKDMoney.vue";
import PlayerStatistic from "@/components/Bottom/Player/PlayerStatistic.vue";

const counter = useCounterStore();

counter.count++;
// with autocompletion ✨
counter.$patch({ count: counter.count + 1 });
// or using an action instead
counter.increment();
</script>

<template>
	<!-- Access the state directly from the store -->
	<div class="playerInformations">
		<PlayerNickname />
		<PlayerHealth />
		<PlayerKDMoney />
		<PlayerStatistic />
	</div>
</template>

<style scoped>
.playerInformations {
	position: relative;
}
</style>

