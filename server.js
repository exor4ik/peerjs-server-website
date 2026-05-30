const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();
// 🚨 КРИТИЧНО для Render: доверяем заголовкам прокси
app.enable('trust proxy'); 

const port = process.env.PORT || 9000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${port}`);
});

// 1. Внутри PeerServer путь указываем СТРОГО КОРЕНЬ '/'
const peerServer = ExpressPeerServer(server, {
  path: '/',             // <--- Оставляем '/'
  allow_discovery: true,
  proxied: true,         // <--- Обязательно для Render
  debug: true,
});

// 2. Монтируем в Express (это чинит HTTP-запросы на /peer/id)
app.use('/peer', peerServer);

// 3. 🧠 ГЛАВНЫЙ ХАК: Перехватываем сырые WebSocket-апгрейды
// Express их игнорирует, поэтому мы перехватываем их на уровне http.Server
server.on('upgrade', (req, socket, head) => {
  if (req.url && req.url.startsWith('/peer/')) {
    // Срезаем '/peer' из URL, чтобы PeerServer (у которого path: '/') 
    // увидел ожидаемый им '/peerjs' вместо '/peer/peerjs'
    req.url = req.url.replace(/^\/peer/, '');
  }
});

// Health check для UptimeRobot
app.get('/', (req, res) => {
  res.send('🚀 Egor PeerJS Server is running!');
});

peerServer.on('connection', (client) => {
  console.log(`✅ Peer connected: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`🔌 Peer disconnected: ${client.getId()}`);
});
