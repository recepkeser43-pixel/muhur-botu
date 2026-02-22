const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// ------------------ SABİT AYARLAR ------------------
const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';  // Telegram bot token
const bot = new TelegramBot(TOKEN, { polling: true });
const API_KEY = 'd97276aec48765ebfecd9fd261411abb'; // The-Odds-API key

// ------------------ HTTP SERVER ------------------
const PORT = process.env.PORT || 8080;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Mühür Botu Aktif!\n');
}).listen(PORT, () => {
  console.log(`Sunucu port ${PORT} üzerinde çalışıyor...`);
});

// ------------------ ANALİZ / MAÇ ÇEKME FONKSİYONU ------------------
async function cekMaclar(limit = 8) {
  try {
    const url = `https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h`;
    const response = await axios.get(url);
    const fixtures = response.data;

    if (!fixtures || fixtures.length === 0) return "ℹ️ Şu an uygun maç bulunamadı.";

    let rapor = "🎯 GÜNCEL MÜHÜR ADAYLARI 🎯\n\n";
    fixtures.slice(0, limit).forEach(mac => {
      rapor += `⚽ ${mac.home_team} - ${mac.away_team}\n`;
      rapor += `📅 Başlangıç: ${new Date(mac.commence_time).toLocaleString('tr-TR')}\n`;
      rapor += `💡 Analiz: Oranlar senin 2/1 mühür algoritmana yakın.\n`;
      rapor += `----------------------------\n\n`;
    });

    return rapor;
  } catch (err) {
    console.error('API Hatası:', err.message);
    return "❌ API hatası! Anahtar geçersiz veya limit dolmuş olabilir.";
  }
}

// ------------------ BOT KOMUTLARI ------------------

// /start komutu
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "👋 Recep, sistem temizlendi. Canlı maç yüklemesine hazır mısın?");
});

// /tara komutu
bot.onText(/\/tara/, async (msg) => {
  bot.sendMessage(msg.chat.id, "⏳ Bülten taranıyor, lütfen bekleyin...");
  const sonuc = await cekMaclar();
  bot.sendMessage(msg.chat.id, sonuc, { parse_mode: 'Markdown' });
});

console.log('Bot başarıyla başlatıldı!');
