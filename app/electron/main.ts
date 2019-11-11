// Modules to control application life and create native browser window
import { app, BrowserWindow, Menu, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";

import MainMenu from "./menus/MainMenu";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    // mainWindow.loadFile('index.html')
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

	// Open the DevTools.
	if (process.env.NODE_ENV === 'dev'){
		mainWindow.webContents.openDevTools();
	}


    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
	
	
    //Build Menu from TEmplate
    const mainMenu = Menu.buildFromTemplate(new MainMenu({
		'addItem': (()=>console.log(`Opening Add Item Window`)),
		'clearItems': (()=>console.log(`Clearing Items`)),
		'appQuit': app.quit
	}).getTemplate());
    //Insert Menu
    Menu.setApplicationMenu(mainMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.






// Event handler for asynchronous incoming messages
ipcMain.on('asynchronous-message', (event, arg) => {
   console.log(arg)

   // Event emitter for sending asynchronous messages
   event.sender.send('asynchronous-reply', 'async pong')
})

// Event handler for synchronous incoming messages
ipcMain.on('synchronous-message', (event, arg) => {
   console.log(arg) 

   // Synchronous event emmision
   event.returnValue = 'sync pong'
})

// Event handler for asynchronous incoming messages
ipcMain.on('react-asynchronous-message', (event, arg) => {
   console.log(arg)

   // Event emitter for sending asynchronous messages
   event.sender.send('react-asynchronous-reply', 'react async pong')
})

// Event handler for synchronous incoming messages
ipcMain.on('react-synchronous-message', (event, arg) => {
   console.log(arg) 

   // Synchronous event emmision
   event.returnValue = 'react sync pong'
})
