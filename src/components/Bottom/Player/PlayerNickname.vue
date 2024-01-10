<script setup>
import { usePlayersStore } from "@/stores/players";
import { computed, defineProps } from "vue";

const playersStore = usePlayersStore();

const props = defineProps(["playerId"]);

const playerData = computed(() => {
	return playersStore.getPlayerDataById(props.playerId);
});

const observerSlot = computed(() => {
	let slot = playerData.value?.observer_slot + 1;
	return slot < 10 ? slot : 0;
})
</script>

<template>
	<!-- Access the state directly from the store -->
	<div class="darkBackground nickname">
		{{ observerSlot }} | {{ playerData?.name }}
	</div>
</template>

<style scoped>
.nickname {
	padding: 8px 10px;
	text-align: left;
}
</style>

