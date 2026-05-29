const { PeerServer } = require('peer');

const port = parseInt(process.env.PORT) || 9000;

const peerServer = PeerServer({
  port,
  path: '/',
  proxied: true,
});

peerServer.on('connection', (client) => {
  console.log(`✅ Peer connected: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`🔌 Peer disconnected: ${client.getId()}`);
});

console.log(`🚀 PeerJS Server running on port ${port}`);
