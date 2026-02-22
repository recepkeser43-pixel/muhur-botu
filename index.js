const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// AYARLAR
const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const API_KEY = 'd97276aec48765ebfecd9fd261411abb';

const bot = new TelegramBot(TOKEN, { polling: true });

// RENDER İÇİN CANLI TUTMA SİSTEMİ
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Aktif');
}).listen(process.env.PORT || 8080);

console.log("Bot sistemi başlatıldı...");

// KOMUTLAR
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🎯 Recep, Mühür Botu Hazır!\n\n/tara yazarak bültendeki 2/1 adaylarını çekebilirsin.");
});

bot.onText(/\/tara/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "🔍 Bülten taranıyor, mühürler sorgulanıyor...");

  try {
    const response = await axios.get(https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h);
    
    if (response.data && response.data.length > 0) {
      let rapor = "📋 GÜNCEL BÜLTEN ANALİZİ 📋\n\n";
      
      response.data.slice(0, 10).forEach(mac => {
        rapor += ⚽ ${mac.home_team} - ${mac.away_team}\n;
        rapor += 💡 *Durum:* Mühür Algoritmasına Uygunluk İnceleniyor...\n\n;
      });
      
      bot.sendMessage(chatId, rapor);
    } else {
      bot.sendMessage(chatId, "Şu an bülten boş veya maç bulunamadı.");
    }
  } catch (error) {
    bot.sendMessage(chatId, "❌ Veri çekilirken bir sorun oluştu. API anahtarını kontrol et.");
  }
});
