<template>
	<div class="body">
		<div class="settings tab">
			<div class="title">Settings</div>
			<div class="content">
				<div class="item">
					Series settings
					<div class="options">
						<div class="option" :class="{ selected: seriesType == undefined }" @click="setSeriesType(undefined)">N/D</div>
						<div class="option" :class="{ selected: seriesType == 'bo1' }" @click="setSeriesType('bo1')">BO1</div>
						<div class="option" :class="{ selected: seriesType == 'bo3' }" @click="setSeriesType('bo3')">BO3</div>
					</div>
				</div>
				<div class="item">
					Score completing
					<div class="options">
						<div class="option" :class="{ selected: completeType == 'auto' }" @click="setCompleteType('auto')">Auto</div>
						<div class="option" :class="{ selected: completeType == 'manual' }" @click="setCompleteType('manual')">Manual</div>
					</div>
				</div>
				<div class="item">
					Show radar
					<div class="options">
						<div class="option" :class="{ selected: showRadar }" @click="setRadarStatus(true)">Yes</div>
						<div class="option" :class="{ selected: !showRadar }" @click="setRadarStatus(false)">No</div>
					</div>
				</div>
			</div>
		</div>
		<div class="veto tab" v-if="seriesType == 'bo3'">
			<div class="title">Maps <span style="float: right" @click="reset()">Reset</span></div>
			<div class="content">
				<div class="teams">
					<div class="team ct">{{ teams[0] }}</div>
					<div class="team t">{{ teams[1] }}</div>
				</div>

				<div class="map">
					<div>Pick</div>
					<div>Score</div>
					<div>Map</div>
					<div>Score</div>
					<div>Pick</div>
				</div>
				<div
					class="map list"
					v-for="map in maps"
					:key="map"
					:class="{ disabled: !map.picked && maps.filter((obj) => obj.picked && obj.order).length > 2 }">
					<div
						class="pick"
						:class="[map.picked == teams[0] && map.order < 3 ? 'ct' : '', { disabled: (map.picked && map.picked != teams[0]) || map.order == 3 }]"
						@click="pickMap(teams[0], map.name)">
						PICK
					</div>
					<div><input v-model="map.scores[0].points" :disabled="!map.picked || completeType == 'auto'" /></div>
					<div>{{ map.name }}</div>
					<div><input v-model="map.scores[1].points" :disabled="!map.picked || completeType == 'auto'" /></div>
					<div
						class="pick"
						:class="[map.picked == teams[1] && map.order < 3 ? 't' : '', { disabled: (map.picked && map.picked != teams[1]) || map.order == 3 }]"
						@click="pickMap(teams[1], map.name)">
						PICK
					</div>
				</div>
				<div class="button" @click="saveResults" v-show="completeType == 'manual'">Save results</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useSeriesStore } from '@/stores/series.js';
import { ipcRenderer } from 'electron';

const teams = ref(['T', 'CT']);

ipcRenderer.on('series-teams', (event, arg) => {
	const teamsList = [JSON.parse(arg).ct, JSON.parse(arg).t];
	if (teamsList.every((team) => team)) {
		console.log('Teams Exists');
		if (!teamsList.every((team) => teams.value.includes(team))) {
			console.log('Teams changed');
			teams.value = JSON.parse(JSON.stringify(teamsList));
		}
	}
});

const seriesStore = useSeriesStore();

const seriesType = computed(() => {
	return seriesStore.getSeriesType();
});
const completeType = computed(() => {
	return seriesStore.getCompleteType();
});

const setCompleteType = function (type) {
	seriesStore.setCompleteType(type);
	ipcRenderer.send('series-complete-type', type);
};

const showRadar = computed(() => {
	return seriesStore.getRadarStatus();
});

const setRadarStatus = function (type) {
	seriesStore.setRadarStatus(type);
	ipcRenderer.send('set-radar-status', type);
};

const setSeriesType = function (type) {
	seriesStore.setSeriesType(type);
	ipcRenderer.send('series-series-type', type);
};

const pickMap = function (team, map) {
	if (maps.value.filter((obj) => obj.picked).length >= 3) {
		return;
	}
	seriesStore.pickMap(team, map);
	ipcRenderer.send('series-series-pick', { team, map });
};

const reset = function () {
	seriesStore.reset();
	ipcRenderer.send('series-series-reset', true);
};

const maps = computed(() => {
	return seriesStore.getMaps();
});

const saveResults = function () {
	maps.value
		.filter((obj) => obj.picked)
		.forEach((obj) => {
			obj.scores[0].team = teams.value[0];
			obj.scores[1].team = teams.value[1];
		});
	ipcRenderer.send('series-maps-results', JSON.stringify(maps.value.filter((obj) => obj.picked)));
};
</script>

<style scoped>
.body {
	background: var(--color-background-gray);
	color: white;
	position: absolute;
	top: 0;
	left: 0;
	width: calc(100% - 20px);
	height: calc(100% - 20px);
	text-align: left;
	padding: 10px;
	display: grid;
	grid-gap: 10px;
}
.tab {
	border: 1px solid rgba(0, 0, 0, 0.5);
	background: rgba(0, 0, 0, 0.5);
	border-radius: 5px;
	padding: 5px 10px;
}
.tab .title {
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	padding-bottom: 5px;
	margin-bottom: 5px;
	font-size: 20px;
}
.item {
	margin-bottom: 10px;
}
.options {
	display: flex;
	gap: 10px;
	margin-top: 5px;
}
.options .option {
	background: rgba(255, 255, 255, 0.2);
	padding: 5px 10px;
	border-radius: 5px;
	cursor: pointer;
	font-size: 12px;
	transition-duration: 0.5s;
}
.options .option.selected {
	background: var(--color-background-ct);
}
.veto .map {
	display: grid;
	grid-template-columns: 15% 15% 40% 15% 15%;
	text-align: center;
	margin-bottom: 5px;
}
.veto .map.list .pick {
	transition-duration: 0.5s;
	font-size: 12px;
	display: flex;
	background: var(--color-text-white);
	width: 40px;
	border-radius: 5px;
	cursor: pointer;
	color: black;
	font-weight: bold;
	justify-content: center;
	align-items: center;
	width: 100%;
}
.veto .map.list .pick.t {
	background: var(--color-text-t);
	color: white;
}
.veto .map.list .pick.ct {
	background: var(--color-text-ct);
	color: white;
}
.veto .map.list:not(:hover) .pick:not(.t, .ct) {
	opacity: 0;
}
.veto .map input {
	width: 60%;
	background: none;
	color: white;
}
.teams {
	display: grid;
	grid-template-columns: 50% 50%;
	font-size: 24px;
	margin-bottom: 10px;
	text-align: center;
}
.team.t {
	color: var(--color-text-t-bright);
}
.team.ct {
	color: var(--color-text-ct-bright);
}
.disabled {
	filter: grayscale(1);
	opacity: 0.3;
}
.button {
	background: var(--color-text-white);
	text-align: center;
	color: black;
	padding: 5px 10px;
	border-radius: 5px;
	cursor: pointer;
}
</style>
