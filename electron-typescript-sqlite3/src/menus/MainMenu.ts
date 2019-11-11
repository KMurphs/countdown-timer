

interface MainMenu {
  // members of your "class" go here.
  menuTemplate: Array<any>,
  getTemplate: ()=>Array<any>
}


const MainMenu = function(this: MainMenu, menuHandlers: any){
	
	console.log(`Initializing Main Menu`)
	
	const handleAddItem = menuHandlers.addItem || (() => console.log(`Unhandled Menu Action: Add Item`))
	const handleClearItems = menuHandlers.clearItems || (() => console.log(`Unhandled Menu Action: Add Item`))
	const handleAppQuit = menuHandlers.appQuit || (() => console.log(`Unhandled Menu Action: App Quit`))


	this.menuTemplate = [{
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
		this.menuTemplate.unshift({}); // at the beginning
	}
	
	
	
	//Add developper tool item is not in prod
	if (process.env.NODE_ENV === 'dev') {
		this.menuTemplate.push({
			label: 'Developer Tools',
			submenu: [{
					label: 'Toggle DevTools',
					accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
					click(item: any, focusedWindow: any) { focusedWindow.toggleDevTools() }
				},
				{
					role: 'reload'
				}
			]
		})
	}
	
} as any as { new (menuHandlers: any): MainMenu; };




MainMenu.prototype.getTemplate = function(this: MainMenu){
	return this.menuTemplate
}

export default MainMenu;