<template>
	<img alt="Vue logo" src="./assets/logo.png" />
	<HelloWorld msg="Welcome to Your Vue.js App" />
	{{ test }}
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
	data() {
		return {
			test: "123",
		};
	},
	created() {
		const vm = this;
		ipcRenderer.send("data", "test");
		ipcRenderer.on("data", (event, arg) => {
			vm.test = arg;
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

