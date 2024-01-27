<template>
	<div>
		<!-- {{ playersStore.extendedStatistics() }} -->
		<!-- {{ guiStore.getData() }}<br /><br /> -->
		<!-- {{ matchStore.getData() }} -->
		<!--{{ matchStore.getData()?.roundInfo }} <br />
		moreThan3: {{ playersStore.someoneKilled3() ? "tak" : "nie" }}
		<br />dmghigh: {{ playersStore.someoneHighDMG() ? "tak" : "nie" }}<br />
		hs3:
		{{ playersStore.someoneHeadshoted3() ? "tak" : "nie" }}<br />
		{{ playersStore.getPlayers().map((obj) => obj.state.round_kills) }}
		<br /> -->
		<!-- {{ test }} -->
	</div>
	<PlayerData></PlayerData>
	<TopPanel></TopPanel>
	<StatisticsChart></StatisticsChart>
	<BottomPanel></BottomPanel>
</template>

<script>
import BottomPanel from "./components/BottomPanel.vue";
import TopPanel from "./components/TopPanel.vue";
import StatisticsChart from "./components/StatisticsChart.vue";
import PlayerData from "./components/PlayerData.vue";
import { ipcRenderer } from "electron";
import { usePlayersStore } from "./stores/players";
import { useMatchStore } from "./stores/match";
import { useGuiStore } from "./stores/gui";

export default {
	name: "App",
	components: {
		BottomPanel,
		TopPanel,
		PlayerData,
		StatisticsChart
	},
	data() {
		return {
			test: "123",
			playersStore: usePlayersStore(),
			matchStore: useMatchStore(),
			guiStore: useGuiStore(),
		};
	},
	created() {
		const vm = this;
		ipcRenderer.send("data", "test");
		ipcRenderer.on("data", (event, arg) => {
			vm.test = arg;
			vm.playersStore.loadPlayers(arg.allplayers, arg.player);
			vm.matchStore.loadMatchData(
				arg.map,
				arg.round,
				arg.phase_countdowns,
				arg.bomb
			);
			let roundsNumber = arg.round?.phase == "over" ? arg.map?.round - 1 : arg.map?.round;
			vm.guiStore.setPlayersDamage(arg.allplayers, roundsNumber);
		});
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>

