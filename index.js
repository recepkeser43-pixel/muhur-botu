const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// Render'ın kapanmaması için sahte bir port açıyoruz
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Bot is running\n');
});
server.listen(process.env.PORT || 10000);

const token = '7990998595:AAGRffTCr_HP8DqmAXxXrJPW3q1Pt6UtF9o';
const bot = new TelegramBot(token, {polling: true});

console.log("🚀 Mühür Botu Aktif ve Port Dinleniyor!");

bot.on('message', (msg) => {
    bot.sendMessage(msg.chat.id, "✅ Bot Ayakta! Şimdi resim gönderebilirsin.");
});
