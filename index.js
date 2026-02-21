import TelegramBot from 'node-telegram-bot-api';

// Ayarlar
const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const bot = new TelegramBot(TOKEN, { polling: true });

// Basit Komut
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "✅ ADIM 1 TAMAM: Bot aktif ve seni duyuyor! Şimdi 2. adıma geçebiliriz.");
});

console.log("🤖 Sistem Başlatıldı...");
