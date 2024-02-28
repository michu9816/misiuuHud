<script setup>
import { computed, ref, watch } from "vue";
import { useMatchStore } from "@/stores/match";

const matchStore = useMatchStore();

const phase = ref();
const team = ref();
const winnerTeam = ref();
const score = ref();

const matchPhase = computed(() => {
	return matchStore.getPhase()?.round;
})

const showWinnerInformations = ref(false);
const hideInformationsTimeout = ref();

watch(matchPhase, (val) => {
	if (val == "over") {
		showWinnerInformations.value = true;
		phase.value = matchStore.getPhase()?.round;
		winnerTeam.value = matchStore.getPhase()?.winner;
		team.value = matchStore.getScore()?.teams[winnerTeam.value.toLowerCase()];
		score.value = matchStore.getScore()?.map[winnerTeam.value.toLowerCase()];
	} else {
		clearTimeout(hideInformationsTimeout)
		hideInformationsTimeout.value = setTimeout(() => {
			showWinnerInformations.value = false;
			matchStore.resetRoundHistoryElement();
		}, 2000)
	}
})

const roundHistory = computed(() => {
	return matchStore?.getRoundHistory();
})

const getActionIcon = function (value) {
	let iconName;
	switch (value) {
		case "elimination":
			iconName = "icon_skull_CT"
			break;
		case "planted":
			iconName = "icon_c4_default"
			break;
		case "bomb":
			iconName = "icon_bomb_explosion_default"
			break;
		case "defuse":
			iconName = "icon_defuse_default"
			break;
		case "time":
			iconName = "icon_hourglass_default"
			break;
	}
	return require(`@/assets/img/elements/${iconName}.png`);
};


</script>
<template>
	<div v-if="showWinnerInformations" class="box" :class="[{ hide: matchPhase != 'over' }, winnerTeam]">
		<div class="background">
			<div class="scoreOverlay">
				{{ score }}
			</div>
			<div class="content">
				<div class="description">round winner</div>
				<div class="name">{{ team }}</div>
			</div>
		</div>
		<div class="roundHistory" v-if="roundHistory.length">
			<div class="el" v-for=" element  in  roundHistory " :key="element.action">
				<img class="def" :class="element.team" :src="getActionIcon(element.action)" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.name {
	display: flex;
	align-self: center;
	justify-content: center;
	font-size: 42px;
	padding-top: 40px;
	color: var(--color-background-gray);
	font-weight: bold;
	animation: moveDown 3s;
}

.scoreOverlay {
	width: 100%;
	height: 100%;
	position: absolute;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 100px;
	z-index: 2;
	right: -100%;
	animation: moveRight 2s;
}

.T .scoreOverlay,
.T .description {
	background: var(--color-background-t);
}

.CT .scoreOverlay,
.CT .description {
	background: var(--color-background-ct);
}

.score {
	position: absolute;
	bottom: 0px;
	left: 20px;
	font-size: 70px;
}

.description {
	position: absolute;
	padding: 8px 0;
	top: 2px;
	left: 2px;
	text-transform: uppercase;
	font-size: 18px;
	color: white;
	width: calc(100% - 4px);
	border-radius: 5px;
	animation: colorIn 3s;
}


.box {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 330px;
}

.background {
	display: flex;
	justify-content: center;
	background: white;
	text-align: center;
	opacity: 1;
	border-radius: 5px;
	position: relative;
	animation: fadeIn 1s;
	height: 120px;
	overflow: hidden;
	align-items: center;
}

.content {
	padding: 0 60px;
	height: 120px;
	min-width: 300px;
	position: relative;
	display: flex;
	justify-content: center;
}

.roundHistory {
	position: absolute;
	background: var(--color-background-gray);
	padding: 5px 10px;
	border-radius: 5px;
	margin-top: 165px;
	animation: moveDownHistory 3s;
	z-index: -1;
	display: flex;
	gap: 5px;
}

.roundHistory img {
	height: 20px;
}

.roundHistory img.CT {
	filter: hue-rotate(135deg);
}

.hide {
	animation: fadeOut 1s 1s;
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

@keyframes fadeIn {

	0% {
		opacity: 0;
		height: 0px;
		background: var(--color-text-t);
	}

	100% {
		opacity: 1;
		height: 120px;
		background: white;
	}
}

@keyframes fadeOut {

	0% {
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
}

@keyframes colorIn {

	0%,
	75% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}

@keyframes moveRight {

	0%,
	75% {
		right: 0%;
	}

	100% {
		right: -100%;
	}
}

@keyframes moveIn {
	0% {
		right: calc(100% - 180px);
		width: 140px;
	}

	100% {
		right: 30px;
		width: 50px;
	}
}

@keyframes moveDown {

	0%,
	75% {
		padding-top: 0px;
	}

	100% {
		padding-top: 40px;
	}
}

@keyframes moveDownHistory {

	0%,
	75% {
		margin-top: 0px;
	}

	0%,
	40% {
		opacity: 0;
	}

	50% {
		opacity: 1;
	}

	100% {
		margin-top: 165px;
	}
}
</style>

