<script setup>
import { defineProps, computed, ref, watch } from 'vue';
import { useMatchStore } from '@/stores/match';
import { useSeriesStore } from '@/stores/series';

const matchStore = useMatchStore();

const props = defineProps(['team']);

const score = computed(() => {
	let matchData = matchStore.getScore();
	return matchData ? (showNine.value ? 'IX' : matchData.map[props.team]) : '-';
});

const showNine = ref(false);
const showNineAsRoman = ref(false);

const isNineAt9 = computed(() => {
	let matchData = matchStore.getScore();
	return matchData ? matchData.map[props.team] == 9 && matchData.teams[props.team]?.toUpperCase() == '9INE' : false;
});

const nineAt9Timeout = ref();

watch(isNineAt9, (val) => {
	showNineAsRoman.value = val;
	if (val) {
		nineAt9Timeout.value = setTimeout(() => {
			showNine.value = val;
		}, 3800);
		setTimeout(() => {
			showNine.value = false;
			showNineAsRoman.value = false;
		}, 20000);
	} else {
		clearTimeout(nineAt9Timeout.value);
		showNine.value = val;
	}
});

const seriesStore = useSeriesStore();
const isBo3 = computed(() => {
	return seriesStore.getSeriesType() == 'bo3';
});

const teams = computed(() => {
	return matchStore.getScore().teams;
});

const getTeamScore = computed(() => {
	return seriesStore
		.getMaps()
		?.filter(
			(obj) =>
				obj.picked &&
				parseInt(obj.scores.find((score) => score.team == teams.value[props.team])?.points) >
					parseInt(obj.scores.find((score) => score.team == teams.value[props.team == 'ct' ? 't' : 'ct'])?.points)
		).length;
});
</script>

<template>
	<div class="score" :class="[team, { bo3: isBo3 }]">
		<div
			class="text"
			:class="{
				nine: showNineAsRoman,
			}">
			{{ score }}
		</div>
		<div class="seriesScore">
			<div :class="{ active: getTeamScore == 2 }"></div>
			<div :class="{ active: getTeamScore }"></div>
		</div>
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
.score.bo3.t .text {
	margin-right: 10px;
}
.score.bo3.ct .text {
	margin-left: 10px;
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
.score:not(.bo3) .seriesScore {
	display: none;
}
.seriesScore {
	position: absolute;
	top: 0;
	left: 0;
	width: 5px;
	height: calc(100% - 10px);
	display: grid;
	padding: 5px;
	grid-template-rows: calc((100% - 5px) / 2);
	grid-gap: 5px;
}
.t .seriesScore {
	right: 0;
	left: auto;
}
.seriesScore div {
	background: var(--color-background-gray);
}
.t .seriesScore div.active {
	background: var(--color-text-t);
}
.ct .seriesScore div.active {
	background: var(--color-text-ct);
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
