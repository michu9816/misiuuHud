<script setup>
import { defineProps, computed, ref, watch } from "vue";
import { useMatchStore } from "@/stores/match";

const matchStore = useMatchStore();

const props = defineProps(["team"]);

const score = computed(() => {
	let matchData = matchStore.getScore();
	return matchData ? (showNine.value ? "IX" : matchData.map[props.team]) : "-";
});

const showNine = ref(false);

const isNineAt9 = computed(() => {
	let matchData = matchStore.getScore();
	return matchData ? matchData.map[props.team] == 9 && matchData.teams[props.team]?.toUpperCase() == "9INE" : false
})

const nineAt9Timeout = ref();

watch(isNineAt9, (val) => {
	if (val) {
		nineAt9Timeout.value = setTimeout(() => {
			showNine.value = val;
		}, 3800)
	} else {
		clearTimeout(nineAt9Timeout.value);
		showNine.value = val;
	}
})

</script>

<template>
	<div class="score" :class="[team]">
		<div class="text" :class="{
			nine: isNineAt9
		}">{{ score }}</div>
	</div>
</template>

<style scoped>
.score {
	padding: 5px;
	font-size: 32px;
	font-weight: bold;
	transition-duration: 0.5s;
	background: black;
}

.score.ct {
	color: white;
	border-bottom: 5px solid var(--color-text-ct);
	border-left: 5px solid var(--color-text-ct);
	border-right: 5px solid transparent;
	transform: skewX(10deg);
	margin-right: 5px;
}

.score.ct .text {
	transform: skewX(-10deg);
}

.score.t {
	color: white;
	border-bottom: 5px solid var(--color-text-t);
	border-right: 5px solid var(--color-text-t);
	border-left: 5px solid transparent;
	transform: skewX(-10deg);
	margin-left: 5px;
}

.score.t .text {
	transform: skewX(10deg);
}

.score .text.nine {
	animation: nineAt9 5s;
	transition: transform 0s 3.8s, font-family 0s 5s;
	font-family: Arial, Helvetica, sans-serif;
	transform: rotate(270deg) skewY(-10deg);
}

.score.ct .text.nine {
	transform: rotate(270deg) skewY(10deg);
}

@keyframes nineAt9 {

	20% {
		font-style: italic;
	}

	31%,
	40%,
	71%,
	100% {
		opacity: 0;
	}

	0%,
	30%,
	41%,
	70% {
		opacity: 1;
		font-family: inherit;
	}

	80% {
		font-family: Arial, Helvetica, sans-serif;
	}

}
</style>

