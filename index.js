const TelegramBot = require('node-telegram-bot-api');
const Tesseract = require('tesseract.js');
const http = require('http');

const server = http.createServer((req, res) => { res.end('Muhur Botu Aktif'); });
server.listen(process.env.PORT || 10000);

const token = '7990998595:AAEjn6vod2OkMvPvPP1r87IcwQLQwWaDDIw';
const bot = new TelegramBot(token, {polling: true});

bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "⚡ Mühürler taranıyor, az sabret Recep...");

    try {
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        const fileUrl = await bot.getFileLink(fileId);
        const result = await Tesseract.recognize(fileUrl, 'eng');
        const textData = result.data.text.toLowerCase();

        if (textData.length > 2) {
            bot.sendMessage(chatId, "🎯 Veriler okundu! Analiz sonucu:\n\n" + textData.substring(0, 300));
            bot.sendMessage(chatId, "✅ 2/1 Mühür kuralını bu verilere göre kontrol edebilirsin.");
        } else {
            bot.sendMessage(chatId, "⚠️ Yazıları seçemedim, daha net bir resim atar mısın?");
        }
    } catch (err) {
        bot.sendMessage(chatId, "⚠️ Tarama hatası: " + err.message);
    }
});

bot.on('message', (msg) => {
    if (!msg.photo) bot.sendMessage(msg.chat.id, "⚽ Mühür Botu Hazır! Bet365 resmi gönder.");
});
