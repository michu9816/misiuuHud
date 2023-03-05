<script setup>
import { usePlayersStore } from "@/stores/players";
import { computed, defineProps } from "vue";

const playersStore = usePlayersStore();

const props = defineProps(["playerId"]);

const playerData = computed(() => {
	return playersStore.getPlayerDataById(props.playerId);
});
</script>

<template>
	<!-- Access the state directly from the store -->
	<div class="darkBackground nickname">
		{{ playerData?.observer_slot }} | {{ playerData?.name }}
	</div>
</template>

<style scoped>
.nickname {
	padding: 8px 10px;
	text-align: left;
}
</style>

