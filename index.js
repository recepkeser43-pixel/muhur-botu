const TelegramBot = require('node-telegram-bot-api');
const Tesseract = require('tesseract.js');
const http = require('http');

// Render canlı tutma servisi
const server = http.createServer((req, res) => { res.end('Muhur Botu Aktif'); });
server.listen(process.env.PORT || 10000);

const token = '7990998595:AAEjn6vod2OkMvPvPP1r87IcwQLQwWaDDIw';
const bot = new TelegramBot(token, {polling: true});

bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "⚡ Tarama başladı, lütfen bekleyin...");

    try {
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        const fileUrl = await bot.getFileLink(fileId);

        // Hızlı ve güvenli tarama
        const result = await Tesseract.recognize(fileUrl, 'eng');
        const textData = result.data.text.toLowerCase();

        if (textData.length > 5) {
            bot.sendMessage(chatId, "🎯 Veriler okundu! Analiz ediliyor...");
            bot.sendMessage(chatId, "📝 Okunan Özet:\n" + textData.substring(0, 250));
            bot.sendMessage(chatId, "✅ 2/1 Mühür algoritmasına göre kontrol edebilirsiniz.");
        } else {
            bot.sendMessage(chatId, "⚠️ Resimdeki yazılar okunamadı, lütfen daha net bir görsel at.");
        }
    } catch (err) {
        bot.sendMessage(chatId, "⚠️ Tarama sırasında hata oluştu: " + err.message);
    }
});

bot.on('message', (msg) => {
    if (!msg.photo) bot.sendMessage(msg.chat.id, "⚽ Mühür Botu Hazır! Bet365 ekran görüntüsü gönder.");
});
