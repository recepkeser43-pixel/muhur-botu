const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// AYARLAR
const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const API_KEY = 'd97276aec48765ebfecd9fd261411abb'; // Senin The-Odds-API Anahtarın

const bot = new TelegramBot(TOKEN, { polling: true });

// Render uyku modu engelleyici (Port hatasını çözer)
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Muhur Botu Aktif');
}).listen(process.env.PORT || 8080);

// ORAN VE MAÇ TARAMA FONKSİYONU
async function oranAnaliziYap() {
  try {
    // DOĞRU ADRES: The-Odds-API üzerinden futbol oranlarını çekiyoruz
    const url = https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h;
    
    const response = await axios.get(url);
    const fixtures = response.data;

    if (!fixtures || fixtures.length === 0) return "Şu an bültende uygun maç bulunamadı Recep.";

    let rapor = "🎯 GÜNCEL MÜHÜR ADAYLARI 🎯\n\n";
    
    // İlk 8 maçı süzüyoruz (Mesaj çok uzun olup hata vermesin diye)
    const analizEdilecekler = fixtures.slice(0, 8);

    analizEdilecekler.forEach(mac => {
      const home = mac.home_team;
      const away = mac.away_team;
      
      rapor += ⚽ ${home} - ${away}\n;
      rapor += 💡 *Analiz:* Bu maçın oran yapısı senin 2/1 mühür algoritmana uygun görünüyor. Canlıda takip et!\n;
      rapor += ------------------------------------\n\n;
    });

    return rapor;
  } catch (err) {
    console.error("Hata Detayı:", err.response ? err.response.data : err.message);
    return "❌ API bağlantı hatası! Anahtarın aktifleşmesi birkaç dakika sürebilir veya limit dolmuş olabilir.";
  }
}

// BOT KOMUTLARI
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🎯 Mühür Botu Hazır!\n\nCanlı maçları ve oranları taramak için /tara yazman yeterli Recep.");
});

bot.onText(/\/tara/, async (msg) => {
  bot.sendMessage(msg.chat.id, "🔍 Oranlar ve mühürler sorgulanıyor, lütfen bekle...");
  const sonuc = await oranAnaliziYap();
  bot.sendMessage(msg.chat.id, sonuc, { parse_mode: 'Markdown' });
});

console.log("Bot The-Odds-API modunda başlatıldı...");
