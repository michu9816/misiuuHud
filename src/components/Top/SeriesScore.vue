<script setup>
import { computed } from "vue";
import { useMatchStore } from "@/stores/match";
import { useSeriesStore } from "@/stores/series";

// import { usePlayersStore } from "@/stores/players";

const matchStore = useMatchStore();
const seriesStore = useSeriesStore();

// const playerStore = usePlayersStore();

const score = computed(() => {
	const ct = matchStore.getScore()?.total?.ct;
	const t = matchStore.getScore()?.total?.t;
	const isBo1 = seriesStore.getSeriesType() == 'bo1';
	const show = (ct || t || isBo1) && matchStore.getPhase().round == "freezetime" && seriesStore.getSeriesType() != 'bo3';

	return {
		isBo1,
		ct,
		t,
		show
	}
})
</script>
<template>
	<div class="box" v-if="score.show">
		<div class="information">
			<div class="score" v-if="score.isBo1">BO1</div>
			<div class="score" v-else>{{ score.ct }} - {{ score.t }}</div>
			<div class="background"></div>
		</div>
	</div>
</template>

<style scoped>
.box {
	display: flex;
	justify-content: center;
	animation: fadeIn 0.5s;
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

@keyframes fadeIn {
	0%{
		opacity: 0;
	}
	100%{
		opacity: 1;
	}
	
}
</style>

