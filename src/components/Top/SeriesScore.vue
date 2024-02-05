<script setup>
import { computed } from "vue";
import { useMatchStore } from "@/stores/match";
// import { usePlayersStore } from "@/stores/players";

const matchStore = useMatchStore();
// const playerStore = usePlayersStore();

const score = computed(() => {
	const ct = matchStore.getData()?.team_ct?.matches_won_this_series;
	const t = matchStore.getData()?.team_t?.matches_won_this_series;

	const show = (ct || t) && matchStore.getData()?.roundInfo?.data?.phase != "live";

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
			<div class="score">{{ score.ct }} - {{ score.t }}</div>
			<div class="background"></div>
		</div>
	</div>
</template>

<style scoped>
.box {
	display: flex;
	justify-content: center;
}

.score {
	position: absolute;
	top: 0;
	display: flex;
	width: 100%;
	text-align: center;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	padding: 2px 0;
}

.information {
	width: 100px;
	color: white;
	text-transform: uppercase;
	font-weight: bold;
	position: absolute;
	z-index: -1;
	transition-duration: 0.5s;
	top: 67px;
}

.background {
	border-left: 15px solid transparent;
	border-right: 15px solid transparent;
	border-top: 19px solid #000000;
}
</style>

