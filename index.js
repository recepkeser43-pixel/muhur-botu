const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const bot = new TelegramBot(TOKEN, { polling: true });

// Render'ı mutlu etmek için port
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Ayakta');
}).listen(process.env.PORT || 8080);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Recep, sistem temizlendi. Canlı maç yüklemesine hazır mısın?");
});
