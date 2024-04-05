<script setup>
import { useMatchStore } from '@/stores/match';
import { computed, ref, watch } from 'vue';

const matchStore = useMatchStore();

const bombPlanted = computed(() => {
	return ['planted', 'defusing'].includes(matchStore.getPhase()?.bomb);
});

const timeLeft = computed(() => {
	return convertTime(matchStore.getPhase()?.roundTimer);
});

const round = computed(() => {
	if (matchStore.getPhase()?.match == 'warmup') {
		return `Warmup`;
	} else if (matchStore.getPhase()?.match) {
		return `Round ${matchStore.getScore()?.round + 1}`;
	} else {
		return `No match`;
	}
});

const remainingBombTime = ref();
const remainingBombTimeInterval = ref();

const readedBombTime = computed(() => {
	return matchStore.getPhase()?.timer;
});

watch(readedBombTime, (val) => {
	if (matchStore.getPhase().bomb == 'defusing') {
		clearInterval(remainingBombTimeInterval.value);
		remainingBombTimeInterval.value = setInterval(() => {
			if (remainingBombTime.value > 0) {
				remainingBombTime.value = Number(parseFloat(remainingBombTime.value)).toFixed(1) - 0.1;
			} else {
				clearInterval(remainingBombTimeInterval.value);
			}
		}, 100);
	} else if (matchStore.getPhase().bomb == 'planted') {
		clearInterval(remainingBombTimeInterval.value);
		remainingBombTime.value = Number.parseFloat(val).toFixed(1);
	} else {
		clearInterval(remainingBombTimeInterval.value);
	}
});

const bombTimerHeight = computed(() => {
	const maxTime = 40;
	const timeLeft = remainingBombTime.value;
	const percent = 100 - (timeLeft / maxTime) * 100;
	return `${percent}%`;
});

function convertTime(time) {
	let minutes = Math.floor(time / 60);
	let seconds = parseInt(time % 60);
	seconds = seconds.toLocaleString('pl-PL', { minimumIntegerDigits: 2 });

	return time > 0 ? `${minutes}:${seconds}` : '--:--';
}
</script>

<template>
	<div class="timeBackground">
		<div
			class="bomb"
			v-if="bombPlanted"
			:style="{
				height: bombTimerHeight,
			}">
			<img src="@/assets/img/elements/icon_bomb_default.png" />
		</div>
		<div class="time" v-if="!bombPlanted">{{ timeLeft }}</div>
		<div class="round" v-if="!bombPlanted">{{ round }}</div>
	</div>
</template>

<style scoped>
.time {
	padding: 3px 0;
	border-left: 15px solid transparent;
	border-right: 15px solid transparent;
	border-bottom: 19px solid #ffffff;
	margin: 0px auto 0;
}

.round {
	position: absolute;
	bottom: 2px;
	font-size: 12px;
	color: black;
	width: 100%;
	font-weight: bold;
}

.bomb {
	animation: 2s bombTicking-251b7e38 infinite;
	background: rgb(135, 0, 0);
	position: relative;
}

.bomb img {
	padding-top: 6px;
	height: 30px;
}

.timeBackground {
	background: #000000;
	color: white;
	position: relative;
}

@keyframes bombTicking {
	0%,
	100% {
		background: rgb(135, 0, 0);
	}

	50% {
		background: rgb(91, 0, 0);
	}
}
</style>
