const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const API_KEY = 'd97276aec48765ebfecd9fd261411abb';

const bot = new TelegramBot(TOKEN, { polling: true });

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Aktif');
}).listen(process.env.PORT || 8080);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Recep, mühür botu hazır! Analiz için /tara yaz.");
});

bot.onText(/\/tara/, async (msg) => {
  try {
    const response = await axios.get(https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h);
    if (response.data && response.data.length > 0) {
      let m = "🎯 Mühür Adayı Maçlar:\n\n";
      response.data.slice(0, 5).forEach(x => {
        m += ⚽ ${x.home_team} - ${x.away_team}\n;
      });
      bot.sendMessage(msg.chat.id, m);
    } else {
      bot.sendMessage(msg.chat.id, "Şu an maç yok.");
    }
  } catch (e) {
    bot.sendMessage(msg.chat.id, "API Hatası: Limit dolmuş olabilir.");
  }
});
