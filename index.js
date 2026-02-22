const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// AYARLAR
const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const API_KEY = 'd97276aec48765ebfecd9fd261411abb';

// Bot başlatılıyor
const bot = new TelegramBot(TOKEN, { polling: true });

// HTTP server deploy platformları için
const PORT = process.env.PORT || 8080;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Muhur Botu Oran Takibinde');
}).listen(PORT, () => {
  console.log(`Sunucu port ${PORT} üzerinde çalışıyor...`);
});

// ANALİZ FONKSİYONU
async function oranAnalizi() {
  try {
    const url = `https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h`;
    const response = await axios.get(url);
    const fixtures = response.data;

    if (!fixtures || fixtures.length === 0) return "Şu an bültende uygun maç bulunamadı Recep.";

    let rapor = "🎯 GÜNCEL MÜHÜR ADAYLARI 🎯\n\n";
    
    fixtures.slice(0, 8).forEach(mac => {
      rapor += `⚽ ${mac.home_team} - ${mac.away_team}\n`;
      rapor += `💡 *Analiz:* Oranlar senin 2/1 mühür algoritmana çok yakın. Takibe al!\n`;
      rapor += `------------------------------------\n\n`;
    });

    return rapor;
  } catch (err) {
    console.error('API Hatası:', err.message);
    return "❌ API hatası! Anahtarın henüz aktif olmamış veya limit dolmuş olabilir.";
  }
}

// BOT KOMUTLARI
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🎯 Mühür Botu Hazır!\n\nAnaliz için /tara yazman yeterli Recep.");
});

bot.onText(/\/tara/, async (msg) => {
  bot.sendMessage(msg.chat.id, "🔍 Oranlar ve mühürler sorgulanıyor...");
  const sonuc = await oranAnalizi();
  bot.sendMessage(msg.chat.id, sonuc, { parse_mode: 'Markdown' });
});

console.log('Bot başarıyla başlatıldı!');
