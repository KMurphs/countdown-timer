import * as net from "net";


let port: number = 3000
if(process.env.PORT){
	port = parseInt(process.env.PORT) - 100
}

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client: any = new net.Socket();

let startedElectron: boolean = false;
const tryConnection = () => client.connect({ port: port }, () => {
    client.end();
    if (!startedElectron) {
        console.log('starting electron');
        startedElectron = true;
        const exec = require('child_process').exec;
        const electron = exec('npm run electron');
        electron.stdout.on("data", function(data: any) {
            console.log("stdout: " + data.toString());
        });
    }
});

tryConnection();

client.on('error', (error: Error) => {
    setTimeout(tryConnection, 1000);
});