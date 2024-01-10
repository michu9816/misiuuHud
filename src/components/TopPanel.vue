<script setup>
import ScoreBox from "@/components/Top/ScoreBox.vue";
import TeamBox from "@/components/Top/TeamBox.vue";
import TimeBox from "@/components/Top/TimeBox.vue";
import SeriesScore from "@/components/Top/SeriesScore.vue";
import RoundPhase from "@/components/Top/RoundPhase.vue";
import RoundWinner from "@/components/Top/RoundWinner.vue";
</script>

<template>
	<div class="matchScore">
		<TeamBox team="ct"></TeamBox>
		<ScoreBox team="ct"></ScoreBox>
		<TimeBox></TimeBox>
		<ScoreBox team="t"></ScoreBox>
		<TeamBox team="t"></TeamBox>
	</div>
	<SeriesScore></SeriesScore>
	<RoundPhase></RoundPhase>
	<RoundWinner></RoundWinner>
</template>

<style scoped>
.matchScore {
	position: absolute;
	width: 920px;
	left: calc(50% - (920px / 2));
	display: grid;
	grid-template-columns: 330px 80px 100px 80px 330px;
	top: 10px;
	font-size: 24px;
	color: white;
	border-radius: 5px;
}
</style>

