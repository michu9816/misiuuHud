<script setup>
import ScoreBox from '@/components/Top/ScoreBox.vue';
import TeamBox from '@/components/Top/TeamBox.vue';
import TimeBox from '@/components/Top/TimeBox.vue';
import SeriesMaps from '@/components/Top/SeriesMaps.vue';
import RoundPhase from '@/components/Top/RoundPhase.vue';
import RoundWinner from '@/components/Top/RoundWinner.vue';
</script>

<template>
	<div class="matchScore">
		<TeamBox team="ct"></TeamBox>
		<ScoreBox team="ct"></ScoreBox>
		<TimeBox></TimeBox>
		<ScoreBox team="t"></ScoreBox>
		<TeamBox team="t"></TeamBox>
	</div>
	<SeriesMaps></SeriesMaps>
	<RoundPhase></RoundPhase>
	<RoundWinner></RoundWinner>
</template>

<style scoped>
.matchScore {
	position: absolute;
	width: 865px;
	left: calc(50% - (860px / 2));
	display: grid;
	grid-template-columns: 300px 80px 100px 80px 300px;
	top: 10px;
	font-size: 24px;
	border-radius: 5px;
	background: rgb(0 0 0);
	overflow: hidden;
}
</style>
