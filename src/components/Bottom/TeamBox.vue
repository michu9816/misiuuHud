<script setup>
import PlayerView from "@/components/Bottom/PlayerView.vue";
</script>

<template>
	<div class="team" :class="[teamSide]">
		<PlayerView />
		<PlayerView />
		<PlayerView />
		<PlayerView />
		<PlayerView />
	</div>
</template>

<style scoped>
.team {
	position: absolute;
	bottom: 0;
	display: grid;
	grid-gap: 10px;
	grid-template-columns: repeat(5, 140px);
	align-items: end;
}
.team.ct {
	left: 10px;
}
.team.tt {
	right: 10px;
}
</style>

