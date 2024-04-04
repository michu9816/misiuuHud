"use strict";

import { app, protocol, BrowserWindow, ipcMain, clipboard, Tray } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path')

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
	{ scheme: "app", privileges: { secure: true, standard: true } },
]);

const appExpress = express();

let tray = undefined;
let winSettings = undefined;
async function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			// Use pluginOptions.nodeIntegration, leave this alone
			// See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
			nodeIntegration: true,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
		},
		transparent: true,
		frame: false,
	});

	win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
	win.setAlwaysOnTop(true, "screen-saver", 1);
	if (!isDevelopment) {
		win.setIgnoreMouseEvents(true);
		win.setFullScreen(true);
	}
	// win.setFocusable(false);
	win.moveTop();

	createTray();

	winSettings = new BrowserWindow({
        width: 500,
        height: 600,
        show: false,
        frame: true,
        fullscreenable: false,
        resizable: false,
        transparent: false,
        webPreferences: {
			// Use pluginOptions.nodeIntegration, leave this alone
			// See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
			nodeIntegration: true,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
		},
	});

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await winSettings.loadURL(process.env.WEBPACK_DEV_SERVER_URL+"/settings");
	} else {
		createProtocol("app");

		// Load the index.html when not in development
		winSettings.loadURL("app://./index.html");

		// Define your routes here
	}

	winSettings.on('blur', () => {
		if (!winSettings.webContents.isDevToolsOpened()) {
			// winSettings.hide()
		}
	  })

	appExpress.get("/api/data", (req, res) => {
		res.json({ message: "Hello from Express!" });
	});

	appExpress.use(bodyParser.urlencoded({ extended: true }));
	appExpress.use(bodyParser.json());
	appExpress.post("/api/data", (req, res) => {
		res.json({ message: "Ok!" });
		win.webContents.send("data", req.body);
	});

	appExpress.listen(3000, () => {
		console.log("Server started on port 3000");
	});

	ipcMain.on("data", (event, arg) => {
		console.log(arg);
	});

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "/settings");
		if (!process.env.IS_TEST) win.webContents.openDevTools();
	} else {
		createProtocol("app");

		// Load the index.html when not in development
		win.loadURL("app://./index.html");

		// Define your routes here
	}
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		try {
			await installExtension(VUEJS3_DEVTOOLS);
		} catch (e) {
			console.error("Vue Devtools failed to install:", e.toString());
		}
	}
	createWindow();
	clipboard.writeText('cl_draw_only_deathnotices true;cl_drawhud_force_radar 1;cl_drawhud_force_teamid_overhead 1')
});

const createTray = () => {
	// tray = new Tray('./icon.png')
	const trayIcnPath = process.env.WEBPACK_DEV_SERVER_URL
    ? path.join(__dirname, `../public/icon.png`)
    : path.join(__dirname, `../app.asar/icon.png`);

	tray = new Tray(trayIcnPath)
	tray.on('click', function (event) {
	  toggleWindow()
	})
  }
  
	const getWindowPosition = () => {
	const windowBounds = winSettings.getBounds()
	const trayBounds = tray.getBounds()
  
	// Center window horizontally below the tray icon
	const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
  
	// Position window 4 pixels vertically below the tray icon
	const y = Math.round(trayBounds.y + trayBounds.height + 3)
  
	return {x: x, y: y}
  }


const toggleWindow = () => {
	if (winSettings.isVisible()) {
		winSettings.hide()
	} else {
	  showWindow()
	}
  }
  
  const showWindow = () => {
	const position = getWindowPosition()
	winSettings.setPosition(position.x, position.y, false)
	winSettings.show()
	winSettings.focus()
  }
  
  ipcMain.on('show-window', () => {
	showWindow()
  })
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === "win32") {
		process.on("message", (data) => {
			if (data === "graceful-exit") {
				app.quit();
			}
		});
	} else {
		process.on("SIGTERM", () => {
			app.quit();
		});
	}
}
