const TelegramBot = require('node-telegram-bot-api');
const Tesseract = require('tesseract.js');
const xlsx = require('xlsx');
const fs = require('fs');

const token = '7990998595:AAEeC6KINLvSYEiOuVV1rL_VJNq_pH7MSAg';
const bot = new TelegramBot(token, { polling: true });
const excelFile = './bet365-2023-2025-datas.xlsx';

let list = [];
if (fs.existsSync(excelFile)) {
    const wb = xlsx.readFile(excelFile);
    list = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
}

bot.on('photo', async (msg) => {
    const cid = msg.chat.id;
    bot.sendMessage(cid, "Muhur taraniyor...");
    try {
        const url = await bot.getFileLink(msg.photo[msg.photo.length - 1].file_id);
        const { data: { text } } = await Tesseract.recognize(url, 'eng');
        const nums = text.match(/\d+\.\d{2}/g);
        if (!nums || nums.length < 2) return bot.sendMessage(cid, "Oran yok.");

        const m1 = nums[0];
        const m2 = nums[nums.length - 1];
        const res = list.find(m => (String(m.Open_1) === m1 && String(m.Open_2) === m2) || (String(m.Close_1) === m1 && String(m.Close_2) === m2));

        if (res) {
            bot.sendMessage(cid, "🚨 MUHUR YAKALANDI! 🚨\nMac: " + res.Home + "-" + res.Away + "\nSonuc: " + res.Result);
        } else {
            bot.sendMessage(cid, "Temiz.");
        }
    } catch (e) { bot.sendMessage(cid, "Hata!"); }
});

bot.onText(/\/start/, (m) => bot.sendMessage(m.chat.id, "Bot aktif!"));
