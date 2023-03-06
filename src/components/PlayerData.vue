<script setup>
import Nickname from "@/components/Player/PlayerNick.vue";
import PlayerState from "@/components/Player/PlayerState.vue";
import PlayerStatistic from "@/components/Player/PlayerStatistics.vue";
import { useGuiStore } from "@/stores/gui";

const guiStore = useGuiStore();
</script>

<template>
	<div
		class="playerBox"
		:class="{
			hidden: !guiStore.getData().playersStatistics.show,
		}"
	>
		<Nickname></Nickname>
		<PlayerState></PlayerState>
		<PlayerStatistic></PlayerStatistic>
	</div>
</template>

<style scoped>
.playerBox {
	width: 500px;
	position: absolute;
	left: calc(50% - 250px);
	bottom: 150px;
	transition-duration: 0.5s;
}
.playerBox.hidden {
	opacity: 0;
}
</style>

