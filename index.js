const TelegramBot = require('node-telegram-bot-api');
const Tesseract = require('tesseract.js');

const token = '7990998595:AAEjn6vod2OkMvPvPP1r87IcwQLQwWaDDIw';
const bot = new TelegramBot(token, {polling: true});

console.log("🚀 Mühür Botu Aktif!");

bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "📸 Oranlar taranıyor...");

    try {
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        const fileUrl = await bot.getFileLink(fileId);

        const result = await Tesseract.recognize(fileUrl, 'eng');
        const readText = result.data.text;
        
        console.log("Okunan:", readText);

        if (readText.includes("2/1")  readText.includes("9.00")  readText.includes("12.0")) {
            bot.sendMessage(chatId, "✅ MÜHÜR BULUNDU! 2/1 potansiyeli yüksek.");
        } else {
            bot.sendMessage(chatId, "⚠️ Uygun oran bulunamadı.");
        }
    } catch (error) {
        bot.sendMessage(chatId, "❌ Hata oluştu.");
    }
});
