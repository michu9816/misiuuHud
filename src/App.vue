<template>
	<img alt="Vue logo" src="./assets/logo.png" />
	<!-- {{ test }} -->
	<BottomPanel></BottomPanel>
</template>

<script>
import BottomPanel from "./components/BottomPanel.vue";
import { ipcRenderer } from "electron";
import { usePlayersStore } from "./stores/players";
import { useMatchStore } from "./stores/match";
import { useGuiStore } from "./stores/gui";

export default {
	name: "App",
	components: {
		BottomPanel,
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
			vm.playersStore.loadPlayers(arg.allplayers);
			vm.matchStore.loadMatchData(arg.map);
			vm.matchStore.loadMatchRoundData(arg.round);
			let roundsNumber = Object.keys(arg.map.round_wins).length;
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

