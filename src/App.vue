<template>
	<img alt="Vue logo" src="./assets/logo.png" />
	<HelloWorld msg="Welcome to Your Vue.js App" />
	<BottomPanel></BottomPanel>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import BottomPanel from "./components/BottomPanel.vue";
import { ipcRenderer } from "electron";

export default {
	name: "App",
	components: {
		HelloWorld,
		BottomPanel,
	},
	created() {
		ipcRenderer.send("data", "test");
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

