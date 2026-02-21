import TelegramBot from 'node-telegram-bot-api';
import Tesseract from 'tesseract.js';
import xlsx from 'xlsx';
import fs from 'fs';

const token = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const bot = new TelegramBot(token, { polling: true });
const excelPath = './bet365-2023-2025-datas.xlsx';

let mData = [];
if (fs.existsSync(excelPath)) {
    const wb = xlsx.readFile(excelPath);
    mData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    console.log("Excel hazir.");
}

bot.on('photo', async (msg) => {
    const cid = msg.chat.id;
    bot.sendMessage(cid, "Muhur taraniyor...");
    try {
        const link = await bot.getFileLink(msg.photo[msg.photo.length - 1].file_id);
        const { data: { text } } = await Tesseract.recognize(link, 'eng');
        const ors = text.match(/\d+\.\d{2}/g);
        if (!ors || ors.length < 2) return bot.sendMessage(cid, "Oran yok.");

        const m1 = ors[0];
        const m2 = ors[ors.length - 1];
        const res = mData.find(m => (String(m.Open_1) === m1 && String(m.Open_2) === m2) || (String(m.Close_1) === m1 && String(m.Close_2) === m2));

        if (res) {
            bot.sendMessage(cid, 🚨 MUHUR! 🚨\nMac: ${res.Home}-${res.Away}\nSonuc: ${res.Result});
        } else {
            bot.sendMessage(cid, "Temiz.");
        }
    } catch (e) { bot.sendMessage(cid, "Hata!"); }
});

bot.onText(/\/start/, (m) => bot.sendMessage(m.chat.id, "Bot aktif!"));
