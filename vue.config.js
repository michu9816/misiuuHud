const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
	transpileDependencies: true,
	devServer: {
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
	pluginOptions: {
		electronBuilder: {
			nodeIntegration: true,
		},
	},
	configureWebpack: {
		plugins: [new NodePolyfillPlugin()],
		resolve: {
			fallback: {
				dgram: false,
				fs: false,
				net: false,
				tls: false,
				child_process: false,
			},
		},
	},
});
