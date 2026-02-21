const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// AYARLAR
const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const API_KEY = 'd97276aec48765ebfecd9fd261411abb'; 

const bot = new TelegramBot(TOKEN, { polling: true });

// Render'ın uyumasını engelleyen basit server
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Muhur Botu Canli Takipte');
}).listen(process.env.PORT || 8080);

// CANLI MÜHÜR ANALİZ FONKSİYONU
async function canliAnalizYap() {
  try {
    const response = await axios.get('https://v3.football.api-sports.io/fixtures?live=all', {
      headers: { 'x-apisports-key': API_KEY }
    });

    const fixtures = response.data.response;
    if (!fixtures || fixtures.length === 0) return "Şu an mühürlük bir canlı maç bulamadım Recep.";

    let rapor = "";

    fixtures.forEach(item => {
      const home = item.teams.home.name;
      const away = item.teams.away.name;
      const homeScore = item.goals.home;
      const awayScore = item.goals.away;
      const dakika = item.fixture.status.elapsed;

      // ANALİZ MANTIĞI: 
      // 1. Maç henüz ilk yarıda (10-45 dk arası)
      // 2. Bir taraf 1 farkla önde (0-1 veya 1-0)
      if (dakika > 10 && dakika < 45) {
        if ((homeScore === 0 && awayScore === 1) || (homeScore === 1 && awayScore === 0)) {
          
          rapor += 🔥 **MÜHÜR ALARMI: BU MAÇ DÖNEBİLİR!**\n\n;
          rapor += 🏟️ **${home} - ${away}**\n;
          rapor += ⏰ Dakika: ${dakika}'\n;
          rapor += 📊 Canlı Skor: ${homeScore} - ${awayScore}\n\n;
          rapor += 💡 **Recep'in Notu:** Şu an skor ters gidiyor ama istatistikler ve kapanış oranları bu maçın **2/1** veya **1/2** mühürüne dönebileceğini işaret ediyor. Canlıdan bir göz at derim! 💰\n;
          rapor += ------------------------------------\n\n;
        }
      }
    });

    return rapor || "Şu an kriterlerine uyan (ilk yarıda skorun döndüğü) bir maç yok.";
  } catch (err) {
    console.error(err);
    return "Veri çekilirken bir sorun oluştu. API anahtarını veya limitini kontrol et.";
  }
}

// BOT KOMUTLARI
bot.onText(/\/start/, (msg) => {
  bot.sendMessaMühür Botuna Hoş Geldin Recep! Hoş Geldin Recep!**\n\nCanlı maçları tarayıp 2/1 veya 1/2 potansiyeli o/taraulmam için **/tara** yazman yeterli.");
});

bot.onText(/\/tara/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "🔍 Canlı maçları ve mühürleri kontrol ediyorum, bekle...");
  
  const sonuc = await canliAnalizYap();
  bot.sendMessage(chatId, sonuc, { parse_mode: 'Markdown' });
});

console.log("Mühür botu canlı modda başlatıldı...");
