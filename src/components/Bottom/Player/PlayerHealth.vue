<script setup>
import { ref, watch } from "vue";
import { useCounterStore } from "@/stores/players";

const counter = useCounterStore();

counter.count++;
// with autocompletion ✨
counter.$patch({ count: counter.count + 1 });
// or using an action instead
counter.increment();

const decreaseOldHealth = ref();

const currentHealth = ref(100);
const oldHealth = ref(100);

watch(currentHealth, (val) => {
	clearTimeout(decreaseOldHealth.value);

	if (val < 0) {
		currentHealth.value = 0;
	}
	decreaseOldHealth.value = setTimeout(() => {
		oldHealth.value = currentHealth.value;
	}, 750);
});

const decrease = () => {
	currentHealth.value -= 7;
};
</script>

<template>
	<!-- Access the state directly from the store -->
	<div
		class="bars"
		:class="{
			hide: currentHealth == 0,
		}"
	>
		<div class="health bar" @click="decrease">+ {{ currentHealth }}</div>
		<div
			class="healthBackground bar"
			:style="{
				width: `${currentHealth}%`,
			}"
		></div>
		<div
			class="oldHealthBackground bar"
			:style="{
				width: `${oldHealth}%`,
			}"
		></div>
		<div class="darkBackground bar"></div>
	</div>
</template>

<style scoped>
.bar {
	height: 100%;
	text-align: left;
	align-items: center;
	display: flex;
	position: absolute;
	width: 100%;
}
.darkBackground {
	background: var(--vt-c-dark-transparent-9);
}
.health {
	color: var(--color-text-white);
	z-index: 3;
	padding: 0 10px;
	font-weight: bold;
	font-size: 20px;
	width: calc(100% - 20px);
}
.healthBackground {
	background: var(--gradient-health-ct);
	z-index: 2;
}
.oldHealthBackground {
	background: var(--color-background-dark-red);
	z-index: 1;
	transition-duration: 0.5s;
}
.bars {
	position: relative;
	transition-duration: 0.5s;
	height: 30px;
}
.hide {
	height: 0;
	overflow: hidden;
}
</style>

