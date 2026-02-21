const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const bot = new TelegramBot(TOKEN, { polling: true });

// Render'ın beklediği port kapısı
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Aktif');
}).listen(process.env.PORT || 8080);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "✅ SONUNDA OLDU! Sistem bu sefer sağlam kuruldu Recep.");
});

console.log("Bot eski tip bağlantı ile başlatıldı...");
