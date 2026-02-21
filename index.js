import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import xlsx from 'xlsx';
import fs from 'fs';

// --- AYARLAR ---
const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const B365_TOKEN = 'D97276aec48765ebfecd9fd261411abb';
const EXCEL_FILE = './bet365-2023-2025-datas.xlsx';

const bot = new TelegramBot(TOKEN, { polling: true });

// Excel Verilerini Yükle
let data = [];
if (fs.existsSync(EXCEL_FILE)) {
    const wb = xlsx.readFile(EXCEL_FILE);
    data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
}

// Tarama Motoru
async function tara(cid) {
    bot.sendMessage(cid, "🕵️‍♂️ Bülten taranıyor...");
    try {
        const url = https://api.b365api.com/v1/bet365/upcoming?token=${B365_TOKEN}&sport_id=1;
        const res = await axios.get(url);
        const games = res.data.results || [];
        let count = 0;

        games.forEach(g => {
            const o1 = g.main_odds?.['1_1']?.h_odds;
            const o2 = g.main_odds?.['1_1']?.a_odds;

            const found = data.find(m => String(m.Open_1) === String(o1) && String(m.Open_2) === String(o2));
            if (found) {
                count++;
                bot.sendMessage(cid, 🚨 MÜHÜR!\n⚽ ${g.home.name}-${g.away.name}\n📊 Oranlar: ${o1}-${o2}\n💡 Tahmin: ${found.Result});
            }
        });

        if (count === 0) bot.sendMessage(cid, "✅ Eşleşen mühür yok.");
    } catch (e) {
        bot.sendMessage(cid, "❌ Bağlantı hatası.");
    }
}

bot.onText(/\/start/, (m) => bot.sendMessage(m.chat.id, "Bot aktif! /tara yazın."));
bot.onText(/\/tara/, (m) => tara(m.chat.id));
