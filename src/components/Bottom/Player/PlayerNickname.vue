<script setup>
import { useCounterStore } from "@/stores/players";

const counter = useCounterStore();

counter.count++;
// with autocompletion ✨
counter.$patch({ count: counter.count + 1 });
// or using an action instead
counter.increment();
</script>

<template>
	<!-- Access the state directly from the store -->
	<div class="darkBackground nickname">Maciek z csa</div>
</template>

<style scoped>
.nickname {
	padding: 8px 10px;
	text-align: left;
}
</style>

