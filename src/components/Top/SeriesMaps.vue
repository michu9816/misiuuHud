<script setup>
import { computed } from 'vue';
import { useMatchStore } from '@/stores/match';
import { useSeriesStore } from '@/stores/series';
// import { usePlayersStore } from "@/stores/players";

const matchStore = useMatchStore();
const seriesStore = useSeriesStore();

// const playerStore = usePlayersStore();

const teams = computed(() => {
	return matchStore.getScore().teams;
});

const score = computed(() => {
	const show = matchStore.getPhase().round == 'freezetime' && seriesStore.getSeriesType() == 'bo3';

	return {
		show,
	};
});
const maps = computed(() => {
	return seriesStore
		.getMaps()
		?.filter((obj) => obj.order < 100)
		?.map((obj) => {
			return {
				...obj,
				winner:
					parseInt(obj.scores.find((score) => score.team == teams.value?.t)?.points) >
					parseInt(obj.scores.find((score) => score.team == teams.value?.ct)?.points)
						? 't'
						: parseInt(obj.scores.find((score) => score.team == teams.value?.t)?.points) < // eslint-disable-next-line
						  parseInt(obj.scores.find((score) => score.team == teams.value?.ct)?.points)
						? 'ct'
						: '',
			};
		});
});

const roundInfo = matchStore.getPhase();
</script>
<template>
	<div
		class="box"
		:class="{
			timeout: roundInfo?.timeout,
		}"
		v-if="score.show">
		<div class="maps">
			<div class="map" v-for="map in maps" :key="map.name" :class="[map.winner]">
				<div class="pick left" :class="{ ct: map.picked == teams.ct && map.order < 3 }">PICK</div>
				<div class="score">{{ map.scores.find((obj) => obj.team == teams.ct)?.points || '-' }}</div>
				<div>{{ map.name }}</div>
				<div class="score">{{ map.scores.find((obj) => obj.team == teams.t)?.points || '-' }}</div>
				<div class="pick right" :class="{ t: map.picked == teams.t && map.order < 3 }">PICK</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.box {
	display: flex;
	justify-content: center;
	color: white;
	animation: fadeIn 2.5s;
	position: fixed;
	top: 62px;
	left: calc(50% - 125px);
	transition-duration: 0.5s;
}
.box.timeout {
	top: 112px;
	border-radius: 5px;
	overflow: hidden;
}
.maps {
	background: black;
	border-radius: 0 0 5px 5px;
	gap: 5px;
	display: flex;
	flex-direction: column;
	font-size: 12px;
	text-transform: uppercase;
}
.map {
	display: grid;
	grid-template-columns: 45px 35px 90px 35px 45px;
	padding: 5px 0;
}
.map.t {
	background: -webkit-linear-gradient(right, var(--color-background-t), #0000ff00);
}
.map.ct {
	background: -webkit-linear-gradient(left, var(--color-background-ct), #0000ff00);
}
.map div {
	display: flex;
	align-items: center;
	justify-content: center;
}
.map .score {
	font-weight: bold;
	font-size: 20px;
}
.pick.t {
	background: var(--color-background-t);
}

.pick.right {
	border-radius: 5px 0 0 5px;
}
.pick.ct {
	background: var(--color-background-ct);
}
.pick.left {
	border-radius: 0 5px 5px 0;
}
.pick:not(.t, .ct) {
	opacity: 0;
}

@keyframes fadeIn {
	0% {
		opacity: 0;
	}
	80% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>
