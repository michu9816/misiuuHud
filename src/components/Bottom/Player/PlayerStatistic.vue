<script setup>
import { computed, ref } from "vue";
import { useCounterStore } from "@/stores/players";

const counter = useCounterStore();

counter.count++;
// with autocompletion ✨
counter.$patch({ count: counter.count + 1 });
const adr = ref((Math.random(2, 4) * 100).toFixed(1));

const adrHeight = computed(() => {
	let test = parseInt(adr.value) + 50;
	return test;
});
// or using an action instead
counter.increment();
</script>

<template>
	<!-- Access the state directly from the store -->
	<div
		class="darkBackground"
		:style="{
			height: adrHeight + 'px',
		}"
	>
		<div class="title">ADR</div>
		<div class="value">
			{{ adr }}
		</div>
	</div>
</template>

<style scoped>
.title {
	font-size: 10px;
	color: var(--color-text-gray);
	margin-bottom: 2px;
	padding: 5px 0;
}
.darkBackground {
	background: var(--gradient-health-ct-vertical);
	transition-duration: 0.5s;
	height: 0px;
}
</style>

