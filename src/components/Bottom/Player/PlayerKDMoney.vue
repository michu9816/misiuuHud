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
	<div class="darkBackground statistics">
		<div class="statistic">
			<div class="title">K</div>
			<div>12<span class="roundKills">2</span></div>
		</div>
		<div class="statistic">
			<div class="title">D</div>
			<div>21</div>
		</div>
		<div class="statistic">
			<div class="title">Money</div>
			<div>$16000</div>
		</div>
	</div>
</template>

<style scoped>
.statistics {
	display: grid;
	grid-template-columns: 32% 26% 42%;
	padding: 5px 0;
}
.title {
	font-size: 10px;
	color: var(--color-text-gray);
	margin-bottom: 2px;
}
.roundKills {
	background: var(--gradient-health-ct-vertical);
	padding: 2px 5px;
	border-radius: 5px;
	margin-left: 3px;
}
</style>

