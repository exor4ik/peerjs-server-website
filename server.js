const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();
const port = process.env.PORT || 9000;

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${port}`);
});

const peerServer = ExpressPeerServer(server, {
  path: '/',
  allow_discovery: true,
  proxied: true,
});

app.use('/peerjs', peerServer);

// Health check для Render
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'egor-peerjs' });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

peerServer.on('connection', (client) => {
  console.log(`✅ Peer connected: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`🔌 Peer disconnected: ${client.getId()}`);
});
