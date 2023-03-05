<script setup>
import ScoreBox from "@/components/Top/ScoreBox.vue";
import TeamBox from "@/components/Top/TeamBox.vue";
import TimeBox from "@/components/Top/TimeBox.vue";
</script>

<template>
	<div class="matchScore">
		<TeamBox team="ct">Counter Terrorists</TeamBox>
		<ScoreBox team="ct"></ScoreBox>
		<TimeBox></TimeBox>
		<ScoreBox team="t"></ScoreBox>
		<TeamBox team="t">Terrorists</TeamBox>
	</div>
</template>

<style scoped>
.matchScore {
	position: absolute;
	width: 920px;
	left: calc(50% - (920px / 2));
	display: grid;
	grid-template-columns: 330px 80px 100px 80px 330px;
	top: 0;
	background: -webkit-linear-gradient(
		left,
		transparent 10%,
		rgba(0, 0, 0, 0.8) 30%,
		rgba(0, 0, 0, 0.8) 70%,
		transparent 90%
	);
	font-size: 24px;
	color: white;
}
</style>

