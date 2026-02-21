const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const API_KEY = 'd97276aec48765ebfecd9fd261411abb'; 

const bot = new TelegramBot(TOKEN, { polling: true });

// Port hatası almamak için sunucu
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Muhur Botu Calisiyor');
}).listen(process.env.PORT || 8080);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Recep, mühür botu aktif! /tara yazarak analizleri al.");
});

bot.onText(/\/tara/, async (msg) => {
  try {
    const url = https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h;
    const res = await axios.get(url);
    
    if (res.data && res.data.length > 0) {
      let mesaj = "🎯 Mühür Adayı Maçlar:\n\n";
      res.data.slice(0, 5).forEach(m => {
        mesaj += ⚽ ${m.home_team} - ${m.away_team}\n;
      });
      bot.sendMessage(msg.chat.id, mesaj);
    } else {
      bot.sendMessage(msg.chat.id, "Şu an bülten boş.");
    }
  } catch (err) {
    bot.sendMessage(msg.chat.id, "API Hatası! Lütfen anahtarını kontrol et.");
  }
});const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const API_KEY = 'd97276aec48765ebfecd9fd261411abb'; 

const bot = new TelegramBot(TOKEN, { polling: true });

// Port hatası almamak için sunucu
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Muhur Botu Calisiyor');
}).listen(process.env.PORT || 8080);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Recep, mühür botu aktif! /tara yazarak analizleri al.");
});

bot.onText(/\/tara/, async (msg) => {
  try {
    const url = https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h;
    const res = await axios.get(url);
    
    if (res.data && res.data.length > 0) {
      let mesaj = "🎯 Mühür Adayı Maçlar:\n\n";
      res.data.slice(0, 5).forEach(m => {
        mesaj += ⚽ ${m.home_team} - ${m.away_team}\n;
      });
      bot.sendMessage(msg.chat.id, mesaj);
    } else {
      bot.sendMessage(msg.chat.id, "Şu an bülten boş.");
    }
  } catch (err) {
    bot.sendMessage(msg.chat.id, "API Hatası! Lütfen anahtarını kontrol et.");
  }
});
