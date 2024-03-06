
const ws = new WebSocket('wss://localhost:443');

ws.addEventListener('error', (err) => console.log(err));

ws.addEventListener('open', (data) => {
	console.log('Socket open: ', data)
	ws.send('Connection from client');
});

ws.addEventListener('message', function message(data) {
	console.log('Received message: ', data);
})