const TelegramBot = require('node-telegram-bot-api');
const Tesseract = require('tesseract.js');
const xlsx = require('xlsx');
const fs = require('fs');

const token = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const bot = new TelegramBot(token, { polling: true });
const excelPath = './bet365-2023-2025-datas.xlsx';

let data = [];
if (fs.existsSync(excelPath)) {
    const wb = xlsx.readFile(excelPath);
    data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
}

bot.on('photo', async (msg) => {
    const cid = msg.chat.id;
    bot.sendMessage(cid, "Analiz ediliyor...");
    try {
        const link = await bot.getFileLink(msg.photo[msg.photo.length - 1].file_id);
        const { data: { text } } = await Tesseract.recognize(link, 'eng');
        const matches = text.match(/\d+\.\d{2}/g);
        if (!matches || matches.length < 2) return bot.sendMessage(cid, "Oran bulunamadi.");

        const m1 = matches[0];
        const m2 = matches[matches.length - 1];
        const res = data.find(m => (String(m.Open_1) === m1 && String(m.Open_2) === m2) || (String(m.Close_1) === m1 && String(m.Close_2) === m2));

        if (res) {
            bot.sendMessage(cid, 🚨 MUHUR! 🚨\n${res.Home} - ${res.Away}\nSonuc: ${res.Result});
        } else {
            bot.sendMessage(cid, "Temiz.");
        }
    } catch (e) { bot.sendMessage(cid, "Hata!"); }
});

bot.onText(/\/start/, (m) => bot.sendMessage(m.chat.id, "Bot aktif!"));
