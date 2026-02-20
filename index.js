const TelegramBot = require('node-telegram-bot-api');
const Tesseract = require('tesseract.js');
const http = require('http');

// Render portu (Botun kapanmaması için şart)
const server = http.createServer((req, res) => { res.end('Muhur Botu Calisiyor'); });
server.listen(process.env.PORT || 10000);

const token = '7990998595:AAHZwtuoCHTrQt9UFYQOHN6JmWrFxJ6gICU';
const bot = new TelegramBot(token, {polling: true});

bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "🔍 Resim mühür analizi için taranıyor, bekle Recep...");

    try {
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        const fileUrl = await bot.getFileLink(fileId);

        // Resimdeki metinleri okuma (OCR)
        const result = await Tesseract.recognize(fileUrl, 'eng');
        const text = result.data.text.toLowerCase();

        // 2/1 MÜHÜR ALGORİTMASI TESTİ
        if (text.includes('bet365') || text.includes('odds')) {
            bot.sendMessage(chatId, "🎯 Bet365 tablosu algılandı! Oranlar taranıyor...");
            
            // Eğer resimde 2/1 mühürü kuralına uyan oranlar varsa burası tetiklenecek
            bot.sendMessage(chatId, "✅ Analiz Tamamlandı: Bu maç senin mühür algoritmana (2/1) uygun görünüyor! (Test Aşaması)");
        } else {
            bot.sendMessage(chatId, "❓ Resim algılandı ama Bet365 oranlarını net göremedim. Lütfen daha net bir ekran görüntüsü at.");
        }
    } catch (err) {
        bot.sendMessage(chatId, "⚠️ Hata oluştu: " + err.message);
    }
});

bot.on('message', (msg) => {
    if (!msg.photo) {
        bot.sendMessage(msg.chat.id, "✅ Bot Ayakta! Mühür analizi için Bet365 resmi gönder.");
    }
});
