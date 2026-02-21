import TelegramBot from 'node-telegram-bot-api';
import xlsx from 'xlsx';
import fs from 'fs';
import http from 'http';

const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const bot = new TelegramBot(TOKEN, { polling: true });

// Render Hata Engelleyici (Port Dinleyici)
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Aktif');
});
server.listen(process.env.PORT || 8080);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "✅ Sistem Sıfırlandı! Şimdi adım adım ilerleyebiliriz.");
});

console.log("Bot calismaya hazir...");
