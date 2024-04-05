<script setup>
import { computed, ref, watch } from 'vue';
import { useMatchStore } from '@/stores/match';
import { usePlayersStore } from '@/stores/players';

const matchStore = useMatchStore();
const playerStore = usePlayersStore();

const remainingPhaseTime = ref();
const remainingPhaseTimeInterval = ref();

const readedPhaseTime = computed(() => {
	return matchStore.getPhase()?.timer;
});

const matchPhase = computed(() => {
	let phase;
	let text;
	let team;
	let style;

	const roundInfo = matchStore.getPhase();

	if (['planting', 'defusing'].includes(roundInfo?.bomb)) {
		phase = roundInfo?.bomb;
		team = phase == 'planting' ? 't' : 'ct';
		text = `${playerStore.getPlayerBottomDataById(roundInfo?.player)?.name} is ${phase} the bomb`;
		// text = `bomb is ${phase}`
		const remainingTime = team == 't' ? 3 : playerStore.getPlayerBottomDataById(roundInfo?.player)?.defusekit ? 5 : 10;
		const percent = (remainingPhaseTime.value / remainingTime) * 100 || 0;
		style = `background-position: ${percent}%`;
	} else if (roundInfo?.timeout == 'CT') {
		team = 'ct';
		const timeouts = matchStore.getScore()?.timeouts[team];
		text = `${timeouts} TIMEOUTS remaining`;
	} else if (roundInfo?.timeout == 'T') {
		team = 't';
		const timeouts = matchStore.getScore()?.timeouts[team];
		text = `${timeouts} TIMEOUTS remaining`;
	} else if (roundInfo?.timeout == 'technical') {
		text = `match paused`;
	}

	return {
		phase,
		text,
		team,
		style,
	};
});

watch(readedPhaseTime, (val) => {
	if (val > 15) {
		clearInterval(remainingPhaseTimeInterval.value);
		return;
	}
	clearInterval(remainingPhaseTimeInterval.value);
	remainingPhaseTime.value = parseFloat(val).toFixed(1) || 0.0;
	remainingPhaseTimeInterval.value = setInterval(() => {
		if (remainingPhaseTime.value > 0) {
			remainingPhaseTime.value = (Number(parseFloat(remainingPhaseTime.value)) - 0.1).toFixed(1) || 0.0;
		} else {
			clearInterval(remainingPhaseTimeInterval.value);
		}
	}, 100);
});
</script>
<template>
	<div class="box">
		<div
			class="information"
			:class="[
				matchPhase?.team,
				{
					visible: matchPhase?.text,
				},
			]"
			:style="matchPhase?.style">
			<div>{{ matchPhase?.text }}</div>
			<div class="counter">{{ isNaN(remainingPhaseTime) ? '' : remainingPhaseTime }}</div>
		</div>
	</div>
</template>

<style scoped>
.box {
	display: flex;
	justify-content: center;
}

.information {
	width: 365px;
	color: white;
	padding: 10px 0;
	text-transform: uppercase;
	font-weight: bold;
	position: absolute;
	top: 10px;
	z-index: -1;
	background: #151515;
	transition: background 0.2s;
	overflow: hidden;
}

.counter {
	position: absolute;
	top: 0;
	right: 10px;
	opacity: 0.2;
	font-size: 39px;
}

.information.visible {
	top: 65px;
}

.information.t {
	margin-left: 475px;
	border: 4px solid var(--color-text-t);
	background: -webkit-linear-gradient(left, var(--color-text-t) 50%, var(--color-background-t) 50%);
	background-size: 200%;
	transition: top 0.5s, background 0.2s;
}

.information.ct {
	margin-right: 475px;
	border: 4px solid var(--color-text-ct);
	background: -webkit-linear-gradient(left, var(--color-text-ct) 50%, var(--color-background-ct) 50%);
	background-size: 200%;
	transition: top 0.5s, background 0.2s;
}
</style>
