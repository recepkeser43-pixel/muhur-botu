const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// Bilgileriniz
const token = 'BOT_TOKENİNİ_GİZLE';
const apiKey = 'API_KEYİNİ_GİZLE';

// Botu başlatıyoruz
const bot = new TelegramBot(token, { polling: true });

// Render canlı tutma
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Mühür Botu Aktif!\n');
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(Sunucu ${PORT} portunda aktif.);
});

// /start komutu
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    👋 Merhaba ${msg.from.first_name}!\n\nMühür botu hazır. /tara yazarak maçları çekebilirsin.
  );
});

// /tara komutu
bot.onText(/\/tara/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '⏳ Bülten taranıyor, lütfen bekleyin...');

  try {
    const response = await axios.get(
      https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${apiKey}&regions=eu&markets=h2h
    );

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

    bot.sendMessage(chatId, mesaj);

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, '❌ API Hatası: Anahtar limitiniz dolmuş olabilir veya yanlış API kullanılıyor.');
  }
});

console.log('Bot başarıyla başlatıldı!');
