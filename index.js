const TelegramBot = require('node-telegram-bot-api');
const Tesseract = require('tesseract.js');
const xlsx = require('xlsx');
const fs = require('fs');

const token = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const bot = new TelegramBot(token, { polling: true });
const excelPath = './bet365-2023-2025-datas.xlsx';

let muhurData = [];

function yukle() {
    try {
        if (fs.existsSync(excelPath)) {
            const wb = xlsx.readFile(excelPath);
            muhurData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            console.log("Excel yuklendi.");
        }
    } catch (e) { console.log("Hata: " + e.message); }
}
yukle();

bot.on('photo', async (msg) => {
    const cid = msg.chat.id;
    bot.sendMessage(cid, "Analiz basladi...");
    try {
        const file = await bot.getFileLink(msg.photo[msg.photo.length - 1].file_id);
        const { data: { text } } = await Tesseract.recognize(file, 'eng');
        const oranlar = text.match(/\d+\.\d{2}/g);
        if (!oranlar) return bot.sendMessage(cid, "Oran bulunamadi.");

        const m1 = oranlar[0];
        const m2 = oranlar[oranlar.length - 1];
        const bul = muhurData.find(m => (String(m.Open_1) === m1 && String(m.Open_2) === m2) || (String(m.Close_1) === m1 && String(m.Close_2) === m2));

        if (bul) {
            bot.sendMessage(cid, 🚨 MUHUR! 🚨\nMac: ${bul.Home}-${bul.Away}\nSonuc: ${bul.Result});
        } else {
            bot.sendMessage(cid, "Temiz.");
        }
    } catch (e) { bot.sendMessage(cid, "Hata olustu."); }
});

bot.onText(/\/start/, (m) => bot.sendMessage(m.chat.id, "Bot aktif!"));
