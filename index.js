const TelegramBot = require('node-telegram-bot-api');
const Tesseract = require('tesseract.js');
const http = require('http');

// Render'ın kapanmasını önleyen sistem
const server = http.createServer((req, res) => { res.end('Muhur Botu Calisiyor'); });
server.listen(process.env.PORT || 10000);

// SENİN TOKENİN
const token = '7990998595:AAEjn6vod2OkMvPvPP1r87IcwQLQwWaDDIw';
const bot = new TelegramBot(token, {polling: true});

bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "🔍 Resim taranıyor, mühürler aranıyor bekle Recep...");

    try {
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        const fileUrl = await bot.getFileLink(fileId);

        // Resim okuma motoru çalışıyor
        const result = await Tesseract.recognize(fileUrl, 'eng');
        const text = result.data.text.toLowerCase();

        // Gelişmiş Tarama Şartı: Bet365, Odds veya 1x2 terimlerinden birini yakalarsa...
        if (text.includes('bet')  text.includes('odd')  text.includes('1x') || text.includes('2')) {
            bot.sendMessage(chatId, "🎯 Maç tablosu algılandı! Oranlar analiz ediliyor...");
            
            // Botun ne gördüğünü anlamamız için ilk 150 karakteri sana raporlasın
            bot.sendMessage(chatId, "📝 Botun Gözünden Kaçmayanlar:\n" + text.substring(0, 150));
            
            bot.sendMessage(chatId, "✅ Analiz Sonucu: Resimdeki veriler '2/1 Mühür' algoritmana göre taranmıştır. (Test Modu)");
        } else {
            bot.sendMessage(chatId, "❓ Resimdeki yazıları tam seçemedim Recep. Lütfen oranların net olduğu bir ekran görüntüsü at.");
        }
    } catch (err) {
        bot.sendMessage(chatId, "⚠️ Bir hata oluştu: " + err.message);
    }
});

bot.on('message', (msg) => {
    if (!msg.photo) {
        bot.sendMessage(msg.chat.id, "✅ Bot Aktif! Mühür analizi için Bet365 ekran görüntüsü gönder.");
    }
});
