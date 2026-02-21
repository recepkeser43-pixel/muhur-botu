import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import xlsx from 'xlsx';
import fs from 'fs';

// --- AYARLARIN ---
const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const B365_TOKEN = 'D97276aec48765ebfecd9fd261411abb';
const EXCEL_FILE = './bet365-2023-2025-datas.xlsx';

const bot = new TelegramBot(TOKEN, { polling: true });

// 1. Excel Verilerini Yükle
let muhurler = [];
if (fs.existsSync(EXCEL_FILE)) {
    try {
        const wb = xlsx.readFile(EXCEL_FILE);
        muhurler = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        console.log(✅ Excel Hazır: ${muhurler.length} mühür yüklendi.);
    } catch (e) {
        console.log("❌ Excel Okuma Hatası: " + e.message);
    }
}

// 2. Tarama Fonksiyonu
async function bulteniTara(chatId) {
    bot.sendMessage(chatId, "🕵️‍♂️ Mühür Radarı Bet365 bültenini tarıyor...");
    try {
        // BetsAPI'den gelecek maçları çekiyoruz
        const url = https://api.b365api.com/v1/bet365/upcoming?token=${B365_TOKEN}&sport_id=1;
        const res = await axios.get(url);
        const maclar = res.data.results || [];

        if (maclar.length === 0) return bot.sendMessage(chatId, "⚠️ Bülten şu an boş.");

        let bulunanlar = 0;

        maclar.forEach(mac => {
            // API'den açılış oranlarını çekelim
            const o1 = mac.main_odds?.['1_1']?.h_odds;
            const o2 = mac.main_odds?.['1_1']?.a_odds;

            // Excel'deki mühürlerle kıyasla
            const eslesme = muhurler.find(m => 
                String(m.Open_1) === String(o1) && String(m.Open_2) === String(o2)
            );

            if (eslesme) {
                bulunanlar++;
                bot.sendMessage(chatId, 🚨 **MÜHÜR BULUNDU!** 🚨\n\n⚽ Maç: ${mac.home.name} - ${mac.away.name}\n📊 Oranlar: ${o1} - ${o2}\n💡 Tahmin: ${eslesme.Result});
            }
        });

        if (bulunanlar === 0) {
            bot.sendMessage(chatId, "✅ Şimdilik bültende mühürlü maç yok.");
        }
    } catch (err) {
        bot.sendMessage(chatId, "❌ Hata: Veri çekilemedi. API anahtarınızı veya bağlantınızı kontrol edin.");
    }
}

// 3. Komutlar
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🚀 Radar Aktif! /tara yazarak bültene bakabilirsin.");
});

bot.onText(/\/tara/, (msg) => {
    bulteniTara(msg.chat.id);
});

console.log("🤖 Bot ayağa kalktı...");
