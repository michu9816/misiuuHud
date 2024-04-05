<script setup>
import { computed } from "vue";
import { useMatchStore } from "@/stores/match";
import { useSeriesStore } from "@/stores/series";
// import { usePlayersStore } from "@/stores/players";

const matchStore = useMatchStore();
const seriesStore = useSeriesStore();

// const playerStore = usePlayersStore();

const teams = computed(()=>{
	return matchStore.getScore().teams;
});

const score = computed(() => {
	const ct = matchStore.getScore()?.total?.ct;
	const t = matchStore.getScore()?.total?.t;

	const show = (ct || t) && matchStore.getPhase().round != "live" && seriesStore.getSeriesType() == "bo3";

	return {
		ct,
		t,
		show
	}
})
const maps = computed(()=>{
	return seriesStore.getMaps()?.filter(obj => obj.order < 100)
})
</script>
<template>
	<div class="box" v-if="score.show">
		<div class="maps">
			<div class="map" v-for="map in maps" :key="map.name">
				<div class="pick left" :class="{ct:map.picked == teams.ct && map.order < 3}">PICK</div>
				<div class="score">{{map.scores.find(obj => obj.team == teams.ct)?.points || "-"}}</div>
				<div>{{ map.name }}</div>
				<div class="score">{{map.scores.find(obj => obj.team == teams.t)?.points || "-"}}</div>
				<div class="pick right" :class="{t:map.picked == teams.t && map.order < 3}">PICK</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.box {
	display: flex;
	justify-content: center;
	color:white;
	margin-top: 5px;
}
.maps{
	background: black;
	border-radius: 0 0 5px 5px;
}
.map{
	display:grid;
	grid-template-columns: 45px 35px 90px 35px 45px;
	margin: 5px 0;
	padding: 5px 0;
}
.map div{
	display: flex;
	align-items: center;
    justify-content: center;
}
.map .score{
	font-weight: bold;
	font-size: 20px;
}

.pick.t{
	background: var(--color-background-t);
}

.pick.right{
border-radius: 5px 0 0 5px;
}
.pick.ct{
	background: var(--color-background-ct);
}
.pick.left{
	border-radius: 0 5px 5px 0;
}
.pick:not(.t,.ct){
	opacity: 0;
}
</style>

