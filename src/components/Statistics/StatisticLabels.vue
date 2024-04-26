<template>
	<div class="player">
		<div class="nick">{{ data[0] }}</div>
		<div class="statistics">
			<div class="statistic left">
				<div class="value">{{ data[1] }}</div>
			</div>
			<div class="statistic middle" v-if="true && data[3]">{{ data[2] }}</div>
			<div class="statistic right">
				<div class="value">{{ data[3] }}</div>
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
	grid-template-columns: 215px 500px 215px;
	color: #cecece;
	margin-top: 5px;
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
.statistic .value {
	padding: 3px 15px;
	z-index: 2;
	position: relative;
}
.statistic.middle {
	display: flex;
	justify-content: center;
	align-items: center;
}
.statistic.left .value {
	text-align: right;
}
.statistic.right .value {
	text-align: left;
}
.player .statistics {
	display: grid;
	grid-template-columns: 200px 70px 200px;
}
.background {
	width: 0%;
	transition-duration: 1s;
}
.statistic.left .background {
	right: 0;
}
.T .background {
	background: var(--color-background-t);
	height: 100%;
	position: absolute;
}
.T .statistic.right .background {
	background: var(--color-text-t);
}
.statistic.left .background {
	border-radius: 5px 0 0 5px;
}
.statistic.right .background {
	border-radius: 0 5px 5px 0;
}
.CT .background {
	background: var(--color-background-ct);
	height: 100%;
	position: absolute;
}
.CT .statistic.right .background {
	background: var(--color-text-ct);
}
</style>
