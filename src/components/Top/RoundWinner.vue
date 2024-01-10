<script setup>
import { computed } from "vue";
import { useMatchStore } from "@/stores/match";

const matchStore = useMatchStore();


const matchPhase = computed(() => {
	let phase;
	let team;
	let winnerTeam;

	const roundInfo = matchStore.getData()?.roundInfo;

	if (roundInfo?.data?.phase == "over") {
		phase = roundInfo?.data?.phase;
		winnerTeam = roundInfo?.data?.win_team;
		team = matchStore.getData()["team_" + winnerTeam.toLowerCase()]?.name
	}

	return {
		phase,
		team,
		winnerTeam
	}
})

</script>
<template>
	<div v-if="matchPhase?.team" class="box">
		<div class="background">
			<div class="description">wins the round</div>
			<div class="name">{{ matchPhase?.team }}</div>
			<div class="line"></div>
			<div class="movingName" :class="[matchPhase?.winnerTeam]">{{ matchPhase?.team }}</div>
		</div>
	</div>
</template>

<style scoped>
.name {
	display: flex;
	align-self: center;
	justify-content: center;
	font-size: 42px;
	animation: italic 3s infinite;
}

.description {
	position: absolute;
	bottom: 10px;
	right: 10px;
	font-variant: all-small-caps;
	font-size: 16px;
}

.movingName {
	position: absolute;
	top: 20px;
	left: 0px;
	font-variant: all-small-caps;
	font-size: 30px;
	font-style: italic;
	opacity: 0.6;
	white-space: nowrap;
	animation: move 3s;
}

.movingName.T {
	color: var(--color-text-t)
}

.movingName.CT {
	color: var(--color-text-ct)
}

.line {
	position: absolute;
	background: white;
	height: 7px;
	width: 130px;
	left: -20px;
	bottom: 40px;
	animation: blinking 3s infinite;
	opacity: 1;
}

.box {
	display: flex;
	justify-content: center;
	opacity: 1;
	animation: fadeIn 1s;
}

.background {
	margin-top: 100px;
	display: flex;
	justify-content: center;
	height: 150px;
	min-width: 400px;
	background: rgba(0, 0, 0, 0.2);
	color: white;
	text-align: center;
	position: relative;
	padding: 0 60px;
}

@keyframes blinking {

	0%,
	9%,
	20%,
	70%,
	100% {
		opacity: 1;
	}

	10%,
	19%,
	71%,
	99% {
		opacity: 0;
	}
}

@keyframes italic {
	0% {
		font-style: italic;
	}

	40% {
		font-style: normal;
	}

	80% {
		font-style: italic;
	}
}

@keyframes fadeIn {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}

@keyframes move {
	0% {
		left: 80%;
		top: 90px;

	}

	40% {
		top: 90px;
	}

	41% {
		top: 20px;
	}

	100% {
		top: 20px;
		left: 0%;
	}
}
</style>

