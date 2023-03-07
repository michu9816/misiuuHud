<script setup>
import TeamBox from "@/components/Bottom/TeamBox.vue";
import PlayersRemaining from "./Bottom/PlayersRemaining.vue";
</script>

<template>
	<div>
		<TeamBox team="CT" />
		<PlayersRemaining></PlayersRemaining>
		<TeamBox team="T" />
	</div>
</template>

