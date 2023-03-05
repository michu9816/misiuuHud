<script setup>
import { usePlayersStore } from "@/stores/players";

const counter = usePlayersStore();

counter.count++;
// with autocompletion ✨
counter.$patch({ count: counter.count + 1 });
// or using an action instead
counter.increment();

const increment = () => {
	counter.increment();
};
</script>

<template>
	<!-- Access the state directly from the store -->
	<div @click="increment">Current Count: {{ counter.count }}</div>
</template>

