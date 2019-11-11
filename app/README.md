This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). with support for typescript.
The react views are meant to become the renderer processes in an electron project.
Both the react and electron environment are configured to use typescript

## Available Scripts

In the project directory, you can run:

### `npm start`

Similar to create-react-app native ``npm start``

### `npm run dev`

Will compile the electron files and and run the electron environment. The react ``npm start`` is also run, which means that the ui will be rendered in a browser also by the react dev server. Moreover, electron will display the ui of the webpage made avaiable from the react server

### `npm run electronwatch`

Compiles the electron project from typescript to es5 and wait for changes beore repeating

### `npm build`

Package both react and electron in the build folder

### `npm run electron`

Run electron with the compiled react.