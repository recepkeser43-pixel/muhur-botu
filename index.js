const TelegramBot = require('node-telegram-bot-api');
const Tesseract = require('tesseract.js'); // Resimdeki oranları okumak için

const token = 'SENİN_BOT_TOKENIN'; 7990998595:AAEjN6vod2OKMvbvPPlr87IcwQLQwUaDDIw
const bot = new TelegramBot(token, {polling: true});

console.log("🚀 Mühür Botu: Resim Analiz Modu Aktif!");

// Bot resim gönderildiğinde çalışmaya başlar
bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "📸 Resim alındı, mühürler ve oranlar taranıyor...");

    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const fileUrl = await bot.getFileLink(fileId);

    // Resimdeki metinleri/oranları oku
    Tesseract.recognize(fileUrl, 'eng')
        .then(({ data: { text } }) => {
            console.log("Okunan Metin:", text);
            
            // Senin 2/1 Algoritman burada devreye giriyor
            if (text.includes("2/1") || text.includes("9.00")) {
                bot.sendMessage(chatId, "✅ MÜHÜR YAKALANDI! Bu maçta 2/1 potansiyeli var, pusuya yat!");
            } else {
                bot.sendMessage(chatId, "⚠️ Bu resimde mühür kriterine uyan oran bulunamadı.");
            }
        });
});
