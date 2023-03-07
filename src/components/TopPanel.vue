<script setup>
import ScoreBox from "@/components/Top/ScoreBox.vue";
import TeamBox from "@/components/Top/TeamBox.vue";
import TimeBox from "@/components/Top/TimeBox.vue";
</script>

<template>
	<div class="matchScore">
		<TeamBox team="ct"></TeamBox>
		<ScoreBox team="ct"></ScoreBox>
		<TimeBox></TimeBox>
		<ScoreBox team="t"></ScoreBox>
		<TeamBox team="t"></TeamBox>
	</div>
</template>

<style scoped>
.matchScore {
	position: absolute;
	width: 920px;
	left: calc(50% - (920px / 2));
	display: grid;
	grid-template-columns: 330px 80px 100px 80px 330px;
	top: 10px;
	background: rgba(0, 0, 0, 0.8);
	font-size: 24px;
	color: white;
	border-radius: 5px;
}
</style>

