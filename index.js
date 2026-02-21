import TelegramBot from 'node-telegram-bot-api';
import http from 'http';

const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const bot = new TelegramBot(TOKEN, { polling: true });

// Render'ı kandırmak için kapı açıyoruz
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Aktif');
}).listen(process.env.PORT || 8080);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "✅ SONUNDA! Sistem çalışıyor Recep. Şimdi mühürleri ekleyebiliriz.");
});

console.log("Bot başlatıldı...");
