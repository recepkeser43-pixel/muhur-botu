import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import xlsx from 'xlsx';
import fs from 'fs';

// --- AYARLARIN ---
const TOKEN = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const B365_API_TOKEN = 'D97276aec48765ebfecd9fd261411abb';
const EXCEL_PATH = './bet365-2023-2025-datas.xlsx';

const bot = new TelegramBot(TOKEN, { polling: true });

// 1. Excel Verilerini Hafızaya Alalım
let muhurData = [];
function excelYukle() {
    try {
        if (fs.existsSync(EXCEL_PATH)) {
            const workbook = xlsx.readFile(EXCEL_PATH);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            muhurData = xlsx.utils.sheet_to_json(sheet);
            console.log(✅ Excel Hazır! ${muhurData.length} mühür yüklendi.);
        } else {
            console.log("❌ Hata: Excel dosyası bulunamadı!");
        }
    } catch (err) {
        console.log("❌ Excel Okuma Hatası: " + err.message);
    }
}
excelYukle();

// 2. Mühür Tarama Fonksiyonu
async function bulteniTara(chatId) {
    bot.sendMessage(chatId, "🕵️‍♂️ Mühür Radarı bülteni tarıyor, lütfen bekleyin...");
    
    try {
        // BetsAPI Bet365 Upcoming Maçlar
        const url = https://api.b365api.com/v1/bet365/upcoming?token=${B365_API_TOKEN}&sport_id=1;
        const response = await axios.get(url);
        const maclar = response.data.results;

        if (!maclar || maclar.length === 0) {
            return bot.sendMessage(chatId, "⚠️ Şu an API'den canlı bülten verisi gelmiyor.");
        }

        let bulunanSayisi = 0;

        maclar.forEach(mac => {
            // Maçın açılış oranlarını çekiyoruz
            const o1 = mac.main_odds?.['1_1']?.h_odds; // Ev Sahibi Açılış
            const o2 = mac.main_odds?.['1_1']?.a_odds; // Deplasman Açılış

            if (o1 && o2) {
                // Excel'deki mühürlerle kıyasla
                const eslesme = muhurData.find(m => 
                    String(m.Open_1) === String(o1) && String(m.Open_2) === String(o2)
                );

                if (eslesme) {
                    bulunanSayisi++;
                    bot.sendMessage(chatId, 
                        🚨 **MÜHÜR YAKALANDI!** 🚨\n\n +
                        ⚽ Maç: ${mac.home.name} - ${mac.away.name}\n +
                        📊 Oranlar: ${o1} - ${o2}\n +
                        📅 Başlama: ${new Date(mac.time * 1000).toLocaleString('tr-TR')}\n +
                        💡 **Geçmiş Sonuç: ${eslesme.Result}**
                    );
                }
            }
        });

        if (bulunanSayisi === 0) {
            bot.sendMessage(chatId, "✅ Analiz bitti. Şu anki bültende mühürlü maç bulunamadı.");
        } else {
            bot.sendMessage(chatId, 🎉 Toplam ${bulunanSayisi} adet mühürlü maç listelendi!);
        }

    } catch (error) {
        bot.sendMessage(chatId, "❌ API Hatası: " + error.message);
    }
}

// 3. Bot Komutları
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🚀 Mühür Radarı Aktif!\n\n/tara yazarak Bet365 bültenindeki mühürlü maçları görebilirsin.");
});

bot.onText(/\/tara/, (msg) => {
    bulteniTara(msg.chat.id);
});

console.log("🤖 Mühür Botu Çalışmaya Başladı...");

