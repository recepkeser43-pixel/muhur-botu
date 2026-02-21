const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const API_KEY = 'd97276aec48765ebfecd9fd261411abb'; 

const bot = new TelegramBot(TOKEN, { polling: true });

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Calisiyor');
}).listen(process.env.PORT || 8080);

bot.onText(/\/tara/, async (msg) => {
  try {
    const url = https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h;
    const response = await axios.get(url);
    
    if (response.data && response.data.length > 0) {
      let mesaj = "🎯 Mühür Adayları:\n\n";
      response.data.slice(0, 5).forEach(m => {
        mesaj += ⚽ ${m.home_team} - ${m.away_team}\n;
      });
      bot.sendMessage(msg.chat.id, mesaj);
    } else {
      bot.sendMessage(msg.chat.id, "Şu an maç bulunamadı.");
    }
  } catch (err) {
    bot.sendMessage(msg.chat.id, "Bağlantı hatası! Lütfen biraz sonra tekrar dene.");
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Bot hazır Recep! /tara yazarak analizleri alabilirsin.");
});
