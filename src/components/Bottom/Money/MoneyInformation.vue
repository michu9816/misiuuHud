<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps(['name', 'values']);

const name = computed(() => {
	return props.name;
});
</script>
<template>
	<div class="information">
		<div class="steps ct">
			<div v-for="i in 4" :key="i" :class="{ active: i <= values[0].steps }"></div>
		</div>
		<div>{{ name }}</div>
		<div class="steps t">
			<div v-for="i in 4" :key="i" :class="{ active: i <= values[1].steps }"></div>
		</div>
	</div>
	<div class="values">
		<div class="ct">${{ values[0].value }}</div>
		<div class="t">${{ values[1].value }}</div>
	</div>
</template>

<style scoped>
.box {
	display: flex;
	justify-content: center;
	color: white;
	animation: fadeIn 0.5s;
	position: absolute;
	left: calc(50% - 120px);
	bottom: 10px;
}
.informations {
	background: black;
	border-radius: 5px;
	margin-top: 5px;
	width: 240px;
	padding: 5px 0;
}
.information {
	display: grid;
	grid-template-columns: auto 100px auto;
	align-items: center;
}
.steps {
	display: grid;
	grid-template-columns: repeat(4, calc((100% - 15px) / 4));
	grid-gap: 5px;
	padding: 5px;
}
.steps.t {
	direction: rtl;
}
.steps div {
	background: var(--color-background-gray);
	height: 5px;
	transform: skewX(30deg);
	transition-duration: 0.5s;
}
.steps.t div {
	transform: skewX(-30deg);
}
.t.steps div.active {
	background: var(--color-text-t);
}
.ct.steps div.active {
	background: var(--color-text-ct);
}
.values {
	display: grid;
	grid-template-columns: 50% 50%;
	font-size: 18px;
}

@keyframes fadeIn {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>
