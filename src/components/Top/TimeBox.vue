<script setup>
import { useMatchStore } from "@/stores/match";
import { computed } from "vue";

const matchStore = useMatchStore();

const bombPlanted = computed(() => {
	return matchStore.getData()?.roundInfo.bomb.state == "planted";
});

const timeLeft = computed(() => {
	return convertTime(matchStore.getData()?.roundInfo.timer.phase_ends_in);
});

function convertTime(time) {
	let minutes = Math.floor(time / 60);
	let seconds = parseInt(time % 60);
	seconds = seconds.toLocaleString("pl-PL", { minimumIntegerDigits: 2 });

	return `${minutes}:${seconds}`;
}
</script>

<template>
	<div class="bomb" v-if="bombPlanted">
		<img src="@/assets/img/elements/icon_bomb_default.png" />
	</div>
	<div class="time" v-else>{{ timeLeft }}</div>
</template>

<style scoped>
.time {
	padding: 10px 0;
}
.bomb {
	display: flex;
	justify-content: center;
	align-items: center;
	animation: 2s bombTicking infinite;
	background: rgb(135, 0, 0);
}
.bomb img {
	height: 30px;
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

