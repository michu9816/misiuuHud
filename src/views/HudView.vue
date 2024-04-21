<template>
	<PlayerData></PlayerData>
	<PlayersRemaining></PlayersRemaining>
	<TopPanel></TopPanel>
	<!-- <StatisticsChart></StatisticsChart> -->
	<BottomPanel></BottomPanel>
	<MapRadar v-if="showRadar"></MapRadar>
</template>

<script>
import BottomPanel from '@/components/BottomPanel.vue';
import TopPanel from '@/components/TopPanel.vue';
// import StatisticsChart from '@/components/StatisticsChart.vue';
import PlayerData from '@/components/PlayerData.vue';
import PlayersRemaining from '@/components/PlayersRemaining.vue';
import MapRadar from '@/components/MapRadar.vue';
import { ipcRenderer } from 'electron';
import { usePlayersStore } from '@/stores/players';
import { useMatchStore } from '@/stores/match';
import { useSeriesStore } from '@/stores/series';
import { useGuiStore } from '@/stores/gui';

export default {
	name: 'App',
	components: {
		BottomPanel,
		TopPanel,
		PlayerData,
		// StatisticsChart,
		PlayersRemaining,
		MapRadar,
	},
	data() {
		return {
			test: '123',
			playersStore: usePlayersStore(),
			matchStore: useMatchStore(),
			guiStore: useGuiStore(),
			seriesStore: useSeriesStore(),
		};
	},
	created() {
		const vm = this;
		ipcRenderer.send('data', 'test');
		ipcRenderer.on('data', (event, arg) => {
			vm.test = arg;
			vm.playersStore.loadPlayers(arg.allplayers, arg.player);
			vm.matchStore.loadMatchData(arg.map, arg.round, arg.phase_countdowns, arg.bomb, arg.grenades);
			let roundsNumber = arg.round?.phase == 'over' ? arg.map?.round - 1 : arg.map?.round;
			vm.guiStore.setPlayersDamage(arg.allplayers, roundsNumber);
		});
		ipcRenderer.on('set-radar-status', (event, arg) => {
			vm.seriesStore.setRadarStatus(arg);
		});
		ipcRenderer.on('series-complete-type', (event, arg) => {
			vm.seriesStore.setCompleteType(arg);
		});
		ipcRenderer.on('series-series-type', (event, arg) => {
			vm.seriesStore.setSeriesType(arg);
		});
		ipcRenderer.on('series-series-pick', (event, arg) => {
			console.log(arg);
			vm.seriesStore.pickMap(arg.team, arg.map);
		});
		ipcRenderer.on('series-series-reset', () => {
			vm.seriesStore.reset();
		});
		ipcRenderer.on('series-maps-results', (event, arg) => {
			vm.seriesStore.refreshScores(arg);
		});
	},
	computed: {
		teams() {
			return JSON.stringify(this.matchStore.getScore().teams);
		},
		showRadar() {
			return this.seriesStore.getRadarStatus();
		},
	},
	watch: {
		teams(val) {
			ipcRenderer.send('series-teams', val);
			console.log(val);
		},
	},
};
</script>

<style>
#app {
	font-family: 'Lexend Deca', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
