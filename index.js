const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// Bilgileriniz
const token = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const apiKey = 'd97276aec48765ebfecd9fd261411abb';

// Botu başlatıyoruz
const bot = new TelegramBot(token, { polling: true });

// RENDER'IN İSTEDİĞİ CANLI TUTMA SİSTEMİ
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Mühür Botu Aktif!\n');
});

// BURAYI DÜZELTTİM: Render'ın portunu hatasız okur
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(Sunucu ${PORT} portunda aktif.);
});

// /start komutu
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 👋 Merhaba ${msg.from.first_name}!\n\nMühür botu hazır. /tara yazarak maçları çekebilirsin.);
});

// /tara komutu
bot.onText(/\/tara/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '⏳ Bülten taranıyor, lütfen bekleyin...');

  try {
    // Senin API anahtarına uygun doğru adres (The Odds API)
    const response = await axios.get(https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${apiKey}&regions=eu&markets=h2h);
    const fixtures = response.data;

    if (!fixtures || fixtures.length === 0) {
      bot.sendMessage(chatId, 'ℹ️ Şu anda bültende maç bulunamadı.');
      return;
    }

    let mesaj = '🎯 MÜHÜR ADAYI MAÇLAR 🎯\n\n';
    const limit = Math.min(fixtures.length, 10);
    
    for (let i = 0; i < limit; i++) {
      const match = fixtures[i];
      mesaj += ⚽ ${match.home_team} - ${match.away_team}\n;
      mesaj += 📅 Başlangıç: ${new Date(match.commence_time).toLocaleString('tr-TR')}\n;
      mesaj += ----------------------------\n\n;
    }

    bot.sendMessage(chatId, mesaj, { parse_mode: 'Markdown' });

  } catch (error) {
    bot.sendMessage(chatId, '❌ API Hatası: Anahtar limitiniz dolmuş olabilir veya yanlış API kullanılıyor.');
  }
});

console.log('Bot başarıyla başlatıldı!');
