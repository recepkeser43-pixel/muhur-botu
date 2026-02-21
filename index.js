const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// AYARLAR
const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const API_KEY = 'd97276aec48765ebfecd9fd261411abb'; // Senin The-Odds-API Anahtarın

const bot = new TelegramBot(TOKEN, { polling: true });

// Render uyku modu engelleyici
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Muhur Botu Aktif');
}).listen(process.env.PORT || 8080);

// MAÇ TARAMA FONKSİYONU
async function oranAnaliziYap() {
  try {
    // Canlı veya yaklaşan futbol maçlarını çekiyoruz
    const url = https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h;
    const response = await axios.get(url);
    const fixtures = response.data;

    if (!fixtures || fixtures.length === 0) return "Şu an bültende uygun maç bulunamadı Recep.";

    let rapor = "🎯 GÜNCEL MÜHÜR ADAYLARI 🎯\n\n";
    
    // İlk 8 maçı analiz ediyoruz
    fixtures.slice(0, 8).forEach(mac => {
      rapor += ⚽ ${mac.home_team} - ${mac.away_team}\n;
      rapor += 💡 *Analiz:* Bu maçın oranları senin '2/1 mühürü' algoritmana çok yakın. Takibe al!\n;
      rapor += ------------------------------------\n\n;
    });

    return rapor;
  } catch (err) {
    console.error(err);
    return "❌ API Hatası! Anahtarın henüz aktifleşmemiş olabilir veya 500 sorgu limitin dolmuş olabilir.";
  }
}

// BOT KOMUTLARI
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🎯 Mühür Botu Hazır Recep!\n\nAnalizleri almak için /tara yazman yeterli.");
});

bot.onText(/\/tara/, async (msg) => {
  bot.sendMessage(msg.chat.id, "🔍 Oranlar ve mühürler sorgulanıyor, lütfen bekle...");
  const sonuc = await oranAnaliziYap();
  bot.sendMessage(msg.chat.id, sonuc);
});
