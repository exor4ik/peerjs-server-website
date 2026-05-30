const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();
// 🚨 КРИТИЧНО для Render: доверяем прокси
app.enable('trust proxy'); 

const port = process.env.PORT || 9000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${port}`);
});

// 🎯 ГЛАВНЫЙ СЕКРЕТ: path должен быть ПОЛНЫМ путём от корня домена!
const peerServer = ExpressPeerServer(server, {
  path: '/peer/',        // <--- ОБЯЗАТЕЛЬНО со слэшем на конце!
  allow_discovery: true,
  proxied: true,         // <--- Обязательно для Render
  debug: true,
});

// Монтируем в корень, так как '/peer/' уже зашит внутрь peerServer
app.use('/', peerServer);

app.get('/', (req, res) => {
  res.send('🚀 Egor PeerJS Server is running!');
});
