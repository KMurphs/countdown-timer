const { Menu } = electron;



module.export.loadMainMenu = (menuHandlers) => {
	
	const handleAddItem = menuHandlers.addItem() || () => console.log(`Unhandled Menu Action: Add Item`)
	const handleClearItems = menuHandlers.clearItems() || () => console.log(`Unhandled Menu Action: Add Item`)
	const handleAppQuit = menuHandlers.appQuit() || () => console.log(`Unhandled Menu Action: App Quit`)
	
	
	const menuTemplate = [{
		label: 'File',
		submenu: [{
				label: 'Add Item',
				click() { handleAddItem() }
			},
			{
				label: 'Clear Items',
				click() { handleClearItems() }
			},
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click() { handleAppQuit() }
			}
		]
	}];
	
	

	//if mac, add empty object to menu to remove the electron
	//icon that sits right where the first menu item is supposed
	//to sit
	if (process.platform == 'darwin') {
		menuTemplate.unshift({}); // at the beginning
	}



	//Add developper tool item is not in prod
	if (process.env.NODE_ENV !== 'production') {
		menuTemplate.push({
			label: 'Developer Tools',
			submenu: [{
					label: 'Toggle DevTools',
					accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
					click(item, focusedWindow) { focusedWindow.toggleDevTools() }
				},
				{
					role: 'reload'
				}
			]
		})
	}



	//Build Menu from TEmplate and Insert
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}