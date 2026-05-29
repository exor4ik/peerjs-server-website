const { PeerServer } = require('peer');

const port = process.env.PORT || 9000;

const server = PeerServer({
  port: port,
  path: '/peerjs',      // ← Указываем путь прямо здесь
  allow_discovery: true,
  proxied: true,        // ← Критично для Render (WebSocket за прокси)
}, () => {
  console.log(`🚀 PeerServer running on port ${port}`);
});
