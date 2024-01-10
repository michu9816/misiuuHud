<script setup>
import { computed } from "vue";
import { useMatchStore } from "@/stores/match";
// import { usePlayersStore } from "@/stores/players";

const matchStore = useMatchStore();
// const playerStore = usePlayersStore();

const matchPhase = computed(() => {
	let phase;
	let text;
	let team;

	const roundInfo = matchStore.getData()?.roundInfo;

	if (["planting", "defusing"].includes(roundInfo?.bomb?.state)) {
		phase = roundInfo?.bomb?.state
		team = phase == "planting" ? "t" : "ct";
		// text = `${playerStore.getPlayerDataById(roundInfo?.bomb?.player)?.name} is ${phase} the bomb`
		text = `bomb is ${phase}`
	} else if (roundInfo?.timer?.phase == "timeout_ct") {
		team = "ct";
		const timeouts = matchStore.getData()["team_" + team]?.timeouts_remaining;
		text = `${timeouts} TIMEOUTS remaining`
	} else if (roundInfo?.timer?.phase == "timeout_t") {
		team = "t";
		const timeouts = matchStore.getData()["team_" + team]?.timeouts_remaining;
		text = `${timeouts} TIMEOUTS remaining`
	} else if (roundInfo?.timer?.phase == "paused") {
		text = `match paused`
	}

	return {
		phase,
		text,
		team
	}
})
</script>
<template>
	<div class="box">
		<div class="information" :class="[matchPhase?.team, {
			visible: matchPhase?.text
		}]">
			<div>{{ matchPhase?.text }}</div>
		</div>
	</div>
</template>

<style scoped>
.box {
	display: flex;
	justify-content: center;
}

.information {
	width: 260px;
	color: white;
	padding: 10px 0;
	text-transform: uppercase;
	font-weight: bold;
	position: absolute;
	top: 10px;
	z-index: -1;
	transition-duration: 0.5s;
	background: #151515;
}

.information.visible {
	top: 60px;
}

.information.t {
	background: var(--color-text-t);
}

.information.ct {
	background: var(--color-text-ct);
}
</style>

