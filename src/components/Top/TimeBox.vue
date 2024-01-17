<script setup>
import { useMatchStore } from "@/stores/match";
import { computed } from "vue";

const matchStore = useMatchStore();

const bombPlanted = computed(() => {
	return matchStore.getData()?.roundInfo.bomb?.state == "planted";
});

const timeLeft = computed(() => {
	return convertTime(matchStore.getData()?.roundInfo?.timer?.phase_ends_in);
});

const bombTimerHeight = computed(() => {
	const maxTime = 40;
	const timeLeft = matchStore.getData()?.roundInfo.bomb.countdown;
	const percent = 100 - (timeLeft / maxTime) * 100;
	// return convertTime(matchStore.getData()?.roundInfo.timer.phase_ends_in);
	return `${percent}%`;
});

function convertTime(time) {
	let minutes = Math.floor(time / 60);
	let seconds = parseInt(time % 60);
	seconds = seconds.toLocaleString("pl-PL", { minimumIntegerDigits: 2 });

	return time > 0 ? `${minutes}:${seconds}` : "--:--";
}
</script>

<template>
	<div class="timeBackground">
		<div class="bomb" v-if="bombPlanted" :style="{
			height: bombTimerHeight,
		}">
			<img src="@/assets/img/elements/icon_bomb_default.png" />
		</div>
		<div class="time" v-else>{{ timeLeft }}</div>
	</div>
</template>

<style scoped>
.time {
	padding: 10px 0;
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
	background: #141414;
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

