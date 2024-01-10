<script setup>
import { computed } from "vue";
import { useMatchStore } from "@/stores/match";
// import { usePlayersStore } from "@/stores/players";

const matchStore = useMatchStore();
// const playerStore = usePlayersStore();

const score = computed(() => {
	const ct = matchStore.getData()?.team_ct?.matches_won_this_series;
	const t = matchStore.getData()?.team_t?.matches_won_this_series;

	const show = ct || t;

	return {
		ct,
		t,
		show
	}
})
</script>
<template>
	<div class="box" v-if="score.show">
		<div class="information">
			<div class="score">{{ score.ct }}</div>
			<div>Match</div>
			<div class="score">{{ score.t }}</div>
		</div>
	</div>
</template>

<style scoped>
.box {
	display: flex;
	justify-content: center;
}

.score {
	width: 80px;
}

.information {
	width: 260px;
	color: white;
	padding: 10px 0;
	text-transform: uppercase;
	font-weight: bold;
	position: absolute;
	top: 10px;
	z-index: -2;
	transition-duration: 0.5s;
	background: #151515;
	top: 60px;
	display: flex;
	justify-content: space-between;
}


.information.t {
	background: var(--color-text-t);
}

.information.ct {
	background: var(--color-text-ct);
}
</style>

