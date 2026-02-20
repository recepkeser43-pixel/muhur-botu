const TelegramBot = require('node-telegram-bot-api');
const token = '7990998595:AAEjn6vod2OkMvPvPP1r87IcwQLQwWaDDIw';
const bot = new TelegramBot(token, {polling: true})

console.log("🚀 Muhur Botu Aktif!");

bot.on('message', (msg) => {
    bot.sendMessage(msg.chat.id, "✅ Muhur Botu Ayakta! Resim gonder bakalim.");
});
