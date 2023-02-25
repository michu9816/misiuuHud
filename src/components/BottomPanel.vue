<script setup>
import { useCounterStore } from "@/stores/players";
import TeamBox from "@/components/Bottom/TeamBox.vue";

const counter = useCounterStore();

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
	<div>
		<!-- Access the state directly from the store -->
		<div @click="increment">Current Count is: {{ counter.count }}</div>
		<TeamBox />
	</div>
</template>

