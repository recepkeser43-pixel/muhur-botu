const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// Bilgileriniz
const token = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const apiKey = 'd97276aec48765ebfecd9fd261411abb';

// Botu 'polling' (sürekli dinleme) modunda başlatıyoruz
const bot = new TelegramBot(token, { polling: true });

// RENDER İÇİN HTTP SUNUCUSU (Uygulamanın uykuya geçmesini ve Failed olmasını engeller)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Telegram Bot aktif ve calisiyor!\n');
});

// Render, çevresel değişken olarak bir PORT atar, bulamazsa 8080 kullanır
const PORT = process.env.PORT  8080;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda dinleniyor. Render onayı başarılı.`);
});

// ==========================================
// TELEGRAM KOMUTLARI
// ==========================================

// /start komutu - Karşılama mesajı
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const mesaj = `👋 Merhaba ${msg.from.first_name  'kullanıcı'}!\n\nBen canlı futbol maçları ve oranları sunan bir botum.\n\nŞu an oynanan canlı maçları görmek için /tara komutunu kullanabilirsiniz.`;
  
  bot.sendMessage(chatId, mesaj);
});

// /tara komutu - Canlı maçları API'den çeker
bot.onText(/\/tara/, async (msg) => {
  const chatId = msg.chat.id;
  
  // Kullanıcıya bilgi verelim
  bot.sendMessage(chatId, '⏳ Canlı maçlar ve skorlar getiriliyor, lütfen bekleyin...');

  try {
    // API-Football servisine istek atıyoruz
    const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
      params: {
        live: 'all' // Sadece canlı maçları getirir
      },
      headers: {
        'x-apisports-key': apiKey // API anahtarınız
      }
    });

    const fixtures = response.data.response;

    // Eğer anlık oynanan maç yoksa
    if (!fixtures || fixtures.length === 0) {
      bot.sendMessage(chatId, 'ℹ️ Şu anda oynanan canlı bir maç bulunmamaktadır.');
      return;
    }

    let mesaj = '🔴 *CANLI MAÇLAR VE SKORLAR*\n\n';
    
    // Mesajın çok uzun olup hata vermemesi için ilk 15 maçı alıyoruz
    const limit = Math.min(fixtures.length, 15);
    
    for (let i = 0; i < limit; i++) {
      const match = fixtures[i];
      const homeTeam = match.teams.home.name;
      const awayTeam = match.teams.away.name;
      const homeGoals = match.goals.home ?? 0;
      const awayGoals = match.goals.away ?? 0;
      const elapsed = match.fixture.status.elapsed; // Dakika bilgisi
      
      mesaj += ⏱️ ${elapsed}' | ${homeTeam} *${homeGoals} - ${awayGoals}* ${awayTeam}\n;
    }

    if (fixtures.length > 15) {
      mesaj += \n_...ve ${fixtures.length - 15} maç daha oynanıyor._;
    }

    // Markdown formatında gönderiyoruz ki yazılar kalın/eğik olabilsin
    bot.sendMessage(chatId, mesaj, { parse_mode: 'Markdown' });

  } catch (error) {
    console.error('API Hatası:', error.message);
    bot.sendMessage(chatId, '❌ Maçları çekerken bir hata oluştu. Lütfen API anahtarınızın doğruluğundan emin olun veya daha sonra tekrar deneyin.');
  }
});

console.log('Telegram bot başarıyla başlatıldı!');
