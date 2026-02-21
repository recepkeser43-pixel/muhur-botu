const TelegramBot = require('node-telegram-bot-api');
const Tesseract = require('tesseract.js');
const xlsx = require('xlsx');
const fs = require('fs');

const token = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg'; 
const bot = new TelegramBot(token, { polling: true });
const excelPath = './bet365-2023-2025-datas.xlsx';

let muhurListesi = [];

function muhurleriYukle() {
    try {
        if (fs.existsSync(excelPath)) {
            const workbook = xlsx.readFile(excelPath);
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            muhurListesi = data;
            console.log("✅ Hafiza hazir!");
        }
    } catch (e) {
        console.log("Excel hatasi: " + e.message);
    }
}

muhurleriYukle();

bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "🕵️‍♂️ Taramaya basladim...");
    try {
        const link = await bot.getFileLink(msg.photo[msg.photo.length - 1].file_id);
        const { data: { text } } = await Tesseract.recognize(link, 'eng');
        const oranlar = text.match(/\d+\.\d{2}/g);
        if (!oranlar) return bot.sendMessage(chatId, "⚠️ Oran okunmadi.");

        const ms1 = oranlar[0];
        const ms2 = oranlar[oranlar.length - 1];
        const sonuc = muhurListesi.find(m => (String(m.Open_1) === ms1 && String(m.Open_2) === ms2) || (String(m.Close_1) === ms1 && String(m.Close_2) === ms2));

        if (sonuc) {
            bot.sendMessage(chatId, 🚨 MUHUR! 🚨\nMac: ${sonuc.Home}-${sonuc.Away}\nSonuc: ${sonuc.Result});
        } else {
            bot.sendMessage(chatId, "✅ Temiz.");
        }
    } catch (e) {
        bot.sendMessage(chatId, "Hata!");
    }
});

bot.onText(/\/start/, (msg) => bot.sendMessage(msg.chat.id, "Mühür Radarı Aktif!"));
