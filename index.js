import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import xlsx from 'xlsx';
import fs from 'fs';

// --- AYARLAR ---
const TELEGRAM_TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const API_KEY = 'D97276aec48765ebfecd9fd261411abb'; // Senin API Key
const EXCEL_FILE = './bet365-2023-2025-datas.xlsx';

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Excel'i Hafızaya Al
let muhurler = [];
if (fs.existsSync(EXCEL_FILE)) {
    try {
        const wb = xlsx.readFile(EXCEL_FILE);
        muhurler = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        console.log("✅ Muhur listesi yuklendi: " + muhurler.length + " mac var.");
    } catch (e) {
        console.log("❌ Excel okuma hatasi: " + e.message);
    }
}

// Otomatik Tarama Fonksiyonu (Bet365 Upcoming Events)
async function bulteniTara(chatId) {
    bot.sendMessage(chatId, "🕵️‍♂️ API uzerinden Bet365 bulteni taraniyor, muhurler aranıyor...");
    
    try {
        const response = await axios.get(https://api.b365api.com/v1/bet365/upcoming?token=${API_KEY}&sport_id=1);
        const maclar = response.data.results;

        if (!maclar) return bot.sendMessage(chatId, "⚠️ Bülten verisi alınamadı.");

        let bulunanlar = 0;

        maclar.forEach(mac => {
            // API'den gelen oranları yakalayalım (Açılış oranları)
            const open_1 = mac.main_odds?.['1_1']?.h_odds; // Ev sahibi
            const open_2 = mac.main_odds?.['1_1']?.a_odds; // Deplasman

            // Excel'deki mühürlerle (Open_1 ve Open_2) kıyasla
            const bul = muhurler.find(m => 
                (String(m.Open_1) === String(open_1) && String(m.Open_2) === String(open_2))
            );

            if (bul) {
                bulunanlar++;
                bot.sendMessage(chatId, 🚨 **MÜHÜR YAKALANDI!** 🚨\n\n⚽ Maç: ${mac.home.name} - ${mac.away.name}\n📊 Oranlar: ${open_1} - ${open_2}\n📅 Tarih: ${new Date(mac.time * 1000).toLocaleString('tr-TR')}\n\n💡 **Tarihsel Mühür Sonucu: ${bul.Result}**);
            }
        });

        if (bulunanlar === 0) {
            bot.sendMessage(chatId, "✅ Su an bultende mühürlü maç bulunamadı.");
        }

    } catch (error) {
        bot.sendMessage(chatId, "❌ API Hatası: " + error.message);
    }
}

// Komutlar
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🚀 Muhur Radarı Aktif!\n\n/tara - Yazarak bülteni otomatik taratabilirsin.");
});

bot.onText(/\/tara/, (msg) => {
    bulteniTara(msg.chat.id);
});
