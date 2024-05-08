<template>
	<div class="player">
		<div class="nick">{{ data[0] }}</div>
		<div class="statistics">
			<div class="statistic" v-for="i in 4" :key="i">
				<div class="value">{{ data[i] }}</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps(['data']);

console.log(props.data);
</script>
<style scoped>
.player {
	display: grid;
	grid-template-columns: 150px auto;
	color: #cecece;
	margin-top: 5px;
	padding: 0 10px;
	font-size: 12px;
}
.player .nick {
	text-align: left;
	padding-left: 10px;
	display: flex;
	align-items: center;
}
.statistic {
	position: relative;
}
.player .statistics {
	display: flex;
	gap: 10px;
	justify-content: flex-end;
}
.statistic .value {
	width: 45px;
	text-align: center;
}
</style>
